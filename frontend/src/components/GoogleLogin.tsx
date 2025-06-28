'use client';

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const callbackUrl = `${window.location.origin}/auth/google/callback`;
    window.location.href = `/api/v1/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
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
