import mongoose, { Schema, Types, Document } from "mongoose";

export type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance";


export interface IJob extends Document {
  employer: Types.ObjectId; 
  title: string;
  JobDescription: string;
  salary: string;
  skills: string;
  jobType: JobType;
  vacancies: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    employer: {
      type: Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: [true, "Employer reference is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    JobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [50, "Job description must be at least 50 characters"],
      maxlength: [2000, "Job description cannot exceed 2000 characters"],
    },
    salary: {
      type: String,
      required: [true, "Salary information is required"],
      trim: true,
    },
    skills: {
      type: String,
      required: [true, "Required skills are required"],
      trim: true,
    },
    jobType: {
      type: String,
      enum: {
        values: ["full-time", "part-time", "contract", "internship", "freelance"],
        message: "Job type must be one of: full-time, part-time, contract, internship, freelance",
      },
      required: [true, "Job type is required"],
    },
    vacancies: {
      type: Number,
      required: [true, "Number of vacancies is required"],
      min: [1, "Vacancies must be at least 1"],
      max: [1000, "Vacancies cannot exceed 1000"],
    },
  },
  {
    timestamps: true, 
  }
);

// Index for better query performance
JobSchema.index({ employer: 1, createdAt: -1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ title: 'text', JobDescription: 'text' });

const Job = mongoose.model<IJob>("Job", JobSchema);

export default Job;
