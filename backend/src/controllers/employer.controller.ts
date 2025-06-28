import express, { Request, Response } from "express";
import EmployerProfile from "../models/employer.model";

export const createEmployerProfile = async (req: Request, res: Response) => {
  try {
    const employer = req.user as any;

    if (!employer) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const {
      companyName,
      industry,
      companySize,
      location,
      founded,
      description,
      socialLinks,
      contactEmail,
      contactPhone,
    } = req.body;

    if (
      !companyName ||
      !industry ||
      !companySize ||
      !location ||
      !contactEmail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "company details required" });
    }

    const existingProfile = await EmployerProfile.findOne({ companyName });
    if (existingProfile) {
      return res
        .status(400)
        .json({ success: false, message: "Company profile already exists" });
    }


    const employerProfile = await EmployerProfile.create({
      user: employer?._id,
      companyName,
      industry,
      companySize,
      location,
      founded,
      description,
      socialLinks,
      contactEmail,
      contactPhone,
    });

    return res.status(201).json({ success: true, employerProfile });
  } catch (error) {
    console.error("Error in createEmployerProfile controller", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getEmployerProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const profile = await EmployerProfile.findOne({ user: user._id })
      .populate("user", "name email")
      .lean();

      if (!profile) {
        return res.status(200).json({ success: true, data: null });
      }
  
      return res.status(200).json({ success: true, data: profile });

  } catch (error) {
    console.error('[UserProfile] Error fetching profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateEmployerProfile = async (req: Request , res: Response) => {
  try {
    const user = req.user as any;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const {
      companyName,
      industry,
      companySize,
      location,
      founded,
      description,
      socialLinks,
      contactEmail,
      contactPhone,
    } = req.body;


    const employerProfile = await EmployerProfile.findOne({ user: user._id });
    if (!employerProfile) {
        return res.status(404).json({
            success: false,
            message: "User profile not found"
        });
    }

    const updatedProfile = await EmployerProfile.findByIdAndUpdate(
      employerProfile._id,
      {
        companyName,
        industry,
        companySize,
        location,
        founded,
        description,
        socialLinks,
        contactEmail,
        contactPhone,
      }, {new: true , runValidators: true}
    )

    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
  });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message
  });
  }
}