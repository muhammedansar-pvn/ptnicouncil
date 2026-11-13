import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import EventPoster from "@/components/EventPoster";
import CountdownTimer from "@/components/CountdownTimer";
import RegistrationForm from "@/components/RegistrationForm";
import StatsCounter from "@/components/StatsCounter";
import { EVENT_DETAILS, UNITS } from "@/lib/constants";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Building,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col">
      {/* Institutional Top Navbar */}
      <Navbar />

      {/* Main Hero Section */}
      <section id="about" className="pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-[#E5EAF1] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#EEF4FA] text-[#0756A0] text-xs font-bold uppercase tracking-wider border border-[#E5EAF1]">
                  Official Delegate Portal
                </span>
                <StatsCounter />
              </div>

              <div>
                <p className="font-cooper text-3xl sm:text-4xl text-[#0756A0] tracking-normal uppercase">
                  SSF
                </p>
                <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#172033] uppercase tracking-tight leading-[1.15] mt-1">
                  Puthanathani Sector <br />
                  <span className="text-[#0756A0]">Student Council</span>
                </h1>
                <p className="text-base font-semibold text-[#0756A0] mt-2 font-malayalam">
                  {EVENT_DETAILS.malayalamOrganizer} • {EVENT_DETAILS.malayalamName}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#64748B] max-w-xl leading-relaxed">
                The official annual Student Council convention of SSF Puthanathani Sector, uniting student activists, leaders, and registered delegates from all 12 units at Irfaa Campus, Vettichira.
              </p>

              {/* Event Schedule Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-[#F7F9FC] p-3.5 rounded-lg border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 text-[#0756A0] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">Date</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#172033]">Nov 13, 2026</p>
                  <p className="text-[11px] text-[#64748B]">Friday (വെള്ളി)</p>
                </div>

                <div className="bg-[#F7F9FC] p-3.5 rounded-lg border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 text-[#0756A0] mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">Time</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#172033]">7:00 PM</p>
                  <p className="text-[11px] text-[#64748B]">Evening Session</p>
                </div>

                <div className="bg-[#F7F9FC] p-3.5 rounded-lg border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 text-[#0756A0] mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">Venue</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#172033]">Irfaa Campus</p>
                  <p className="text-[11px] text-[#64748B]">Vettichira</p>
                </div>
              </div>

              {/* Prominent REGISTER NOW CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="#register"
                  className="px-8 py-3.5 rounded-lg bg-[#0756A0] hover:bg-[#054380] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#details"
                  className="px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-[#172033] font-semibold text-xs uppercase tracking-wider border border-[#E5EAF1] text-center transition-colors"
                >
                  View Sector Units
                </a>
              </div>

              {/* Countdown Component */}
              <div className="pt-3 border-t border-[#E5EAF1]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Council Countdown
                </p>
                <CountdownTimer />
              </div>
            </div>

            {/* Right: Event Poster Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <EventPoster />
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-16 sm:py-20 bg-[#F7F9FC] border-b border-[#E5EAF1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="px-3 py-1 rounded bg-white text-[#0756A0] border border-[#E5EAF1] text-xs font-bold uppercase tracking-wider shadow-xs">
              Registration Form
            </span>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#172033] uppercase mt-2">
              Delegate Registration
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Select your unit and submit your mobile number to confirm your entry pass.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </section>

      {/* Sector Units Directory */}
      <section id="details" className="py-16 bg-white border-b border-[#E5EAF1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#172033] uppercase">
              Participating Units
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              12 units under SSF Puthanathani Sector
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {UNITS.map((unit, index) => (
              <div
                key={unit}
                className="bg-[#F7F9FC] p-3.5 rounded-lg border border-[#E5EAF1] flex items-center gap-3 transition-colors hover:border-[#0756A0]"
              >
                <div className="w-7 h-7 rounded bg-white text-[#0756A0] font-bold text-xs flex items-center justify-center border border-[#E5EAF1] shrink-0 font-mono">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-[#172033] truncate">
                    {unit}
                  </h3>
                  <p className="text-[10px] text-[#64748B]">Puthanathani Sector</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-16 bg-[#F7F9FC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl border border-[#E5EAF1] p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded bg-[#EEF4FA] text-[#0756A0] text-[11px] font-bold uppercase tracking-wider">
                  Event Venue
                </span>
                <h2 className="font-extrabold text-2xl sm:text-3xl text-[#172033] uppercase">
                  Irfaa Campus, Vettichira
                </h2>
                <p className="text-sm font-semibold text-[#0756A0]">
                  ഇർഫാഅ് ക്യാമ്പസ്, വെട്ടിച്ചിറ
                </p>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Located in Vettichira, accessible for delegates across all 12 units of Puthanathani Sector with designated auditorium and seating facilities.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#172033]">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Auditorium
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Easy Road Access
                  </span>
                </div>
              </div>

              <div className="bg-[#F7F9FC] p-6 rounded-lg border border-[#E5EAF1] text-center space-y-3">
                <Building className="w-8 h-8 text-[#0756A0] mx-auto" />
                <h3 className="font-bold text-sm text-[#172033]">Coordination & Assistance</h3>
                <p className="text-xs text-[#64748B]">
                  For unit travel assistance and delegate coordination, please contact your respective SSF Sector conveners.
                </p>
                <Link
                  href="#register"
                  className="inline-block px-5 py-2 rounded-md bg-[#0756A0] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#054380] transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Clean Footer */}
      <footer className="mt-auto bg-white border-t border-[#E5EAF1] py-8 text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="font-cooper text-lg text-[#0756A0]">SSF</span>
            <div>
              <p className="font-bold text-[#172033]">
                SSF PUTHANATHANI SECTOR STUDENT COUNCIL 2026
              </p>
              <p className="text-[11px] text-[#64748B]">
                {EVENT_DETAILS.malayalamOrganizer}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="#register" className="hover:text-[#0756A0] transition-colors">
              Register
            </Link>
            <span>•</span>
            <Link href="#details" className="hover:text-[#0756A0] transition-colors">
              Units
            </Link>
            <span>•</span>
            <Link href="#venue" className="hover:text-[#0756A0] transition-colors">
              Venue
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
