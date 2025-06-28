import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Auth from '../models/auth.model';
import EmployerProfile from '../models/employer.model';

interface JwtPayload {
  id: string;
}

// Extend Request interface to include user and cookies
interface AuthenticatedRequest extends Request {
  user?: any;
  employerProfile?: any;
  cookies: {
    token?: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from token
    const user = await Auth.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message
    });
  }
};

// Middleware to protect routes for 'user' role only
export const protectUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // First check if user is authenticated
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from token
    const user = await Auth.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    // Check if user has 'user' role
    if (user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User role required.'
      });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message
    });
  }
};

// Middleware to protect routes for 'employer' role only
export const protectEmployer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // First check if user is authenticated
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from token
    const user = await Auth.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    // Check if user has 'employer' role
    if (user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employer role required.'
      });
    }

    // Fetch EmployerProfile for this user
    const employerProfile = await EmployerProfile.findOne({ user: user._id });
    if (!employerProfile) {
      return res.status(403).json({
        success: false,
        message: 'No employer profile found for this user.'
      });
    }

    // Set user and employerProfile in request object
    req.user = user;
    req.employerProfile = employerProfile;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message
    });
  }
};
