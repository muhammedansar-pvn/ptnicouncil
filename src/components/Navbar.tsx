"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <Link href="/" className="inline-flex items-center focus:outline-none" aria-label="Home">
            <Image
              src="/navbar-brand.png"
              alt="Samastha Centenary"
              width={1024}
              height={307}
              priority
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
