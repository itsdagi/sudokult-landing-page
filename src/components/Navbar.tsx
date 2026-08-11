"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-8" style={{ maxWidth: "1140px" }}>
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="Sudokult"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span
              className="font-bold text-sm tracking-[0.12em] text-white uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              Sudokult
            </span>
          </Link>

          {/* Nav Links — center */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "Features", href: "/#features" },
              { label: "Academy", href: "/#academy" },
              { label: "Blog", href: "/blog" },
              { label: "Donate", href: "/#donate" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="label text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[#0A0A0A] font-bold text-xs tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "#DD5123", letterSpacing: "0.1em", fontSize: "0.65rem" }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M3.18 23.76c.37.21.8.22 1.18.04l13.27-7.65-2.83-2.83-11.62 10.44zm-1.53-20.7A1.5 1.5 0 0 0 1.5 4.5v15a1.5 1.5 0 0 0 .15.66l11.76-10.58L1.65 3.06zM20.32 10.5l-2.9-1.67-3.2 2.88 3.2 2.88 2.92-1.68a1.5 1.5 0 0 0 0-2.41zM4.36.2C3.98.02 3.55.03 3.18.24L14.8 10.68l2.83-2.83L4.36.2z" />
            </svg>
            Play Store
          </a>

        </div>
      </div>
    </header>
  );
}
