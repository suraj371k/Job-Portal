'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { RoleSelection } from '@/components/RoleSelection';

export default function GoogleCallback() {
  const router = useRouter();
  const { setUser, user } = useAuthStore();
  const [userData, setUserData] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the user data from the URL parameters
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');
        const error = params.get('error');
        
        if (error) {
          toast.error(error);
          router.replace('/login');
          return;
        }
        
        if (data) {
          const parsedUserData = JSON.parse(decodeURIComponent(data));
          setUserData(parsedUserData);
          
          // Check if this is a new user based on backend flag
          if (parsedUserData.isNewUser) {
            setIsNewUser(true);
          } else {
            // Existing user, proceed to home page
            setUser(parsedUserData);
            toast.success('Login successful!');
            router.replace('/');
          }
        } else {
          toast.error('No user data received');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error handling Google callback:', error);
        toast.error('Login failed. Please try again.');
        router.replace('/login');
      }
    };

    handleGoogleCallback();
  }, [router, setUser]);

  const handleRoleSelected = (updatedUserData: any) => {
    setUser(updatedUserData);
    setIsNewUser(false);
    toast.success('Login successful!');
    router.replace('/');
  };

  // Show role selection for new users
  if (isNewUser && userData) {
    return <RoleSelection userData={userData} />;
  }

  // Show loading while processing
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
} 