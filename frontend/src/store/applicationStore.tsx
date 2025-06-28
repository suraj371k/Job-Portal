import { create } from "zustand";
import axios from "axios";

export type Status =
  | "applied"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company?: string;
    employer?:{
      companyName?: string;
    }
  };
  candidate: string | { _id: string; name: string; email: string };
  status: Status;
  createdAt: string;
  updatedAt: string;
}

type ApplicationState = {
  application: Application | null;
  applications: Application[];
  loading: boolean;
  error: string | null;
  success: boolean;
  applyJob: (jobId: string) => Promise<void>;
  getUserApplications: () => Promise<void>;
  getAllJobApplications : () => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: Status) => Promise<void>;
  resetState: () => void;
};

export const useApplicationStore = create<ApplicationState>((set) => ({
  loading: false,
  error: null,
  success: false,
  applications: [],
  application: null,

  applyJob: async (jobId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`/api/v1/application/${jobId}/apply`);
      set({
        application: response.data.application,
        success: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to apply",
        loading: false,
      });
    }
  },

  getUserApplications: async () => {
    try {
      set({ loading: false, error: null });
      const response = await axios.get(`/api/v1/application`);
      set({ applications: response.data.applications, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch applications",
        loading: false,
      });
    }
  },

  getAllJobApplications: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/v1/application/all-applicants`);
      set({ applications: response.data.applications, loading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch applications",
        loading: false,
      });
    }
  },

  updateApplicationStatus: async (applicationId: string, status: Status) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(
        `/api/v1/application/${applicationId}/status`,
        { status }
      );
      set({
        application: response.data.application,
        success: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to fetch applications",
        loading: false,
      });
    }
  },
  resetState: () => {
    set({
      loading: false,
      error: null,
      success: false,
      application: null,
    });
  },
}));
