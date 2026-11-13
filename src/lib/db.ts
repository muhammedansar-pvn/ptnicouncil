import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ssf_student_council";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

interface GlobalWithMongoose {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const globalWithMongoose = global as unknown as GlobalWithMongoose;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<boolean> {
  if (cached?.conn) {
    return true;
  }

  // In production, enforce that MONGODB_URI must be provided
  if (IS_PRODUCTION && (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("127.0.0.1"))) {
    console.warn("Production warning: MONGODB_URI is not pointing to a production cluster.");
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("Connected to MongoDB via Mongoose successfully.");
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
    return true;
  } catch (err) {
    cached!.promise = null;
    console.error("MongoDB connection failed:", (err as Error).message);
    return false;
  }
}

// Local File Persistence (Only permitted in Development mode)
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");
const BACKUP_FILE = path.join(DATA_DIR, "registrations.backup.json");

export interface StoredRegistration {
  _id: string;
  name: string;
  unit: string;
  mobile: string;
  instagramId?: string;
  createdAt: string;
  updatedAt: string;
}

export function backupLocalRegistrations(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      fs.writeFileSync(BACKUP_FILE, content, "utf-8");
      console.log("Local registrations successfully backed up to registrations.backup.json");
    }
  } catch (e) {
    console.error("Failed to backup local registrations:", e);
  }
}

export function getLocalRegistrations(): StoredRegistration[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading local registrations:", error);
    return [];
  }
}

export function saveLocalRegistration(record: StoredRegistration): void {
  try {
    const records = getLocalRegistrations();
    records.unshift(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving local registration:", error);
  }
}

export function updateLocalRegistration(id: string, updates: Partial<StoredRegistration>): StoredRegistration | null {
  try {
    const records = getLocalRegistrations();
    const index = records.findIndex((r) => r._id === id);
    if (index === -1) return null;

    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
    return records[index];
  } catch (error) {
    console.error("Error updating local registration:", error);
    return null;
  }
}

export function deleteLocalRegistration(id: string): boolean {
  try {
    const records = getLocalRegistrations();
    const filtered = records.filter((r) => r._id !== id);
    if (filtered.length === records.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error deleting local registration:", error);
    return false;
  }
}
