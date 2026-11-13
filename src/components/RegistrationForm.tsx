"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Instagram, AlertCircle, Loader2 } from "lucide-react";
import { UNITS } from "@/lib/constants";

export default function RegistrationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    mobile: "",
    instagramId: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) {
        error = "Please enter your full name";
      } else if (value.trim().length < 3) {
        error = "Name must be at least 3 characters";
      }
    } else if (name === "unit") {
      if (!value) {
        error = "Please select your sector unit";
      }
    } else if (name === "mobile") {
      const clean = value.replace(/\D/g, "");
      if (!clean) {
        error = "Mobile number is required";
      } else if (clean.length !== 10) {
        error = `Mobile number must be exactly 10 digits (currently ${clean.length})`;
      } else if (!/^[6-9]/.test(clean)) {
        error = "Indian mobile numbers must start with 6, 7, 8, or 9";
      }
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "mobile") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "instagramId") {
      updatedValue = value.replace(/^@/, "");
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setServerError(null);

    const fieldError = validateField(name, updatedValue);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const nameErr = validateField("name", formData.name);
    const unitErr = validateField("unit", formData.unit);
    const mobileErr = validateField("mobile", formData.mobile);

    const newErrors = {
      name: nameErr,
      unit: unitErr,
      mobile: mobileErr,
    };

    setErrors(newErrors);

    if (nameErr || unitErr || mobileErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.message || "Failed to complete registration. Please check your details.");
        setIsSubmitting(false);
        return;
      }

      // Success: Redirect to success page
      const queryParams = new URLSearchParams({
        id: result.data.id || "",
        name: result.data.name || "",
        unit: result.data.unit || "",
        mobile: result.data.mobile || "",
        instagram: result.data.instagramId || "",
      }).toString();

      router.push(`/success?${queryParams}`);
    } catch {
      setServerError("A network error occurred. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl border border-[#E5EAF1] p-6 sm:p-8 shadow-sm">
      <div className="border-b border-[#E5EAF1] pb-4 mb-6">
        <h2 className="font-bold text-2xl text-[#172033] tracking-normal uppercase">
          Delegate Registration
        </h2>
        <p className="text-xs text-[#64748B] mt-1">
          SSF Puthanathani Sector Student Council 2026 • Fill in your details below
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs font-medium animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full h-11 pl-10 pr-3 bg-white border rounded-lg text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#E5EAF1] focus:border-[#0756A0] focus:ring-1 focus:ring-[#0756A0]"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Sector Unit Selection */}
        <div>
          <label htmlFor="unit" className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1.5">
            Sector Unit <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className={`w-full h-11 pl-10 pr-10 bg-white border rounded-lg text-sm text-[#172033] appearance-none cursor-pointer focus:outline-none transition-colors ${
                errors.unit
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#E5EAF1] focus:border-[#0756A0] focus:ring-1 focus:ring-[#0756A0]"
              }`}
            >
              <option value="">Select your Unit</option>
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#64748B]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.unit && (
            <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.unit}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1.5">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-[#64748B] border-r border-[#E5EAF1] pr-2.5 my-2">
              <Phone className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
              +91
            </div>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              placeholder="10-digit number"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full h-11 pl-20 pr-12 bg-white border rounded-lg text-sm text-[#172033] font-mono placeholder:font-sans placeholder:text-slate-400 focus:outline-none transition-colors ${
                errors.mobile
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#E5EAF1] focus:border-[#0756A0] focus:ring-1 focus:ring-[#0756A0]"
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[11px] font-mono text-[#64748B]">
              {formData.mobile.length}/10
            </div>
          </div>
          {errors.mobile && (
            <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Instagram ID (Optional) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="instagramId" className="block text-xs font-bold uppercase tracking-wider text-[#172033]">
              Instagram ID
            </label>
            <span className="text-[11px] text-[#64748B]">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none text-sm text-[#64748B]">
              @
            </div>
            <input
              id="instagramId"
              name="instagramId"
              type="text"
              placeholder="username"
              value={formData.instagramId}
              onChange={handleChange}
              className="w-full h-11 pl-14 pr-3 bg-white border border-[#E5EAF1] rounded-lg text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:border-[#0756A0] focus:ring-1 focus:ring-[#0756A0] transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-lg bg-[#0756A0] hover:bg-[#054380] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Registering Delegate...</span>
              </>
            ) : (
              <span>Complete Registration</span>
            )}
          </button>
          <p className="text-center text-[11px] text-[#64748B] mt-2">
            One registration per mobile number • All 12 Sector Units
          </p>
        </div>
      </form>
    </div>
  );
}
