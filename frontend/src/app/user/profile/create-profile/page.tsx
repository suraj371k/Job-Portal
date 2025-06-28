"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile, useUserProfileStore } from "@/store/userStore";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const CreateProfile = () => {
  const {
    userProfile,
    loading,
    error,
    createUserProfile,
    fetchUserProfile,
    uploadResume,
    updateUserProfile,
  } = useUserProfileStore();

  const { register, handleSubmit, setValue, reset, watch, control } =
    useForm<Partial<UserProfile>>();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      reset({
        title: userProfile.title,
        phone: userProfile.phone,
        bio: userProfile.bio,
        skills: userProfile.skills,
        location: userProfile.location,
        jobPreferences: userProfile.jobPreferences,
        socialLinks: userProfile.socialLinks,
        experience: userProfile.experience,
        education: userProfile.education,
      });
    }
  }, [userProfile, reset]);

  const {
    fields: experienceFields,
    append: appendExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });
  const {
    fields: educationFields,
    append: appendEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = async (data: Partial<UserProfile>) => {
    const payload: Partial<UserProfile> = {
      ...data,
      skills:
        typeof data.skills === "string"
          ? (data.skills as string).split(",").map((s) => s.trim())
          : [],
    };

    try {
      if (userProfile) {
        await updateUserProfile(payload);
        alert("Profile updated!");
      } else {
        await createUserProfile(payload);
        alert("Profile created!");
      }
    } catch (err) {
      alert("Error saving profile.");
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadResume(file);
        alert("Resume uploaded " + url);
      } catch (error) {
        alert("Error uploading resume.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {userProfile ? "Update" : "Create"} Your Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g. Software Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input {...register("phone")} placeholder="+1 (123) 456-7890" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                rows={4}
                {...register("bio")}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Skills</h3>
            <div className="space-y-2">
              <Label>Add your skills (comma separated)</Label>
              <Input
                {...register("skills")}
                placeholder="e.g. JavaScript, React, Node.js"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Work Experience</h3>
            {experienceFields.map((field, index) => (
              <div key={field.id} className="space-y-4 border-b pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      {...register(`experience.${index}.position`)}
                      placeholder="e.g. Software Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      {...register(`experience.${index}.company`)}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      {...register(`experience.${index}.startDate`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      {...register(`experience.${index}.endDate`)}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        {...register(`experience.${index}.current`)}
                        id={`current-${index}`}
                      />
                      <Label htmlFor={`current-${index}`}>
                        I currently work here
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register(`experience.${index}.description`)}
                    placeholder="Describe your role..."
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                appendExperience({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  description: "",
                })
              }
            >
              Add Another Experience
            </Button>
          </div>

          {/* Education */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Education</h3>
            {educationFields.map((field, index) => (
              <div key={field.id} className="space-y-4 border-b pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      {...register(`education.${index}.institution`)}
                      placeholder="University Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      {...register(`education.${index}.degree`)}
                      placeholder="e.g. Bachelor of Science"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    {...register(`education.${index}.field`)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      {...register(`education.${index}.startDate`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        {...register(`education.${index}.endDate`)}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          {...register(`education.${index}.current`)}
                          id={`currentEdu-${index}`}
                        />
                        <Label htmlFor={`currentEdu-${index}`}>
                          Currently studying
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() =>
                appendEducation({
                  institution: "",
                  degree: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                })
              }
            >
              Add Another Education
            </Button>
          </div>

          {/* Job Preferences */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Job Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Expected Salary</Label>
                <Input
                  id="salary"
                  {...register("jobPreferences.expectedSalary")}
                  type="number"
                  placeholder="e.g. 80000"
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Locations (Cities/Countries)</Label>
                <Input
                  {...register("jobPreferences.preferredLocations")}
                  placeholder="e.g. New York, USA; London, UK"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Social Links</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  {...register("socialLinks.linkedin")}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  {...register("socialLinks.github")}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  {...register("socialLinks.portfolio")}
                  type="url"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
          {/* Resume Upload */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-medium">Resume</h3>
            <div className="space-y-2">
              <Label>Upload your resume</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
