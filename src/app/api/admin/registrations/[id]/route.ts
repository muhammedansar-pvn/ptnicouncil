import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { connectToDatabase, updateLocalRegistration, deleteLocalRegistration } from "@/lib/db";
import Registration from "@/models/Registration";
import { UNITS } from "@/lib/constants";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isAuthenticated();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, unit, mobile, instagramId } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    if (!unit || !UNITS.includes(unit as any)) {
      return NextResponse.json(
        { success: false, message: "Invalid unit selected" },
        { status: 400 }
      );
    }

    const trimmedMobile = (mobile || "").toString().trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(trimmedMobile)) {
      return NextResponse.json(
        { success: false, message: "Invalid Indian mobile number" },
        { status: 400 }
      );
    }

    const cleanInstagram = (instagramId || "").trim().replace(/^@/, "");

    const isDbConnected = await connectToDatabase();

    if (isDbConnected) {
      // Check if mobile already exists for another document
      const duplicate = await Registration.findOne({
        mobile: trimmedMobile,
        _id: { $ne: id },
      });
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: `Mobile ${trimmedMobile} is already in use by ${duplicate.name}` },
          { status: 409 }
        );
      }

      const updated = await Registration.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          unit,
          mobile: trimmedMobile,
          instagramId: cleanInstagram,
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Registration not found" },
          { status: 404 }
        );
      }

      // Sync local
      updateLocalRegistration(id, {
        name: name.trim(),
        unit,
        mobile: trimmedMobile,
        instagramId: cleanInstagram,
      });

      return NextResponse.json({
        success: true,
        message: "Registration updated successfully",
        data: updated,
      });
    } else {
      const updated = updateLocalRegistration(id, {
        name: name.trim(),
        unit,
        mobile: trimmedMobile,
        instagramId: cleanInstagram,
      });

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Registration not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Registration updated successfully",
        data: updated,
      });
    }
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update registration" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isAuthenticated();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const isDbConnected = await connectToDatabase();

    if (isDbConnected) {
      await Registration.findByIdAndDelete(id);
      deleteLocalRegistration(id);
    } else {
      deleteLocalRegistration(id);
    }

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
