import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// In production, ADMIN_PASSWORD_HASH or a strong ADMIN_PASSWORD is required
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ssf2026";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const AUTH_SECRET = process.env.ADMIN_SECRET || "ssf_puthanathani_sector_student_council_secret_2026";
const COOKIE_NAME = "ssf_council_admin_session";

export async function verifyAdminCredentials(username: string, passwordAttempt: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false;

  // 1. If a bcrypt hash is provided via environment, compare with bcrypt
  if (ADMIN_PASSWORD_HASH) {
    try {
      return await bcrypt.compare(passwordAttempt, ADMIN_PASSWORD_HASH);
    } catch {
      return false;
    }
  }

  // 2. Otherwise compare with ADMIN_PASSWORD using timing-safe comparison
  try {
    const attemptBuf = Buffer.from(passwordAttempt);
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    if (attemptBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(attemptBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(`${ADMIN_USERNAME}:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const [timestamp, signature] = token.split(".");
    if (!timestamp || !signature) return false;

    // Check expiration (24 hours)
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(`${ADMIN_USERNAME}:${timestamp}`)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { ADMIN_USERNAME, COOKIE_NAME };
