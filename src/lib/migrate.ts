import { connectToDatabase, getLocalRegistrations, backupLocalRegistrations } from "./db";
import Registration from "@/models/Registration";

export interface MigrationReport {
  totalInJson: number;
  totalInMongoBefore: number;
  imported: number;
  skippedDuplicates: number;
  errors: string[];
  totalInMongoAfter: number;
  timestamp: string;
}

export async function runJsonToMongoMigration(): Promise<MigrationReport> {
  const isDbConnected = await connectToDatabase();
  const report: MigrationReport = {
    totalInJson: 0,
    totalInMongoBefore: 0,
    imported: 0,
    skippedDuplicates: 0,
    errors: [],
    totalInMongoAfter: 0,
    timestamp: new Date().toISOString(),
  };

  if (!isDbConnected) {
    report.errors.push("MongoDB is not accessible. Migration cannot proceed.");
    return report;
  }

  // 1. Create a backup of the local JSON file first
  backupLocalRegistrations();

  const jsonRecords = getLocalRegistrations();
  report.totalInJson = jsonRecords.length;

  if (jsonRecords.length === 0) {
    report.totalInMongoBefore = await Registration.countDocuments();
    report.totalInMongoAfter = report.totalInMongoBefore;
    return report;
  }

  report.totalInMongoBefore = await Registration.countDocuments();

  for (const record of jsonRecords) {
    try {
      // Check if mobile already exists in MongoDB
      const existing = await Registration.findOne({ mobile: record.mobile });
      if (existing) {
        report.skippedDuplicates += 1;
        continue;
      }

      // Insert record preserving timestamps and valid fields
      await Registration.create({
        name: record.name,
        unit: record.unit,
        mobile: record.mobile,
        instagramId: record.instagramId || "",
        createdAt: record.createdAt ? new Date(record.createdAt) : new Date(),
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : new Date(),
      });

      report.imported += 1;
    } catch (err: any) {
      report.errors.push(`Error migrating record for ${record.mobile}: ${err.message}`);
    }
  }

  report.totalInMongoAfter = await Registration.countDocuments();
  return report;
}
