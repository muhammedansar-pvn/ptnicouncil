"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Search,
  Phone,
  User,
  AlertCircle,
  Download,
  Home,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Instagram,
  Loader2,
} from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants";

interface RetrievedPass {
  id: string;
  name: string;
  unit: string;
  mobile: string;
  instagramId?: string;
  createdAt: string;
}

export default function LookupPage() {
  const [mobile, setMobile] = useState("");
  const [nameVerification, setNameVerification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pass, setPass] = useState<RetrievedPass | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPass(null);

    const cleanMobile = mobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    if (!nameVerification.trim()) {
      setError("Please enter your registered name for verification.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: cleanMobile,
          nameVerification: nameVerification.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPass(data.data);
      } else {
        setError(data.message || "No registration found. Please check your details.");
      }
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        {/* Lookup Card */}
        {!pass ? (
          <div className="bg-white rounded-xl border border-[#E5EAF1] p-6 sm:p-8 shadow-xs">
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h1 className="font-cooper text-2xl text-[#172033] uppercase">
                Find My Pass
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Lost your confirmation? Enter your registered mobile and name to re-download your digital delegate pass.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1.5">
                  Registered Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-[#64748B] border-r border-[#E5EAF1] pr-2.5 my-2">
                    <Phone className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    placeholder="10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full h-11 pl-20 pr-3 bg-white border border-[#E5EAF1] rounded-lg text-sm font-mono text-[#172033] focus:outline-none focus:border-[#0756A0] focus:ring-1 focus:ring-[#0756A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1.5">
                  Registered Name <span className="text-red-500">*</span>
                  <span className="text-[10px] text-[#64748B] font-normal lowercase ml-1">(for security check)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={nameVerification}
                    onChange={(e) => setNameVerification(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-white border border-[#E5EAF1] rounded-lg text-sm text-[#172033] focus:outline-none focus:border-[#0756A0] focus:ring-1 focus:ring-[#0756A0]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-[#0756A0] hover:bg-[#054380] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching records...</span>
                  </>
                ) : (
                  <span>Retrieve Delegate Pass</span>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E5EAF1] text-center">
              <Link href="/#register" className="text-xs font-semibold text-[#0756A0] hover:underline">
                Not registered yet? Register here
              </Link>
            </div>
          </div>
        ) : (
          /* Retrieved Pass View */
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-cooper text-xl text-[#172033] uppercase">Delegate Pass Retrieved</h2>
              <p className="text-xs text-[#64748B]">Registration record verified successfully.</p>
            </div>

            {/* Pass */}
            <div
              id="retrieved-pass"
              className="bg-white rounded-xl border-2 border-[#0756A0] shadow-sm overflow-hidden text-[#172033] print:shadow-none print:border-black"
            >
              <div className="bg-[#0756A0] text-white p-5 print:bg-white print:text-black print:border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-cooper text-2xl text-white print:text-black">SSF</span>
                    <h3 className="font-bold text-base uppercase tracking-tight text-white print:text-black leading-tight mt-0.5">
                      Puthanathani Sector
                    </h3>
                    <p className="text-xs font-semibold text-blue-100 print:text-black uppercase tracking-wider">
                      Student Council 2026
                    </p>
                  </div>
                  <div className="text-right bg-white/10 px-2.5 py-1 rounded print:border">
                    <span className="text-[10px] text-blue-200 print:text-gray-600 block uppercase">Reg ID</span>
                    <span className="text-xs font-mono font-bold text-white print:text-black">
                      {pass.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3.5 bg-white text-xs">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E5EAF1]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                      <User className="w-3 h-3 text-[#0756A0]" />
                      Delegate Name
                    </span>
                    <p className="text-sm font-bold text-[#172033]">{pass.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                      <Building2 className="w-3 h-3 text-[#0756A0]" />
                      Sector Unit
                    </span>
                    <p className="text-sm font-bold text-[#0756A0]">{pass.unit}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E5EAF1]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                      <Phone className="w-3 h-3 text-[#0756A0]" />
                      Mobile Number
                    </span>
                    <p className="text-xs font-bold font-mono text-[#172033]">+91 {pass.mobile}</p>
                  </div>
                  {pass.instagramId ? (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1 mb-0.5">
                        <Instagram className="w-3 h-3 text-pink-600" />
                        Instagram
                      </span>
                      <p className="text-xs font-medium text-[#172033]">@{pass.instagramId}</p>
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full sm:flex-1 h-11 rounded-lg bg-white hover:bg-slate-50 text-[#172033] font-bold text-xs uppercase tracking-wider border border-[#E5EAF1] shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#64748B]" />
                <span>Print Pass / PDF</span>
              </button>

              <button
                onClick={() => {
                  setPass(null);
                  setMobile("");
                  setNameVerification("");
                }}
                className="w-full sm:flex-1 h-11 rounded-lg bg-white hover:bg-slate-50 text-[#64748B] font-bold text-xs uppercase tracking-wider border border-[#E5EAF1] transition-colors cursor-pointer"
              >
                Search Another
              </button>

              <Link
                href="/"
                className="w-full sm:flex-1 h-11 rounded-lg bg-[#0756A0] hover:bg-[#054380] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
