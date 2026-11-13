import fs from "fs";
import path from "path";

export interface ActivityLog {
  id: string;
  action: "EDIT" | "DELETE" | "MIGRATE" | "EXPORT" | "LOGIN";
  targetId?: string;
  details: string;
  ip: string;
  timestamp: string;
}

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "admin_activity.log");

export function logAdminActivity(
  action: ActivityLog["action"],
  details: string,
  ip: string = "127.0.0.1",
  targetId?: string
): void {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    const entry: ActivityLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      action,
      targetId,
      details,
      ip,
      timestamp: new Date().toISOString(),
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n", "utf-8");
  } catch (e) {
    console.error("Failed to write admin activity log:", e);
  }
}

export function getAdminActivityLogs(limit: number = 50): ActivityLog[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const lines = fs.readFileSync(LOG_FILE, "utf-8").trim().split("\n");
    return lines
      .filter(Boolean)
      .map((l) => JSON.parse(l))
      .reverse()
      .slice(0, limit);
  } catch {
    return [];
  }
}
