'use client';

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // For Google OAuth, we don't need to pass callbackUrl as a parameter
    // The callback URL is configured in the backend passport strategy
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://job-portal-1-ynet.onrender.com'
      : 'http://localhost:4000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="text-xl" />
      Sign in with Google
    </Button>
  );
}
