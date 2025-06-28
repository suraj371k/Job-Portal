import { create } from "zustand";
import axios from "axios";

export interface EmployerInfo {
  companyName: string;
  industry: string;
  location: string;
}

export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

export interface Job {
  _id: string;
  employer: EmployerInfo;
  title: string;
  JobDescription: string;
  salary: string;
  skills: string;
  jobType: JobType;
  vacancies: number;
  createdAt: Date;
  updatedAt: Date;
}

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  createJob: (job: Partial<Job>) => Promise<void>;
  getJob: (filters?: Record<string, any>) => Promise<void>;
  getMyJob: () => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobById: (id: string) => Promise<void>;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  loading: false,
  error: null,

  createJob: async (jobData: Partial<Job>) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post("/api/v1/job", jobData);
      set((state) => ({
        jobs: [...state.jobs, response.data.data],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create job",
        loading: false,
      });
    }
  },

  getJob: async (filters: Record<string, any> = {}) => {
    try {
      set({ loading: true, error: null });

      let query = "";
      if (filters) {
        const queryParams = new URLSearchParams();
        for (const key in filters) {
          if (filters[key]) {
            queryParams.append(key, filters[key]);
          }
        }
        query = `?${queryParams.toString()}`;
      }

      const response = await axios.get(`/api/v1/job${query}`);
      set({ jobs: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to get jobs",
        loading: false,
      });
    }
  },

  getMyJob: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get("/api/v1/job/employer/jobs");
      set({ jobs: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "failed to get employer jobs",
        loading: false,
      });
    }
  },

  deleteJob: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`/api/v1/job/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          (error as any)?.response?.data?.message || "Failed to delete job",
        loading: false,
      });
    }
  },

  getJobById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/v1/job/${id}`);
      set({ jobs: [response.data.data], loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message, loading: false });
    }
  },
}));
