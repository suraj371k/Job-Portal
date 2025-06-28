import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  picture?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      setUser: (user) => set({ user, isAuthenticated: true }),

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(
            `/api/v1/auth/login`,
            { email, password },
            { withCredentials: true }
          );
          const { _id, name, email: userEmail, role, picture } = res.data;
          set({ user: { _id, name, email: userEmail, role, picture }, isAuthenticated: true, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            loading: false,
          });
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`/api/v1/auth/register`, data, {
            withCredentials: true,
          });
          set({ user: res.data, isAuthenticated: true, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            loading: false,
          });
        }
      },

      logout: async () => {
        try {
          await axios.post(`/api/v1/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
          console.log("Logout failed", error);
        }
        set({ user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        set({ loading: true });
        try {
          const res = await axios.get(`/api/v1/auth/me`, {
            withCredentials: true,
          });
          set({ user: res.data, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, loading: false });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // called after hydration
      },
    }
  )
);
