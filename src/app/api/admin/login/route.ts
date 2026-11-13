import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USERNAME, ADMIN_PASSWORD, COOKIE_NAME, createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = createSessionToken();
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      const isHttps = request.url.startsWith("https://");

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: isHttps,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid admin username or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Login processing failed" },
      { status: 500 }
    );
  }
}
