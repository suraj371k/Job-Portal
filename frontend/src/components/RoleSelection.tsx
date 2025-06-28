'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Building2 } from "lucide-react";
import axios from "axios";

interface RoleSelectionProps {
  userData: {
    _id: string;
    name: string;
    email: string;
    role: string;
    picture?: string;
    isNewUser?: boolean;
  };
}

export function RoleSelection({ userData }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'user' | 'employer' | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);
    try {
      // Update user role in backend
      const response = await axios.put('/api/v1/auth/update-role', 
        { role: selectedRole },
        { withCredentials: true }
      );

      // Update user data with new role from response
      const updatedUser = response.data;
      setUser(updatedUser);
      
      toast.success(`Welcome! You've selected the ${selectedRole} role.`);
      router.replace('/dashboard');
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome, {userData.name}!</CardTitle>
          <p className="text-muted-foreground">
            Please select your role to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant={selectedRole === 'user' ? 'default' : 'outline'}
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => setSelectedRole('user')}
            >
              <User className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Job Seeker</div>
                <div className="text-xs text-muted-foreground">Find and apply for jobs</div>
              </div>
            </Button>
            
            <Button
              variant={selectedRole === 'employer' ? 'default' : 'outline'}
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => setSelectedRole('employer')}
            >
              <Building2 className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Employer</div>
                <div className="text-xs text-muted-foreground">Post jobs and hire candidates</div>
              </div>
            </Button>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
          >
            {loading ? 'Setting up...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 