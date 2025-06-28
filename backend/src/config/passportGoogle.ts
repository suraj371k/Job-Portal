import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Auth from '../models/auth.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:4000/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Auth.findOne({ email: profile.emails?.[0].value });

        if (!user) {
          // Create new user if doesn't exist
          user = await Auth.create({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            googleId: profile.id,
            picture: profile.photos?.[0].value,
            isGoogleUser: true,
            role: 'user', // Default role
          });
        } else if (!user.googleId) {
          // Link Google account to existing email
          user.googleId = profile.id;
          user.picture = profile.photos?.[0].value;
          user.isGoogleUser = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await Auth.findById(id);
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});

export default passport;