import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { connectToDatabase, getLocalRegistrations } from "@/lib/db";
import Registration from "@/models/Registration";

export async function GET(request: NextRequest) {
  try {
    const authorized = await isAuthenticated();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unit = searchParams.get("unit") || "";

    const isDbConnected = await connectToDatabase();
    let records: any[] = [];

    if (isDbConnected) {
      const query: any = {};
      if (unit && unit !== "ALL") query.unit = unit;
      records = await Registration.find(query).sort({ createdAt: -1 }).lean();
    } else {
      records = getLocalRegistrations();
      if (unit && unit !== "ALL") {
        records = records.filter((r) => r.unit === unit);
      }
    }

    // Build CSV with BOM for seamless UTF-8 Excel support
    const headers = [
      "Sl No",
      "Registration ID",
      "Full Name",
      "Unit",
      "Mobile Number",
      "Instagram ID",
      "Registered Date (IST)",
      "Registered Time (IST)",
    ];

    const rows = records.map((item, index) => {
      const dateObj = new Date(item.createdAt);
      const dateStr = dateObj.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      const timeStr = dateObj.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const escape = (val: string = "") => `"${val.replace(/"/g, '""')}"`;

      return [
        index + 1,
        escape(item._id?.toString() || ""),
        escape(item.name || ""),
        escape(item.unit || ""),
        escape(item.mobile || ""),
        escape(item.instagramId ? `@${item.instagramId}` : ""),
        escape(dateStr),
        escape(timeStr),
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

    const dateSlug = new Date().toISOString().split("T")[0];
    const filename = `SSF_Student_Council_Registrations_${dateSlug}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, message: "Export failed" },
      { status: 500 }
    );
  }
}
