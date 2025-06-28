"use client";
import { GoogleLoginButton } from "@/components/GoogleLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect } from "react";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    login: authLogin,
    error: authError,
    loading: authLoading,
    user,
    fetchUser
  } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (user) {
      toast.success("Login successful!");
      router.replace("/");
    }
  }, [user, router]);

  const onSubmit = async (data: FormData) => {
    await authLogin(data.email, data.password);
    await fetchUser()
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
          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm">
              Sign in to access your account
            </p>
          </motion.div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Email address"
                className="py-2 h-11"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Password"
                className="py-2 h-11"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end text-sm">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting || authLoading}
            >
              {authLoading ? "Signing in..." : "Sign in"}
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
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;