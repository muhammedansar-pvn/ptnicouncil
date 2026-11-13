import { NextResponse } from "next/server";
import { connectToDatabase, getLocalRegistrations } from "@/lib/db";
import Registration from "@/models/Registration";
import { UNITS } from "@/lib/constants";

export async function GET() {
  try {
    const isDbConnected = await connectToDatabase();
    let total = 0;
    const unitCounts: Record<string, number> = {};

    UNITS.forEach((u) => {
      unitCounts[u] = 0;
    });

    if (isDbConnected) {
      total = await Registration.countDocuments();
      const aggregation = await Registration.aggregate([
        { $group: { _id: "$unit", count: { $sum: 1 } } },
      ]);
      aggregation.forEach((item) => {
        if (item._id && unitCounts[item._id] !== undefined) {
          unitCounts[item._id] = item.count;
        }
      });
    } else {
      const records = getLocalRegistrations();
      total = records.length;
      records.forEach((r) => {
        if (r.unit && unitCounts[r.unit] !== undefined) {
          unitCounts[r.unit] += 1;
        }
      });
    }

    return NextResponse.json({
      success: true,
      total,
      unitCounts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
