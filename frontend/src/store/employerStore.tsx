import { create } from "zustand";
import axios, { AxiosError } from "axios";

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface UserInfo {
    avatar: string | Blob | undefined;
    _id: string;
    name: string;
    email: string;
  }
  

export interface EmployerProfile {
  companyName?: string;
  user: UserInfo;
  industry?: string;
  companySize?: string;
  location?: string;
  founded?: number;
  description?: string;
  socialLinks?: SocialLinks;
  contactEmail?: string;
  contactPhone?: string;
}

export type EmployerProfileFormValues = Omit<EmployerProfile, "user" | "founded"> & {
  founded?: string;
}; 

//store + action
interface EmployerProfileState {
  employerProfile: EmployerProfile | null;
  loading: boolean;
  error: string | null;
  fetchEmployerProfile: () => Promise<void>;
  createEmployerProfile: (
    profileData: Partial<EmployerProfile>
  ) => Promise<void>;
  updateEmployerProfile: (
    profileData: Partial<EmployerProfile>
  ) => Promise<EmployerProfile | void>;
  setUserProfile: (profile: EmployerProfile) => void;
  clearUserProfile: () => void;
}

export const useEmployerProfileStore = create<EmployerProfileState>((set) => ({
  employerProfile: null,
  loading: false,
  error: null,

  fetchEmployerProfile: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get("/api/v1/employer/profile", {
        withCredentials: true,
      });
      set({ employerProfile: response.data.data, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createEmployerProfile: async (profileData: Partial<EmployerProfile>) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(
        "/api/v1/employer/profile",
        profileData,
        { withCredentials: true }
      );

      set({ employerProfile: response.data.data, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  updateEmployerProfile: async (profileData: Partial<EmployerProfile>) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(
        "/api/v1/employer/profile",
        profileData,
        { withCredentials: true }
      );
      set({ employerProfile: response.data.data, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  setUserProfile: (profile) => set({ employerProfile: profile }),

  clearUserProfile: () => set({ employerProfile: null }),
}));
