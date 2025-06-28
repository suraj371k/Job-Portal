"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { GoogleLoginButton } from "@/components/GoogleLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const RegisterPage = () => {
  const {
    loading: authLoading,
    error: authError,
    register: authRegister,
  } = useAuthStore();

  const router = useRouter();
  
  const {
    register: formRegister,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "all",
  });

  useEffect(() => {
    formRegister("role", { required: "Role is required" });
  }, [formRegister]);

  const onSubmit = async (data: FormData) => {
    if (!data.name || !data.email || !data.password || !data.role) {
      return;
    }
    try {
      await authRegister(data);
      toast.success("Registration successful");
      router.replace("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <motion.h2
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create an account
            </motion.h2>
            <p className="text-gray-500 text-sm">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Input
                type="text"
                placeholder="Full Name"
                className="py-2 h-11"
                {...formRegister("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Email"
                className="py-2 h-11"
                {...formRegister("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Password (min 6 characters)"
                className="py-2 h-11"
                {...formRegister("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Select onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={authLoading || !isValid}
            >
              {authLoading ? "Creating account..." : "Create account"}
            </Button>

            {authError && (
              <p className="text-red-500 text-xs text-center">{authError}</p>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleLoginButton />

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;