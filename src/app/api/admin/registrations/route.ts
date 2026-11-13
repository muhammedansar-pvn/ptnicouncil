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
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const unit = searchParams.get("unit")?.trim() || "";

    const isDbConnected = await connectToDatabase();

    if (isDbConnected) {
      const query: any = {};
      if (unit && unit !== "ALL") {
        query.unit = unit;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { instagramId: { $regex: search, $options: "i" } },
        ];
      }

      const registrations = await Registration.find(query).sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        count: registrations.length,
        registrations,
      });
    } else {
      let records = getLocalRegistrations();

      if (unit && unit !== "ALL") {
        records = records.filter((r) => r.unit === unit);
      }

      if (search) {
        records = records.filter(
          (r) =>
            r.name.toLowerCase().includes(search) ||
            r.mobile.includes(search) ||
            (r.instagramId && r.instagramId.toLowerCase().includes(search))
        );
      }

      return NextResponse.json({
        success: true,
        count: records.length,
        registrations: records,
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
