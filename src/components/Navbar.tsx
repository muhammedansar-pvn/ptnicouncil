"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0756A0] text-white flex items-center justify-center font-cooper text-xl sm:text-2xl tracking-tighter shrink-0 select-none shadow-xs">
              SSF
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-[#172033] leading-tight tracking-tight uppercase">
                Puthanathani Sector
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0756A0] tracking-wider uppercase">
                Student Council 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#about"
              className="text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0756A0] transition-colors"
            >
              Overview
            </Link>
            <Link
              href="#details"
              className="text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0756A0] transition-colors"
            >
              Units
            </Link>
            <Link
              href="#venue"
              className="text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0756A0] transition-colors"
            >
              Venue
            </Link>
            <Link
              href="#register"
              className="px-4 py-2 rounded-md bg-[#0756A0] hover:bg-[#054380] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Register Now
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#0756A0] bg-[#F7F9FC] hover:bg-slate-100 border border-[#E5EAF1] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="#register"
              className="px-3 py-1.5 rounded-md bg-[#0756A0] text-white text-xs font-bold uppercase tracking-wider"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#64748B] hover:text-[#0756A0] hover:bg-slate-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EAF1] bg-white px-4 py-4 space-y-2">
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider text-[#172033] hover:bg-slate-50 hover:text-[#0756A0]"
          >
            Overview
          </Link>
          <Link
            href="#details"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider text-[#172033] hover:bg-slate-50 hover:text-[#0756A0]"
          >
            Sector Units
          </Link>
          <Link
            href="#venue"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider text-[#172033] hover:bg-slate-50 hover:text-[#0756A0]"
          >
            Venue Details
          </Link>
          <Link
            href="#register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider text-white bg-[#0756A0] text-center"
          >
            Register Now
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-[#64748B] bg-[#F7F9FC] border border-[#E5EAF1] text-center"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      )}
    </header>
  );
}
