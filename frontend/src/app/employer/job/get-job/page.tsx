"use client";
import { useJobStore } from "@/store/jobStore";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const MyJobs = () => {
  const { getMyJob, deleteJob, jobs, loading, error } = useJobStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        await getMyJob();
      } catch (err) {
        toast.error("Failed to load jobs");
      }
    };
    fetchJobs();
  }, [getMyJob]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader className="text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <CardTitle>Error Loading Jobs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={getMyJob}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Jobs Found</CardTitle>
            <CardDescription>
              You haven't posted any jobs yet. Create your first job posting to
              get started.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    deleteJob(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Job Postings</h1>
        <p className="text-muted-foreground">
          Manage your current job listings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {job.employer?.companyName}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {job.jobType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{job.employer?.location || "Remote"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{job.vacancies} vacancies</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                {job.JobDescription}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  Posted: {format(new Date(job.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Link href={`/employer/job/get-job/${job._id}`}>
                    View Details
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDelete(job._id);
                    toast.success("Job deleted successfully");
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;
