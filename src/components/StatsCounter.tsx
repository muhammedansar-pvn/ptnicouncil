"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function StatsCounter() {
  const [stats, setStats] = useState<{ total: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({ total: data.total });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-[#E5EAF1] shadow-xs text-xs font-semibold text-[#172033]">
      <Users className="w-3.5 h-3.5 text-[#0756A0]" />
      <span>
        <strong className="text-[#0756A0] font-bold mr-1">
          {stats ? stats.total : "--"}
        </strong>
        Delegates Registered
      </span>
    </div>
  );
}
