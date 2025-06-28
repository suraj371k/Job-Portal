import { Request, Response } from "express";
import UserProfile from "../models/user.model";

//create a profile
export const createUserProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const {
            title,
            bio,
            location,
            phone,
            skills,
            experience,
            education,
            jobPreferences,
            socialLinks
        } = req.body;

        // Check if user already has a profile
        const existingProfile = await UserProfile.findOne({ user: user._id });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "User profile already exists"
            });
        }

        // Create new profile
        const userProfile = await UserProfile.create({
            user: user._id,
            title,
            bio,
            location,
            phone,
            skills,
            experience,
            education,
            jobPreferences,
            socialLinks
        });

        res.status(201).json({
            success: true,
            message: "User profile created successfully",
            data: userProfile
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error creating user profile",
            error: error.message
        });
    }
};

//upload resume
export const uploadResume = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const userProfile = await UserProfile.findOne({ user: user._id });
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        // Update the resume field with the Cloudinary URL
        userProfile.resume = req.file.path;
        await userProfile.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: {
                resumeUrl: req.file.path
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error uploading resume",
            error: error.message
        });
    }
};

//get user profile
export const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user; 
  
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const profile = await UserProfile.findOne({ user: userId })
        .populate('user', 'name email')
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
  
//update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user as any;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const {
            title,
            bio,
            location,
            phone,
            skills,
            experience,
            education,
            jobPreferences,
            socialLinks
        } = req.body;

        // Find the user's profile
        const userProfile = await UserProfile.findOne({ user: user._id });
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        // Update the profile with new data
        const updatedProfile = await UserProfile.findByIdAndUpdate(
            userProfile._id,
            {
                title,
                bio,
                location,
                phone,
                skills,
                experience,
                education,
                jobPreferences,
                socialLinks
            },
            {
                new: true, // Return the updated document
                runValidators: true // Run schema validators on update
            }
        );

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
};