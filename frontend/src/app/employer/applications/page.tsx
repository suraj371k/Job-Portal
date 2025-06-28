"use client";
import { useApplicationStore } from "@/store/applicationStore";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Status } from "@/store/applicationStore";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";
// import { useRouter } from "next/navigation";
const JobApplications = () => {
  const { loading, error, getAllJobApplications, applications, updateApplicationStatus } =
    useApplicationStore();

    // const { user } = useAuthStore()

    const router = useRouter();
    // if(!user){
    //   router.push('/login')
    // }

  useEffect(() => {
    getAllJobApplications();
  }, [getAllJobApplications]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "applied":
        return "secondary";
      case "shortlisted":
        return "default";
      case "interview":
        return "outline";
      case "rejected":
        return "destructive";
      case "hired":
        return "default";
      default:
        return "outline";
    }
  };

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string, name?: string } | null>(null);

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto my-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load job applications. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Job Applications</h1>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No job applications found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px]">Job Title</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-medium">
                    {app.job?.title || "Untitled Position"}
                  </TableCell>
                  <TableCell>
                    {typeof app.candidate === "object" && "name" in app.candidate
                      ? app.candidate.name
                      : "Unknown Candidate"}
                  </TableCell>
                  <TableCell>
                    {typeof app.candidate === "object" && "email" in app.candidate
                      ? app.candidate.email
                      : "No email provided"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(app.status)}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Message Candidate"
                      disabled={typeof app.candidate !== "object" || !app.candidate._id}
                      onClick={() => {
                        if (typeof app.candidate !== "object" || !app.candidate._id) return;
                        router.push(`/messages/${app.candidate._id}`);
                      }}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={app.status}
                      onValueChange={(value) => updateApplicationStatus(app._id, value as Status)}
                    >
                      <SelectTrigger className="w-[180px] ml-auto">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default JobApplications;