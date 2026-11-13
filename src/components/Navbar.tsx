"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF1] w-full">
      <div className="relative w-full h-[80px] sm:h-[105px] flex items-center justify-center px-4">
        {/* Perfectly Centered Event Branding Image */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none"
          aria-label="Home"
        >
          <Image
            src="/navbar-brand.png"
            alt="Samastha Centenary Conference"
            width={1024}
            height={307}
            priority
            className="h-[62px] sm:h-[78px] md:h-[85px] w-auto max-w-[85vw] sm:max-w-[360px] md:max-w-[380px] max-h-[68px] sm:max-h-[85px] object-contain select-none"
          />
        </Link>
      </div>
    </header>
  );
}
