"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEmployerProfileStore } from "@/store/employerStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

type EmployerProfileFormData = {
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  founded: number;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  description: string;
};
 
export function CreateEmployerProfileForm() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { employerProfile, fetchEmployerProfile, createEmployerProfile, updateEmployerProfile, loading } = useEmployerProfileStore();

  const form = useForm<EmployerProfileFormData>({
    defaultValues: {
      companyName: "",
      industry: "",
      companySize: "",
      location: "",
      founded: new Date().getFullYear(),
      contactEmail: "",
      contactPhone: "",
      socialLinks: {
        website: "",
        linkedin: "",
        twitter: "",
      },
      description: "",
    },
  });

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!hasHydrated) return; // Wait until Zustand is ready
    
    if (!user) {
      router.replace("/login");
      return;
    }

    // Check if user is an employer
    if (user.role !== "employer") {
      router.replace("/dashboard");
      return;
    }

    // Fetch employer profile only if user is authenticated and is an employer
    fetchEmployerProfile();
  }, [user, hasHydrated, router, fetchEmployerProfile]);

  // Populate form with existing data when employer profile is loaded
  useEffect(() => {
    if (employerProfile) {
      form.reset({
        companyName: employerProfile.companyName || "",
        industry: employerProfile.industry || "",
        companySize: employerProfile.companySize || "",
        location: employerProfile.location || "",
        founded: employerProfile.founded || new Date().getFullYear(),
        contactEmail: employerProfile.contactEmail || "",
        contactPhone: employerProfile.contactPhone || "",
        socialLinks: {
          website: employerProfile.socialLinks?.website || "",
          linkedin: employerProfile.socialLinks?.linkedin || "",
          twitter: employerProfile.socialLinks?.twitter || "",
        },
        description: employerProfile.description || "",
      });
    }
  }, [employerProfile, form]);

  const onSubmit = async (data: EmployerProfileFormData) => {
    try {
      if (employerProfile) {
        // Update existing profile
        await updateEmployerProfile(data);
        toast.success("Profile Updated Successfully")
      } else {
        // Create new profile
        await createEmployerProfile(data);
        toast.success("Profile Created Successfully")
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Show loading while checking authentication
  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render form if user is not authenticated or not an employer
  if (!user || user.role !== "employer") {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{employerProfile ? "Update Profile": "Create Profile"}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="501-1000">501-1000</SelectItem>
                        <SelectItem value="1001-5000">1001-5000</SelectItem>
                        <SelectItem value="5000+">5000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Founded</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="hiring@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourcompany.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/company/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your company"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 30 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : employerProfile ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateEmployerProfileForm;
