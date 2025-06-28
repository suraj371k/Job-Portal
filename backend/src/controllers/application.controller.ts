import { Request, Response } from "express";
import Job from "../models/job.model";
import Application from "../models/application.model";
import Auth from "../models/auth.model";
import { sendEmail } from "../utils/sendEmail";

export const applyJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    const candidateId = req.user as any;

    // Populate employer and their user info
    const job = await Job.findById(jobId).populate({
      path: "employer",
      populate: { path: "user", model: "Auth", select: "name email" },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Prevent duplicate handled by unique index, but can pre-check for better UX
    const existing = await Application.findOne({
      job: jobId,
      candidate: candidateId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    //create application
    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      status: "applied",
    });

    //send email to employer
    let employerEmail = "";
    let employerName = "";
    if (
      job.employer &&
      typeof job.employer === "object" &&
      "user" in job.employer &&
      job.employer.user
    ) {
      const employerUser = job.employer.user as {
        email?: string;
        name?: string;
      };
      employerEmail = employerUser.email || "";
      employerName = employerUser.name || "";
    }
    const candidateData = await Auth.findById(candidateId);

    if (employerEmail && candidateData) {
      try {
        await sendEmail({
          to: employerEmail,
          subject: `New Application for ${job.title}`,
          html: `
            <h3>Hi ${employerName},</h3>
            <p>${candidateData.name} has applied to your job "<strong>${job.title}</strong>".</p>
            <p>Candidate email: ${candidateData.email}</p>
            <br/>
            <p>Job Portal Team</p>
          `,
        });
      } catch (emailError) {
        console.error(
          "Failed to send application confirmation email:",
          emailError
        );
        // Do not re-throw; allow the API to succeed even if email fails.
      }
    }

    return res.status(201).json({ success: true, application });
  } catch (error) {
    console.log("Error in apply job controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserApplication = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const applications = await Application.find({
      candidate: user._id,
    }).populate({
      path: "job",
      select: "title company location salary createdAt",
      populate: {
        path: "employer",
        select: "name email companyName",
      },
    });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.log("Error in get apply job controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
 
export const getAllApplicantsForEmployerJobs = async (req: Request, res: Response) => {
  try {
    const employerProfile = (req as any).employerProfile;
    if (!employerProfile) {
      return res.status(404).json({ success: false, message: "Employer profile not found" });
    }

    // Find all jobs posted by this employer
    const jobs = await Job.find({ employer: employerProfile._id }).select("_id");
    const jobIds = jobs.map((job: any) => job._id);

    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "name email _id")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
      totalApplications: applications.length,
    });
  } catch (error) {
    console.log("Error in get all applicants for employer jobs", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const employerProfile = (req as any).employerProfile;
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses: string[] = [
      "applied",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    const jobDoc = application.job as typeof Job.prototype;
    if (jobDoc.employer.toString() !== employerProfile._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ success: true, application });
  } catch (error) {
    console.log("error in update application status controller ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

