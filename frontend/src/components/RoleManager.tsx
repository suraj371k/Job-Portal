'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { User, Building2, Settings } from "lucide-react";
import axios from "axios";

export function RoleManager() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: 'user' | 'employer') => {
    if (!user || user.role === newRole) return;

    setLoading(true);
    try {
      const response = await axios.put('/api/v1/auth/update-role', 
        { role: newRole },
        { withCredentials: true }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      
      toast.success(`Role updated to ${newRole}`);
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Role Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Current role: <span className="font-semibold capitalize">{user.role}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={user.role === 'user' ? 'default' : 'outline'}
            size="sm"
            className="justify-start"
            onClick={() => handleRoleChange('user')}
            disabled={loading || user.role === 'user'}
          >
            <User className="h-4 w-4 mr-2" />
            Job Seeker
          </Button>
          
          <Button
            variant={user.role === 'employer' ? 'default' : 'outline'}
            size="sm"
            className="justify-start"
            onClick={() => handleRoleChange('employer')}
            disabled={loading || user.role === 'employer'}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Employer
          </Button>
        </div>
        
        {loading && (
          <div className="text-sm text-muted-foreground">
            Updating role...
          </div>
        )}
      </CardContent>
    </Card>
  );
} 