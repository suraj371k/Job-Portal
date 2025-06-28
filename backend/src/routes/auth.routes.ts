import express from 'express';
import passport from 'passport';
import { loginUser, registerUser, logoutUser, googleAuthCallback, fetchMe, updateUserRole } from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter';
import { protect } from '../middleware/protectedRoute';

const router = express.Router();

// Existing routes
router.post('/register', registerUser);
router.post('/login', authRateLimiter, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, fetchMe);
router.put('/update-role', protect, updateUserRole);

// Google auth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: true
  }), 
  googleAuthCallback
);

export default router;