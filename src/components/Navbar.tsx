"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/lookup"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-[#172033] hover:text-[#0756A0] bg-[#F7F9FC] hover:bg-slate-100 border border-[#E5EAF1] transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#0756A0]" />
              <span>Find Pass</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#0756A0] bg-white hover:bg-slate-50 border border-[#E5EAF1] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/lookup"
              className="p-2 rounded-md text-[#0756A0] bg-[#F7F9FC] border border-[#E5EAF1]"
              aria-label="Find Pass"
            >
              <Search className="w-4 h-4" />
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
        <div className="sm:hidden border-t border-[#E5EAF1] bg-white px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider text-[#172033] hover:bg-slate-50 hover:text-[#0756A0]"
          >
            Home / Register
          </Link>
          <Link
            href="/lookup"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider text-[#0756A0] hover:bg-slate-50"
          >
            Find Registration Pass
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:bg-slate-50"
          >
            Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}
