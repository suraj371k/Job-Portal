import mongoose from 'mongoose';
import { IUser } from './auth.model';

export interface IUserProfile extends mongoose.Document {
  user: IUser['_id'];
  title: string;
  bio: string;
  location: string;
  phone: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }[];
  resume: string;
  jobPreferences: {
    jobTypes: string[];
    expectedSalary: number;
    preferredLocations: string[];
    remotePreference: 'remote' | 'hybrid' | 'onsite';
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new mongoose.Schema<IUserProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    experience: [{
      company: {
        type: String,
        required: true,
        trim: true,
      },
      position: {
        type: String,
        required: true,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        trim: true,
      },
    }],
    education: [{
      institution: {
        type: String,
        required: true,
        trim: true,
      },
      degree: {
        type: String,
        required: true,
        trim: true,
      },
      field: {
        type: String,
        required: true,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
    }],
    resume: {
      type: String, // URL or path to resume file
    },
    jobPreferences: {
      jobTypes: [{
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      }],
      expectedSalary: {
        type: Number,
      },
      preferredLocations: [{
        type: String,
        trim: true,
      }],
      remotePreference: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        default: 'onsite',
      },
    },
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      portfolio: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);


const UserProfile = mongoose.model<IUserProfile>('UserProfile', userProfileSchema);

export default UserProfile;
