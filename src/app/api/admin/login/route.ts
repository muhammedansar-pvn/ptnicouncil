import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken, verifyAdminCredentials } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Rate-limiting on admin login: max 5 attempts per 10 minutes per IP
    const rateLimit = await checkRateLimit(`login:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please wait ${Math.ceil(rateLimit.resetInSeconds / 60)} minutes before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetInSeconds.toString(),
          },
        }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(username, password);

    if (isValid) {
      const token = createSessionToken();
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      const isProduction = process.env.NODE_ENV === "production";
      const isHttps = request.url.startsWith("https://") || isProduction;

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: isHttps && !request.url.includes("localhost") && !request.url.includes("127.0.0.1"),
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid admin credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Login processing failed" },
      { status: 500 }
    );
  }
}
