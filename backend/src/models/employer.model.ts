
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEmployerProfile extends Document {
  user: Types.ObjectId; // Reference to the User model
  companyName: string;
  companyLogo?: string;
  industry: string;
  companySize: string; // e.g., "1-10", "11-50", "51-200", etc.
  location: string;
  founded?: number;
  description?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  contactEmail: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerProfileSchema = new Schema<IEmployerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Auth", required: true, unique: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    industry: { type: String, required: true },
    companySize: { type: String, required: true },
    location: { type: String, required: true },
    founded: { type: Number },
    description: { type: String },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
  },
  { timestamps: true }
);

const EmployerProfile = mongoose.model<IEmployerProfile>("EmployerProfile", EmployerProfileSchema);

export default EmployerProfile;
