import { Request, Response } from "express";
import Job from "../models/job.model";
import EmployerProfile from "../models/employer.model";

export const createJob = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // First, find the employer profile for this user
    const employerProfile = await EmployerProfile.findOne({ user: user._id });

    if (!employerProfile) {
      return res.status(400).json({
        success: false,
        message:
          "Employer profile not found. Please create your employer profile first.",
      });
    }

    const { title, JobDescription, salary, skills, jobType, vacancies } =
      req.body;

    if (
      !title ||
      !JobDescription ||
      !salary ||
      !skills ||
      !jobType ||
      !vacancies
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create the job using the employer profile's ID
    const job = await Job.create({
      employer: employerProfile._id, // Use employer profile ID, not user ID
      title,
      JobDescription,
      salary,
      skills,
      jobType,
      vacancies,
    });

    // Populate the employer details for the response
    const populatedJob = await Job.findById(job._id).populate({
      path: "employer",
      select: "companyName industry location",
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: populatedJob,
    });
  } catch (error: any) {
    console.error(" Error creating job:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { jobTypes, minSalary, maxSalary, location, title } = req.query;

    const query: any = {};

    // 🔍 Filter by job type (e.g. Full-Time, Internship)
    if (jobTypes) {
      query.jobType = jobTypes;
    }

    // 🔍 Search by title (case-insensitive)
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // 💰 Salary range filter
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    // 📦 Fetch jobs from DB with employer info
    let jobs = await Job.find(query)
      .populate({
        path: "employer",
        select: "companyName industry location companySize",
      })
      .sort({ createdAt: -1 });

    // 🌍 Filter by employer's location (post-populate)
    if (location) {
      jobs = jobs.filter((job: any) =>
        job?.employer?.location
          ?.toLowerCase()
          .includes((location as string).toLowerCase())
      );
    }

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error: any) {
    console.error("Error fetching jobs:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
      path: "employer",
      select:
        "companyName industry location companySize description contactEmail contactPhone socialLinks",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error: any) {
    console.error(" Error fetching job:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getEmployerJobs = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find the employer profile for this user
    const employerProfile = await EmployerProfile.findOne({ user: user._id });

    if (!employerProfile) {
      return res.status(400).json({
        success: false,
        message: "Employer profile not found.",
      });
    }

    const jobs = await Job.find({ employer: employerProfile._id })
      .populate({
        path: "employer",
        select: "companyName industry location",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Employer jobs fetched successfully",
      data: jobs,
    });
  } catch (error: any) {
    console.error(" Error fetching employer jobs:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find the employer profile for this user
    const employerProfile = await EmployerProfile.findOne({ user: user._id });

    if (!employerProfile) {
      return res.status(400).json({
        success: false,
        message: "Employer profile not found.",
      });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ _id: id, employer: employerProfile._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you don't have permission to update it",
      });
    }

    const { title, JobDescription, salary, skills, jobType, vacancies } =
      req.body;

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        JobDescription,
        salary,
        skills,
        jobType,
        vacancies,
      },
      { new: true, runValidators: true }
    ).populate({
      path: "employer",
      select: "companyName industry location",
    });

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error: any) {
    console.error(" Error updating job:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find the employer profile for this user
    const employerProfile = await EmployerProfile.findOne({ user: user._id });

    if (!employerProfile) {
      return res.status(400).json({
        success: false,
        message: "Employer profile not found.",
      });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ _id: id, employer: employerProfile._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you don't have permission to delete it",
      });
    }

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    console.error(" Error deleting job:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

