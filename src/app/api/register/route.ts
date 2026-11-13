import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, getLocalRegistrations, saveLocalRegistration, StoredRegistration } from "@/lib/db";
import Registration from "@/models/Registration";
import { UNITS } from "@/lib/constants";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Rate Limiting: Max 5 registration attempts per 10 minutes per IP
    const rateLimit = await checkRateLimit(`register:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many registration attempts from this device. Please wait ${Math.ceil(
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
    const { name, unit, mobile, instagramId } = body;

    // Validation: Name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Full Name is required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, message: "Name cannot exceed 100 characters" },
        { status: 400 }
      );
    }

    // Validation: Unit
    if (!unit || !UNITS.includes(unit as any)) {
      return NextResponse.json(
        { success: false, message: "Please select a valid unit from Puthanathani Sector" },
        { status: 400 }
      );
    }

    // Validation: Mobile number
    const trimmedMobile = (mobile || "").toString().trim().replace(/\D/g, "");
    const indianMobileRegex = /^[6-9]\d{9}$/;

    if (!indianMobileRegex.test(trimmedMobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 10-digit Indian mobile number (e.g., 9876543210)",
        },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanInstagram = (instagramId || "").trim().replace(/^@/, "");

    const isDbConnected = await connectToDatabase();

    // Production rule: If DB is unreachable, return 503 instead of silent local fallback
    if (IS_PRODUCTION && !isDbConnected) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration database service is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    if (isDbConnected) {
      // Check duplicate mobile in MongoDB
      const existing = await Registration.findOne({ mobile: trimmedMobile });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: `This mobile number (${trimmedMobile}) is already registered for ${existing.name}. Each number can only register once.`,
          },
          { status: 409 }
        );
      }

      // Create new registration in MongoDB
      const registration = await Registration.create({
        name: cleanName,
        unit,
        mobile: trimmedMobile,
        instagramId: cleanInstagram,
      });

      // Mirror to local storage in development
      if (!IS_PRODUCTION) {
        saveLocalRegistration({
          _id: registration._id.toString(),
          name: cleanName,
          unit,
          mobile: trimmedMobile,
          instagramId: cleanInstagram,
          createdAt: registration.createdAt.toISOString(),
          updatedAt: registration.updatedAt.toISOString(),
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: "Registration completed successfully!",
          data: {
            id: registration._id.toString(),
            name: registration.name,
            unit: registration.unit,
            mobile: registration.mobile,
            instagramId: registration.instagramId,
            createdAt: registration.createdAt,
          },
        },
        { status: 201 }
      );
    } else {
      // Development-only local persistence fallback
      const localRecords = getLocalRegistrations();
      const existing = localRecords.find((r) => r.mobile === trimmedMobile);
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: `This mobile number (${trimmedMobile}) is already registered for ${existing.name}. Each number can only register once.`,
          },
          { status: 409 }
        );
      }

      const now = new Date().toISOString();
      const newRecord: StoredRegistration = {
        _id: "reg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        name: cleanName,
        unit,
        mobile: trimmedMobile,
        instagramId: cleanInstagram,
        createdAt: now,
        updatedAt: now,
      };

      saveLocalRegistration(newRecord);

      return NextResponse.json(
        {
          success: true,
          message: "Registration completed successfully!",
          data: {
            id: newRecord._id,
            name: newRecord.name,
            unit: newRecord.unit,
            mobile: newRecord.mobile,
            instagramId: newRecord.instagramId,
            createdAt: newRecord.createdAt,
          },
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "This mobile number is already registered.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
