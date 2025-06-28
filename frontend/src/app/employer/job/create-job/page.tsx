"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useJobStore } from "@/store/jobStore";
import { JobType } from "@/store/jobStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type CreateJobFormData = {
  title: string;
  JobDescription: string;
  salary: string;
  skills: string;
  vacancies: number;
};

const jobTypes: JobType[] = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
];

const jobTypeLabels: Record<JobType, string> = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

const CreateJob = () => {
  const [jobType, setJobType] = useState<JobType | "">("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateJobFormData>();
  const { createJob, loading, error } = useJobStore();

  const onSubmit = async (data: CreateJobFormData) => {
    if (!jobType) {
      toast.error("Please select a job type");
      return;
    }

    try {
      await createJob({
        ...data,
        jobType,
      });
      toast.success("Job created successfully!");
      reset();
      setJobType("");
    } catch (err) {
      toast.error("Failed to create job");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create New Job Posting
          </CardTitle>
          <p className="text-sm text-gray-500">
            Fill in the details to create a new job opportunity
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Job Title *
              </Label>
              <Input
                id="title"
                {...register("title", { required: "Job title is required" })}
                placeholder="e.g. Senior Frontend Developer"
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="JobDescription" className="text-gray-700">
                Job Description *
              </Label>
              <Textarea
                id="JobDescription"
                {...register("JobDescription", { 
                  required: "Job description is required",
                  minLength: {
                    value: 50,
                    message: "Description should be at least 50 characters"
                  }
                })}
                placeholder="Describe the responsibilities, requirements, and benefits of the position..."
                rows={6}
                className="focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              />
              {errors.JobDescription && (
                <p className="text-red-500 text-sm">{errors.JobDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-gray-700">
                  Salary Range *
                </Label>
                <Input
                  id="salary"
                  {...register("salary", { required: "Salary range is required" })}
                  placeholder="e.g. $80,000 - $100,000"
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.salary && (
                  <p className="text-red-500 text-sm">{errors.salary.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vacancies" className="text-gray-700">
                  Number of Vacancies *
                </Label>
                <Input
                  id="vacancies"
                  type="number"
                  {...register("vacancies", { 
                    required: "Number of vacancies is required",
                    min: {
                      value: 1,
                      message: "Must have at least 1 vacancy"
                    }
                  })}
                  placeholder="e.g. 2"
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.vacancies && (
                  <p className="text-red-500 text-sm">{errors.vacancies.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-700">
                Required Skills *
              </Label>
              <Input
                id="skills"
                {...register("skills", { required: "Skills are required" })}
                placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Job Type *</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between text-left"
                  >
                    {jobType ? jobTypeLabels[jobType] : "Select job type"}

                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                  <DropdownMenuLabel>Job Types</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {jobTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => setJobType(type)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {jobTypeLabels[type]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  "Create Job Posting"
                )}
              </Button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;