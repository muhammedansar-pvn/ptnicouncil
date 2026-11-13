import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RegistrationForm from "@/components/RegistrationForm";
import { EVENT_DETAILS } from "@/lib/constants";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* A. Header / Branding Section */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-6 sm:mb-8">
          {/* Prominent SSF Logo Mark - Cooper Black strictly on SSF */}
          <div className="inline-block select-none">
            <span className="font-cooper text-5xl sm:text-6xl text-[#0756A0] tracking-tight">
              SSF
            </span>
          </div>

          <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#172033] uppercase tracking-tight leading-tight">
              Puthanathani Sector <br />
              <span className="text-[#0756A0]">Student Council</span>
            </h1>
            <p className="text-sm font-semibold text-[#0756A0] mt-1.5 font-malayalam">
              {EVENT_DETAILS.malayalamOrganizer} • {EVENT_DETAILS.malayalamName}
            </p>
          </div>
        </div>

        {/* B. Event Details - Compact & Visually Organized Section */}
        <div className="w-full max-w-lg mx-auto mb-6 bg-white rounded-xl border border-[#E5EAF1] p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#E5EAF1]">
            {/* Date */}
            <div className="flex items-center sm:flex-col sm:items-start justify-between sm:justify-start gap-2 pt-2 sm:pt-0">
              <div className="flex items-center gap-1.5 text-[#0756A0]">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">Date</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#172033]">Nov 13, 2026</p>
                <p className="text-[11px] text-[#64748B]">Friday (വെള്ളി)</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center sm:flex-col sm:items-start justify-between sm:justify-start gap-2 pt-2 sm:pt-0 sm:pl-4">
              <div className="flex items-center gap-1.5 text-[#0756A0]">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">Time</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#172033]">7:00 PM</p>
                <p className="text-[11px] text-[#64748B]">Evening</p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center sm:flex-col sm:items-start justify-between sm:justify-start gap-2 pt-2 sm:pt-0 sm:pl-4">
              <div className="flex items-center gap-1.5 text-[#0756A0]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">Venue</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#172033]">Irfaa Campus</p>
                <p className="text-[11px] text-[#64748B]">Vettichira</p>
              </div>
            </div>
          </div>
        </div>

        {/* C. Registration Form Card */}
        <div id="register" className="w-full">
          <RegistrationForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-[#E5EAF1] py-6 text-xs text-[#64748B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-cooper text-base text-[#0756A0]">SSF</span>
            <span className="font-bold text-[#172033]">
              Puthanathani Sector Student Council 2026
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/lookup" className="hover:text-[#0756A0] transition-colors">
              Find Pass
            </Link>
            <span>•</span>
            <Link href="/admin" className="text-[#0756A0] font-semibold hover:underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
