"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <span className="font-cooper text-2xl sm:text-3xl text-[#0756A0] tracking-tight shrink-0 select-none">
              SSF
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-[#172033] leading-tight tracking-tight uppercase">
                Puthanathani Sector
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0756A0] tracking-wider uppercase">
                Student Council 2026
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
