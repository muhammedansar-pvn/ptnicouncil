import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, getLocalRegistrations } from "@/lib/db";
import Registration from "@/models/Registration";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Rate Limiting: Max 5 lookup attempts per 10 minutes per IP to prevent number scraping
    const rateLimit = await checkRateLimit(`lookup:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many lookup attempts. Please wait ${Math.ceil(
            rateLimit.resetInSeconds / 60
          )} minutes before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetInSeconds.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { mobile, nameVerification } = body;

    const trimmedMobile = (mobile || "").toString().trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(trimmedMobile)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit registered mobile number." },
        { status: 400 }
      );
    }

    if (!nameVerification || typeof nameVerification !== "string" || nameVerification.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Please enter your registered name for security verification." },
        { status: 400 }
      );
    }

    const cleanNameHint = nameVerification.trim().toLowerCase();

    const isDbConnected = await connectToDatabase();
    let record: any = null;

    if (isDbConnected) {
      record = await Registration.findOne({ mobile: trimmedMobile });
    } else {
      const localRecords = getLocalRegistrations();
      record = localRecords.find((r) => r.mobile === trimmedMobile);
    }

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "No registration found matching this mobile number and name. Please verify your details or register anew.",
        },
        { status: 404 }
      );
    }

    // Security Verification: Ensure the provided name verification matches
    const actualName = (record.name || "").toLowerCase();
    const isNameMatch = actualName.includes(cleanNameHint) || cleanNameHint.includes(actualName.slice(0, 3));

    if (!isNameMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "The name provided does not match our registration records for this mobile number.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration pass retrieved successfully.",
      data: {
        id: record._id.toString(),
        name: record.name,
        unit: record.unit,
        mobile: record.mobile,
        instagramId: record.instagramId || "",
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Lookup failed. Please try again." },
      { status: 500 }
    );
  }
}
