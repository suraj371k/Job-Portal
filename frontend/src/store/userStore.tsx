import { create } from "zustand";
import axios, { AxiosError } from "axios";

// Types

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface UserInfo {
  avatar: string | Blob | undefined;
  _id: string;
  name: string;
  email: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface JobPreferences {
  jobType: string[];
  expectedSalary: number;
  preferredLocations: string[];
  remotePreference: "remote" | "hybrid" | "onsite";
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface UserProfile {
  _id: string;
  user: UserInfo;
  title: string;
  bio: string;
  location: string;
  phone: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resume?: string;
  jobPreferences: JobPreferences;
  socialLinks: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

// Store State + Actions

interface UserProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  createUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (
    profileData: Partial<UserProfile>
  ) => Promise<UserProfile | void>;
  uploadResume: (file: File) => Promise<string>;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  userProfile: null,
  loading: false,
  error: null,

  fetchUserProfile: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/v1/user/profile/me`, {
        withCredentials: true,
      });
      set({ userProfile: response.data.data, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createUserProfile: async (profileData: Partial<UserProfile>) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.post(
        "/api/v1/user/profile/me",
         profileData ,
        {
          withCredentials: true,
        }
      );
      set({ userProfile: response.data.data, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  updateUserProfile: async (profileData: Partial<UserProfile>) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put("/api/v1/user/profile/me", profileData, {
        withCredentials: true,
      });
      set({ userProfile: response.data.data, loading: false });
      return response.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  uploadResume: async (file: File) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "/api/v1/user/profile/resume",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state with new resume URL
      set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, resume: response.data.data.resumeUrl }
          : null,
        loading: false,
      }));

      return response.data.data.resumeUrl;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  setUserProfile: (profile) => set({ userProfile: profile }),

  clearUserProfile: () => set({ userProfile: null }),
}));
