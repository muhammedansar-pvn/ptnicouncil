import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { connectToDatabase, getLocalRegistrations } from "@/lib/db";
import Registration from "@/models/Registration";
import { sanitizeSearchQuery } from "@/lib/sanitize";

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
    const rawSearch = searchParams.get("search");
    const sanitizedSearch = sanitizeSearchQuery(rawSearch, 80);
    const unit = searchParams.get("unit")?.trim() || "";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const rawLimit = parseInt(searchParams.get("limit") || "25", 10);
    const limit = rawLimit <= 0 ? 0 : Math.min(100, rawLimit); // 0 = all, max 100 per page

    const isDbConnected = await connectToDatabase();

    if (isDbConnected) {
      const query: any = {};
      if (unit && unit !== "ALL") {
        query.unit = unit;
      }
      if (sanitizedSearch) {
        query.$or = [
          { name: { $regex: sanitizedSearch, $options: "i" } },
          { mobile: { $regex: sanitizedSearch, $options: "i" } },
          { instagramId: { $regex: sanitizedSearch, $options: "i" } },
        ];
      }

      const totalCount = await Registration.countDocuments(query);
      let queryCursor = Registration.find(query).sort({ createdAt: -1 });

      if (limit > 0) {
        const skip = (page - 1) * limit;
        queryCursor = queryCursor.skip(skip).limit(limit);
      }

      const registrations = await queryCursor.lean();
      const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;

      return NextResponse.json({
        success: true,
        count: registrations.length,
        totalCount,
        page,
        limit,
        totalPages,
        registrations,
      });
    } else {
      let records = getLocalRegistrations();

      if (unit && unit !== "ALL") {
        records = records.filter((r) => r.unit === unit);
      }

      if (sanitizedSearch) {
        const lowerSearch = sanitizedSearch.toLowerCase();
        records = records.filter(
          (r) =>
            r.name.toLowerCase().includes(lowerSearch) ||
            r.mobile.includes(lowerSearch) ||
            (r.instagramId && r.instagramId.toLowerCase().includes(lowerSearch))
        );
      }

      const totalCount = records.length;
      let paginated = records;

      if (limit > 0) {
        const start = (page - 1) * limit;
        paginated = records.slice(start, start + limit);
      }

      const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;

      return NextResponse.json({
        success: true,
        count: paginated.length,
        totalCount,
        page,
        limit,
        totalPages,
        registrations: paginated,
      });
    }
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
