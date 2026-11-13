import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { runJsonToMongoMigration } from "@/lib/migrate";

export async function POST() {
  try {
    const authorized = await isAuthenticated();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const report = await runJsonToMongoMigration();

    return NextResponse.json({
      success: true,
      message: "Data migration completed",
      report,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Migration failed" },
      { status: 500 }
    );
  }
}
