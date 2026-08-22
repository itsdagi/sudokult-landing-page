"use client";

import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Academy", href: "/#academy" },
  { label: "Blog", href: "/blog" },
  { label: "Donate", href: "/#donate" },
];

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "#0A0A0A",
        paddingTop: "5rem",
        paddingBottom: "3rem",
      }}
    >
      <div className="container mx-auto px-8" style={{ maxWidth: "1140px" }}>

        {/* Top row: logo + nav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
              <Image src="/logo.png" alt="Sudokult" fill sizes="28px" className="object-cover" />
            </div>
            <span
              className="font-bold text-sm text-white uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              Sudokult
            </span>
          </Link>

          <nav className="flex items-center gap-8 flex-wrap">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="label text-white/30 hover:text-white/60 transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "3rem" }} />

        {/* Bottom: copyright + Play Store */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="label text-white/20" style={{ fontSize: "0.6rem" }}>
              © {new Date().getFullYear()} Sudokult. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="label text-white/20 hover:text-white/40 transition-colors" style={{ fontSize: "0.6rem" }}>
                Privacy
              </Link>
              <Link href="#" className="label text-white/20 hover:text-white/40 transition-colors" style={{ fontSize: "0.6rem" }}>
                Terms
              </Link>
            </div>
          </div>

          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-white font-semibold text-xs transition-all hover:opacity-90"
            style={{ background: "#DD5123", letterSpacing: "0.02em" }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M3.18 23.76c.37.21.8.22 1.18.04l13.27-7.65-2.83-2.83-11.62 10.44zm-1.53-20.7A1.5 1.5 0 0 0 1.5 4.5v15a1.5 1.5 0 0 0 .15.66l11.76-10.58L1.65 3.06zM20.32 10.5l-2.9-1.67-3.2 2.88 3.2 2.88 2.92-1.68a1.5 1.5 0 0 0 0-2.41zM4.36.2C3.98.02 3.55.03 3.18.24L14.8 10.68l2.83-2.83L4.36.2z" />
            </svg>
            Download Free
          </a>
        </div>

      </div>
    </footer>
  );
}
