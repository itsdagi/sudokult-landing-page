-- Telegram-based authentication
--
-- Design: Supabase Auth's native phone-OTP flow (signInWithOtp / verifyOtp) is reused
-- as-is for session issuance — this migration does NOT add a custom OTP table. Instead,
-- a Supabase Auth "Send SMS Hook" is pointed at our own endpoint, which looks up the
-- Telegram chat linked to the phone number and delivers the OTP that GoTrue already
-- generated. This means OTP generation, hashing, expiry, and single-use enforcement are
-- all handled by Supabase Auth itself (audited, battle-tested) rather than reimplemented.
--
-- What IS custom here is the *linking* between a phone number and a Telegram chat,
-- since a Telegram bot cannot resolve a phone number to a chat on its own.

-- ============================================================================
-- telegram_accounts — the durable link between a Sudokult (auth.users) account
-- and a verified Telegram identity + phone number.
-- ============================================================================
create table if not exists public.telegram_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  telegram_user_id bigint not null,
  telegram_chat_id bigint not null,
  phone_number text not null,
  linked_at timestamptz not null default now(),
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint telegram_accounts_user_id_key unique (user_id),
  constraint telegram_accounts_telegram_user_id_key unique (telegram_user_id),
  constraint telegram_accounts_phone_number_key unique (phone_number),
  constraint telegram_accounts_phone_number_format check (phone_number ~ '^\+[1-9]\d{6,14}$')
);

create index if not exists telegram_accounts_phone_number_idx on public.telegram_accounts (phone_number);
create index if not exists telegram_accounts_telegram_user_id_idx on public.telegram_accounts (telegram_user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists telegram_accounts_set_updated_at on public.telegram_accounts;
create trigger telegram_accounts_set_updated_at
  before update on public.telegram_accounts
  for each row execute function public.set_updated_at();

alter table public.telegram_accounts enable row level security;

-- Users may read their own link status. All writes go through server-side
-- (service role) code only — no insert/update/delete policies are defined,
-- so authenticated/anon clients cannot modify telegram identity data directly.
create policy "telegram_accounts_select_own"
  on public.telegram_accounts for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- telegram_link_tokens — short-lived, single-use tokens for the
-- "Connect Telegram" deep-link flow (/start <token> in the bot).
-- ============================================================================
create table if not exists public.telegram_link_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  -- null user_id = an anonymous "sign up via Telegram" link (no existing session yet)
  user_id uuid references auth.users(id) on delete cascade,
  telegram_user_id bigint,
  telegram_chat_id bigint,
  -- set only for anonymous (user_id is null) tokens, for per-IP rate limiting
  request_ip text,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists telegram_link_tokens_chat_pending_idx
  on public.telegram_link_tokens (telegram_chat_id, created_at desc)
  where used_at is null;

create index if not exists telegram_link_tokens_anon_ip_idx
  on public.telegram_link_tokens (request_ip, created_at desc)
  where user_id is null;

alter table public.telegram_link_tokens enable row level security;
-- Fully service-role only: no policies for anon/authenticated roles.

-- ============================================================================
-- telegram_otp_requests — lightweight per-phone/per-IP rate limiting for
-- OTP send requests (Supabase's own phone-auth throttle is a backstop, this
-- is the app-level limit called out in the spec).
-- ============================================================================
create table if not exists public.telegram_otp_requests (
  id bigint generated always as identity primary key,
  phone_number text not null,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists telegram_otp_requests_phone_idx on public.telegram_otp_requests (phone_number, created_at desc);
create index if not exists telegram_otp_requests_ip_idx on public.telegram_otp_requests (ip, created_at desc);

alter table public.telegram_otp_requests enable row level security;
-- Fully service-role only.

-- ============================================================================
-- telegram_verify_attempts — brute-force lockout for OTP verification,
-- keyed by phone number.
-- ============================================================================
create table if not exists public.telegram_verify_attempts (
  phone_number text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.telegram_verify_attempts enable row level security;
-- Fully service-role only.

-- ============================================================================
-- get_user_id_by_phone — used only by the webhook handler (service role) to
-- find a pre-existing auth.users account for a phone number when a brand-new
-- user links Telegram before ever creating a Sudokult session. The auth
-- schema isn't exposed over PostgREST, so this SECURITY DEFINER function is
-- the narrow, explicit bridge — execute is restricted to service_role only.
-- ============================================================================
create or replace function public.get_user_id_by_phone(p_phone text)
returns uuid
language sql
security definer
set search_path = auth, pg_temp
as $$
  select id from auth.users where phone = p_phone limit 1;
$$;

revoke all on function public.get_user_id_by_phone(text) from public, anon, authenticated;
grant execute on function public.get_user_id_by_phone(text) to service_role;
