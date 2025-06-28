"use client";
import { useJobStore } from "@/store/jobStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { format } from "date-fns";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const jobTypeOptions = [
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
  { id: "freelance", label: "Freelance" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
    },
  },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Jobs = () => {
  const getJob = useJobStore((state) => state.getJob);
  const jobs = useJobStore((state) => state.jobs);
  const loading = useJobStore((state) => state.loading);
  const error = useJobStore((state) => state.error);

  // Filter states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);

  // Debounced filter effect (restore this)
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: Record<string, any> = {};
      if (title) filters.title = title;
      if (location) filters.location = location;
      if (selectedJobTypes.length > 0)
        filters.jobTypes = selectedJobTypes.join(",");
      if (salaryRange[0] > 0) filters.minSalary = salaryRange[0] * 1000;
      if (salaryRange[1] < 100) filters.maxSalary = salaryRange[1] * 1000;
      getJob(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [title, location, selectedJobTypes, salaryRange, getJob]);

  useEffect(() => {
    getJob({});
  }, []);

  const handleJobTypeChange = (jobTypeId: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobTypeId)
        ? prev.filter((id) => id !== jobTypeId)
        : [...prev, jobTypeId]
    );
  };

  const handleSalaryChange = (value: number[]) => {
    setSalaryRange(value as [number, number]);
  };

  const resetFilters = () => {
    setTitle("");
    setLocation("");
    setSelectedJobTypes([]);
    setSalaryRange([0, 100]);
    getJob({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing opportunities from top companies around the world
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filters UI (always visible) */}
          <motion.div
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-80 lg:sticky lg:top-8"
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-center">
                  Filter Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="title" className="text-sm font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Software Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. New York, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-medium">Job Type</Label>
                  <div className="space-y-3">
                    {jobTypeOptions.map((option, index) => (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={option.id}
                          checked={selectedJobTypes.includes(option.id)}
                          onCheckedChange={() => handleJobTypeChange(option.id)}
                          className="transition-all duration-200"
                        />
                        <Label
                          htmlFor={option.id}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <Label className="text-sm font-medium">
                    Salary Range (in thousands)
                  </Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={salaryRange}
                    onValueChange={handleSalaryChange}
                    minStepsBetweenThumbs={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="font-medium">${salaryRange[0]}k</span>
                    <span className="font-medium">${salaryRange[1]}k</span>
                  </div>
                </motion.div>

                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full transition-all duration-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Jobs List (changes based on state) */}
          <div className="flex-1 w-full">
            {loading ? (
              <motion.div
                variants={skeletonVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} variants={cardVariants}>
                    <Card className="hover:shadow-xl transition-shadow duration-300">
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
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-destructive shadow-lg">
                  <CardHeader className="text-destructive text-center">
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          // ease: "linear" // Remove or use a valid EasingFunction if needed
                        }}
                      >
                        <AlertCircle className="w-8 h-8" />
                      </motion.div>
                      <CardTitle className="text-xl">
                        Error Loading Jobs
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{error}</p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="text-destructive border-destructive hover:bg-destructive/10"
                      >
                        Retry
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : jobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center shadow-lg">
                  <CardHeader>
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="flex justify-center mb-4"
                    >
                      <Briefcase className="w-12 h-12 text-muted-foreground" />
                    </motion.div>
                    <CardTitle className="text-xl">No Jobs Found</CardTitle>
                    <CardDescription>
                      Try adjusting your filters to see more results
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      layout
                      className="w-full"
                    >
                      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group">
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                                {job.title}
                              </CardTitle>
                              <CardDescription className="mt-2 text-base font-medium text-gray-600">
                                {job.employer?.companyName}
                              </CardDescription>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge
                                variant="secondary"
                                className="shrink-0 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                              >
                                {job.jobType}
                              </Badge>
                            </motion.div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className="p-2 bg-green-100 rounded-full">
                                <DollarSign className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-medium">{job.salary}</span>
                            </motion.div>

                            <motion.div
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className="p-2 bg-purple-100 rounded-full">
                                <MapPin className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium">
                                {job.employer?.location || "Remote"}
                              </span>
                            </motion.div>

                            <motion.div
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className="p-2 bg-orange-100 rounded-full">
                                <Briefcase className="w-4 h-4 text-orange-600" />
                              </div>
                              <span className="font-medium">
                                {job.vacancies} vacancies
                              </span>
                            </motion.div>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {job.JobDescription}
                          </p>
                        </CardContent>

                        <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>
                              Posted:{" "}
                              {format(new Date(job.createdAt), "MMM d, yyyy")}
                            </span>
                          </motion.div>

                          <Link href={`/employer/job/get-job/${job._id}`}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200"
                              >
                                View Details
                              </Button>
                            </motion.div>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
