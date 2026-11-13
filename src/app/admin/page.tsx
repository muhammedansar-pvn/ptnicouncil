"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  User,
  LogOut,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  RefreshCw,
  Users,
  AlertCircle,
  X,
  Loader2,
  Home,
  BarChart3,
  Calendar,
  Building,
} from "lucide-react";
import { UNITS } from "@/lib/constants";

interface RegistrationItem {
  _id: string;
  name: string;
  unit: string;
  mobile: string;
  instagramId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("ALL");

  // Editing state
  const [editingItem, setEditingItem] = useState<RegistrationItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", unit: "", mobile: "", instagramId: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRegistrations = async () => {
    setIsLoadingData(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedUnit && selectedUnit !== "ALL") params.append("unit", selectedUnit);

      const res = await fetch(`/api/admin/registrations?${params.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoadingData(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedUnit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchRegistrations();
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch {
      setLoginError("Login failed. Check your network.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  const handleOpenEdit = (item: RegistrationItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      unit: item.unit,
      mobile: item.mobile,
      instagramId: item.instagramId || "",
    });
    setEditError("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsUpdating(true);
    setEditError("");

    try {
      const res = await fetch(`/api/admin/registrations/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingItem(null);
        fetchRegistrations();
      } else {
        setEditError(data.message || "Update failed");
      }
    } catch {
      setEditError("Failed to update registration");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/registrations/${deletingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingId(null);
        fetchRegistrations();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (selectedUnit && selectedUnit !== "ALL") params.append("unit", selectedUnit);
    window.location.href = `/api/admin/export?${params.toString()}`;
  };

  // Unit-wise statistics calculation
  const unitStats = useMemo(() => {
    const stats: Record<string, number> = {};
    UNITS.forEach((u) => {
      stats[u] = 0;
    });

    registrations.forEach((r) => {
      if (stats[r.unit] !== undefined) {
        stats[r.unit] += 1;
      }
    });

    return stats;
  }, [registrations]);

  // Loading Screen
  if (isAuthenticated === null && isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#0756A0]" />
          <p className="text-xs font-semibold text-[#64748B]">Loading Administrative Portal...</p>
        </div>
      </div>
    );
  }

  // Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-4 text-[#172033]">
        <div className="w-full max-w-sm bg-white rounded-xl border border-[#E5EAF1] p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-[#0756A0] text-white flex items-center justify-center mx-auto mb-3 font-cooper text-xl">
              SSF
            </div>
            <h1 className="font-extrabold text-xl text-[#172033] uppercase">Admin Portal</h1>
            <p className="text-xs text-[#64748B] mt-0.5">SSF Puthanathani Sector Student Council 2026</p>
          </div>

          {loginError && (
            <div className="mb-4 p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 bg-white border border-[#E5EAF1] rounded-md text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0756A0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 bg-white border border-[#E5EAF1] rounded-md text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0756A0]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-10 rounded-md bg-[#0756A0] hover:bg-[#054380] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E5EAF1] text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0756A0]">
              <Home className="w-3.5 h-3.5" />
              Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-[#E5EAF1] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#0756A0] text-white flex items-center justify-center font-cooper text-base shrink-0">
              SSF
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-[#172033] uppercase leading-tight">
                Student Council Administration
              </h1>
              <p className="text-[11px] text-[#64748B]">SSF Puthanathani Sector</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#0756A0] hover:bg-slate-50 border border-[#E5EAF1]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-lg border border-[#E5EAF1] shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-[#64748B] tracking-wider">Total Registered</p>
              <p className="text-xl font-bold font-mono text-[#172033]">{registrations.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E5EAF1] shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-[#64748B] tracking-wider">Sector Units</p>
              <p className="text-xl font-bold font-mono text-[#172033]">{UNITS.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E5EAF1] shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-[#64748B] tracking-wider">Event Date</p>
              <p className="text-sm font-bold text-[#172033]">Nov 13, 2026</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E5EAF1] shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-[#EEF4FA] text-[#0756A0] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-[#64748B] tracking-wider">Portal Status</p>
              <p className="text-xs font-bold text-emerald-700">Active & Accepting</p>
            </div>
          </div>
        </div>

        {/* Unit-Wise Registration Statistics */}
        <div className="bg-white rounded-lg border border-[#E5EAF1] shadow-xs p-5">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#E5EAF1]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0756A0]" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#172033]">
                Unit-Wise Distribution
              </h2>
            </div>
            <span className="text-[11px] text-[#64748B]">
              12 Units in Puthanathani Sector
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {UNITS.map((unit) => {
              const count = unitStats[unit] || 0;
              const percentage = registrations.length > 0 ? Math.round((count / registrations.length) * 100) : 0;
              return (
                <div
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className={`p-3 rounded-md border transition-colors cursor-pointer ${
                    selectedUnit === unit
                      ? "border-[#0756A0] bg-[#EEF4FA]"
                      : "border-[#E5EAF1] bg-[#F7F9FC] hover:bg-slate-100/70"
                  }`}
                >
                  <p className="text-xs font-bold text-[#172033] truncate">{unit}</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold font-mono text-[#0756A0]">{count}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Participants Table */}
        <div className="bg-white rounded-lg border border-[#E5EAF1] shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-[#E5EAF1] flex flex-col md:flex-row items-center justify-between gap-3 bg-[#F7F9FC]">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-72 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search name or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 bg-white border border-[#E5EAF1] rounded-md text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0756A0]"
              />
            </form>

            {/* Filter and Export Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="bg-white border border-[#E5EAF1] rounded-md px-2.5 h-9 text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0756A0] cursor-pointer"
                >
                  <option value="ALL">All Units</option>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchRegistrations}
                disabled={isLoadingData}
                className="h-9 px-2.5 rounded-md border border-[#E5EAF1] bg-white hover:bg-slate-50 text-[#64748B] transition-colors cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin text-[#0756A0]" : ""}`} />
              </button>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md bg-[#0756A0] hover:bg-[#054380] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#172033]">
              <thead className="bg-[#F7F9FC] uppercase text-[10px] font-bold text-[#64748B] tracking-wider border-b border-[#E5EAF1]">
                <tr>
                  <th className="py-2.5 px-3.5 w-10 text-center">#</th>
                  <th className="py-2.5 px-3.5">Name</th>
                  <th className="py-2.5 px-3.5">Unit</th>
                  <th className="py-2.5 px-3.5">Mobile</th>
                  <th className="py-2.5 px-3.5">Instagram</th>
                  <th className="py-2.5 px-3.5">Date & Time (IST)</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF1]">
                {isLoadingData ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#64748B]">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#0756A0] mb-1.5" />
                      Loading records...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#64748B]">
                      No delegate registrations found.
                    </td>
                  </tr>
                ) : (
                  registrations.map((item, index) => {
                    const dateObj = new Date(item.createdAt);
                    const formattedDate = dateObj.toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    });
                    const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });

                    return (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3.5 text-center font-mono text-[#64748B]">
                          {index + 1}
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-[#172033]">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded bg-[#EEF4FA] text-[#0756A0] font-semibold text-[11px] border border-[#E5EAF1]">
                            {item.unit}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-[#172033]">
                          +91 {item.mobile}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#64748B]">
                          {item.instagramId ? `@${item.instagramId}` : "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#64748B]">
                          <span>{formattedDate}</span>{" "}
                          <span className="text-[10px] text-slate-400">({formattedTime})</span>
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 rounded text-[#64748B] hover:text-[#0756A0] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit registration"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(item._id)}
                              className="p-1 rounded text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete registration"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 border-t border-[#E5EAF1] bg-[#F7F9FC] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>
              Total: <strong>{registrations.length}</strong> registered delegates
            </span>
            <span>SSF Puthanathani Sector Student Council 2026</span>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 border border-[#E5EAF1] shadow-lg space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E5EAF1]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#172033]">Edit Delegate Record</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#64748B] hover:text-[#172033] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#172033] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 border border-[#E5EAF1] rounded-md text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0756A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#172033] mb-1">Sector Unit</label>
                <select
                  value={editForm.unit}
                  onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                  className="w-full h-9 px-2.5 border border-[#E5EAF1] rounded-md text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0756A0]"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#172033] mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={editForm.mobile}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  className="w-full h-9 px-3 border border-[#E5EAF1] rounded-md text-xs font-mono text-[#172033] focus:outline-none focus:border-[#0756A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#172033] mb-1">Instagram ID (Optional)</label>
                <input
                  type="text"
                  value={editForm.instagramId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, instagramId: e.target.value.replace(/^@/, "") })
                  }
                  className="w-full h-9 px-3 border border-[#E5EAF1] rounded-md text-xs text-[#172033] focus:outline-none focus:border-[#0756A0]"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-md text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#0756A0] text-white hover:bg-[#054380] cursor-pointer disabled:opacity-75 flex items-center gap-1.5"
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xs w-full p-5 border border-[#E5EAF1] shadow-lg text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#172033]">Delete Delegate Record</h3>
              <p className="text-[11px] text-[#64748B] mt-1">
                Are you sure you want to remove this registration record?
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-1.5 rounded-md text-xs font-bold text-[#64748B] bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-1"
              >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
