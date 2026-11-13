import mongoose, { Schema, Document, Model } from "mongoose";
import { UNITS } from "@/lib/constants";

export interface IRegistration extends Document {
  name: string;
  unit: string;
  mobile: string;
  instagramId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: {
        values: UNITS,
        message: "{VALUE} is not a valid unit",
      },
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"],
    },
    instagramId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent compiling model multiple times in Next.js hot reload
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
