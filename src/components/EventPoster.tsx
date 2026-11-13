"use client";

import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/constants";

export default function EventPoster() {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md overflow-hidden rounded-xl border-2 border-[#0756A0] bg-white shadow-md text-[#172033]">
      {/* Top Banner Header */}
      <div className="bg-[#0756A0] text-white p-6 sm:p-7 text-center relative">
        <div className="inline-block px-3 py-1 rounded bg-white/10 text-blue-100 text-[11px] font-bold tracking-widest uppercase mb-3">
          Official Council 2026
        </div>

        {/* Brand Headings in Cooper Black */}
        <h1 className="font-cooper text-4xl sm:text-5xl text-white tracking-normal leading-none">
          SSF
        </h1>
        <h2 className="font-bold text-lg sm:text-xl text-blue-100 mt-1 uppercase tracking-tight">
          Puthanathani Sector
        </h2>
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="font-extrabold text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Student Council
          </p>
          <p className="text-sm font-medium text-blue-200 mt-1">
            സ്റ്റുഡന്റ് കൗൺസിൽ 2026
          </p>
        </div>
      </div>

      {/* Poster Body */}
      <div className="p-6 space-y-4 bg-white">
        {/* Schedule Information */}
        <div className="space-y-3 bg-[#F7F9FC] p-4 rounded-lg border border-[#E5EAF1]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-[#64748B] tracking-wider">Date</p>
              <p className="text-sm font-bold text-[#172033]">{EVENT_DETAILS.date}</p>
              <p className="text-xs text-[#64748B]">{EVENT_DETAILS.malayalamDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-[#64748B] tracking-wider">Time</p>
              <p className="text-sm font-bold text-[#172033]">{EVENT_DETAILS.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-[#64748B] tracking-wider">Venue</p>
              <p className="text-sm font-bold text-[#172033]">{EVENT_DETAILS.venue}</p>
              <p className="text-xs text-[#64748B]">{EVENT_DETAILS.malayalamVenue}</p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] border-t border-[#E5EAF1]">
          <span className="font-semibold text-[#0756A0]">12 Participating Units</span>
          <span>Online Delegate Entry</span>
        </div>
      </div>
    </div>
  );
}
