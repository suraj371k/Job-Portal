"use client";
import { useJobStore } from "@/store/jobStore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  ArrowLeft,
  Users,
  Code,
  FileText,
  Building,
  Globe,
} from "lucide-react";
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/store/authStore";

const JobDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { jobs, loading, error, getJobById } = useJobStore();
  const job = jobs[0];
  const { user } = useAuthStore()

  const {
    applyJob,
    loading: applicationLoading,
    success,
    getUserApplications,
    applications,
  } = useApplicationStore();

  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    await applyJob(job._id);
    toast.success("You are successfully applied");
    if (!error) {
      setApplied(true);
    }
  };

  useEffect(() => {
    getUserApplications();
  }, [getUserApplications]);

  const hasApplied = applications.some((app) => app.job._id === job._id);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        await getJobById(id as string);
      } catch (err) {
        toast.error("Failed to load job details");
      }
    };
    fetchJob();
  }, [id, getJobById]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Job Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => getJobById(id as string)}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The job you're looking for doesn't exist or may have been removed.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/jobs")}>Browse Jobs</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <p className="flex items-center gap-1 mt-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                {job.employer.companyName}
              </p>
            </div>
            <Badge variant="secondary" className="self-start">
              {job.jobType}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p>{job.salary}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{job.employer.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vacancies</p>
                  <p>{job.vacancies} position(s)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p>{job.employer.industry}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p>{format(new Date(job.createdAt), "MMMM d, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p>{format(new Date(job.updatedAt), "MMMM d, yyyy")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="w-5 h-5" />
                Job Description
              </h3>
              <div className="prose prose-sm dark:prose-invert">
                {job.JobDescription.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Code className="w-5 h-5" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(",").map((skill, i) => (
                  <Badge key={i} variant="outline">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Building className="w-5 h-5" />
                About {job.employer.companyName}
              </h3>
              <p className="text-muted-foreground">
                {job.employer.industry} company based in {job.employer.location}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>Job ID: {job._id}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            {user?.role === "user" ? (
              hasApplied ? (
                <Button disabled>Already Applied</Button>
              ) : (
                <Button onClick={handleApply}>Apply</Button>
              )
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetails;
