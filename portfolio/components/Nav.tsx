"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="logo">
          sunidhi<span>.nayak</span>
        </Link>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <Link href="/about" onClick={() => setOpen(false)}>
            about
          </Link>
          <Link href="/work" onClick={() => setOpen(false)}>
            work
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            contact
          </Link>
        </div>

        <Link href="/contact" className="nav-cta">
          hire me
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
