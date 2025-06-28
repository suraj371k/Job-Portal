import { Request, Response } from "express";
import Auth, { IUser } from "../models/auth.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      if (existingUser.isGoogleUser) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "This email is registered with Google. Please use Google login",
          });
      }
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = (await Auth.create({
      name,
      email,
      password: hashedPassword,
      role,
    })) as IUser;

    const token = generateToken(String(user._id));

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = (await Auth.findOne({ email })) as IUser;

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    //check if user registered with google
    if (existingUser.isGoogleUser) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "This email is registered with google , Please use google login",
        });
    }

    const isMatch = await bcrypt.compare(password, String(existingUser.password));

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(String(existingUser._id));

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.log("Error in logout controller ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    // req.user is set by passport
    const user = req.user as IUser;
    const token = generateToken(String(user._id));

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Check if this is a new Google user (recently created)
    const isNewUser = user.isGoogleUser && user.role === "user";

    // Redirect to frontend with user data
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      isNewUser,
    };

    const callbackUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/auth/google/callback?data=${encodeURIComponent(
      JSON.stringify(userData)
    )}`;
    res.redirect(callbackUrl);
  } catch (error: any) {
    console.error("Google auth callback error:", error);
    const errorUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login?error=Google authentication failed`;
    res.redirect(errorUrl);
  }
};

export const fetchMe = async (req: Request, res: Response) => {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const validRoles: string[] = ["user", "employer"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "employer"',
      });
    }

    // Update user role
    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error updating role",
      error: error.message,
    });
  }
};
