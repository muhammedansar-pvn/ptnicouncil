"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Home,
  User,
  Phone,
  Building2,
  Instagram,
  Download,
} from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants";

function SuccessContent() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") || "SC-" + Math.floor(100000 + Math.random() * 900000);
  const name = searchParams.get("name") || "Registered Delegate";
  const unit = searchParams.get("unit") || "Puthanathani";
  const mobile = searchParams.get("mobile") || "";
  const instagram = searchParams.get("instagram") || "";

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#0756A0", "#64748B", "#172033"],
      });
    } catch {
      // Graceful fallback
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Status Confirmation Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
            Registration Confirmed
          </span>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#172033] uppercase">
            Registration Successful
          </h1>
          <p className="text-xs text-[#64748B]">
            Your seat is reserved for SSF Puthanathani Sector Student Council 2026
          </p>
        </div>

        {/* Digital Delegate Entry Pass */}
        <div
          id="delegate-pass"
          className="bg-white rounded-xl border-2 border-[#0756A0] shadow-sm overflow-hidden text-[#172033] print:shadow-none print:border-black"
        >
          {/* Pass Header */}
          <div className="bg-[#0756A0] text-white p-5 print:bg-white print:text-black print:border-b">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-cooper text-2xl text-white print:text-black">SSF</span>
                <h2 className="font-bold text-base uppercase tracking-tight text-white print:text-black leading-tight mt-0.5">
                  Puthanathani Sector
                </h2>
                <p className="text-xs font-semibold text-blue-100 print:text-black uppercase tracking-wider">
                  Student Council 2026
                </p>
              </div>
              <div className="text-right bg-white/10 px-2.5 py-1 rounded print:border">
                <span className="text-[10px] text-blue-200 print:text-gray-600 block uppercase">Reg ID</span>
                <span className="text-xs font-mono font-bold text-white print:text-black">
                  {id.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          {/* Pass Details */}
          <div className="p-5 space-y-3.5 bg-white text-xs">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E5EAF1]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                  <User className="w-3 h-3 text-[#0756A0]" />
                  Delegate Name
                </span>
                <p className="text-sm font-bold text-[#172033]">{name}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                  <Building2 className="w-3 h-3 text-[#0756A0]" />
                  Sector Unit
                </span>
                <p className="text-sm font-bold text-[#0756A0]">{unit}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E5EAF1]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                  <Phone className="w-3 h-3 text-[#0756A0]" />
                  Mobile Number
                </span>
                <p className="text-xs font-bold font-mono text-[#172033]">+91 {mobile}</p>
              </div>
              {instagram ? (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                    <Instagram className="w-3 h-3 text-pink-600" />
                    Instagram
                  </span>
                  <p className="text-xs font-medium text-[#172033]">@{instagram}</p>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] mb-0.5 block">
                    Status
                  </span>
                  <p className="text-xs font-semibold text-emerald-700">Seat Confirmed</p>
                </div>
              )}
            </div>

            {/* Schedule & Venue Block */}
            <div className="bg-[#F7F9FC] p-3 rounded-lg border border-[#E5EAF1] space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#172033]">
                <Calendar className="w-3.5 h-3.5 text-[#0756A0]" />
                <span className="font-bold">{EVENT_DETAILS.date}</span>
                <span className="text-[#64748B]">•</span>
                <Clock className="w-3.5 h-3.5 text-[#0756A0]" />
                <span className="font-bold">{EVENT_DETAILS.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#64748B]">
                <MapPin className="w-3.5 h-3.5 text-[#0756A0]" />
                <span>{EVENT_DETAILS.venue} ({EVENT_DETAILS.malayalamVenue})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:flex-1 h-11 rounded-lg bg-white hover:bg-slate-50 text-[#172033] font-bold text-xs uppercase tracking-wider border border-[#E5EAF1] shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            <span>Print Pass / PDF</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 h-11 rounded-lg bg-[#0756A0] hover:bg-[#054380] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] text-xs font-semibold text-[#64748B]">
          Loading Pass Details...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
