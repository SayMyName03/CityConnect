import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables (if not already loaded by the app entry)
dotenv.config();

// Helper to build a sensible callback URL
const buildCallbackURL = () => {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;
  const port = process.env.PORT || '3000';
  // default to localhost backend callback
  return `http://localhost:${port}/api/auth/google/callback`;
};

const callbackURL = buildCallbackURL();

// Only configure Google strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            if (!profile || (!profile.id && !(profile.emails && profile.emails.length))) {
              return done(new Error('Invalid Google profile'), null);
            }

            // Try to find existing user by googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) return done(null, user);

            // Try to find by email and link account
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            if (email) {
              user = await User.findOne({ email });
              if (user) {
                user.googleId = profile.id;
                user.provider = 'google';
                user.profilePicture = profile.photos?.[0]?.value;
                await user.save();
                return done(null, user);
              }
            }

            // Create new user
            const newUser = await User.create({
              googleId: profile.id,
              name: profile.displayName || (email ? email.split('@')[0] : 'Google User'),
              email: email || undefined,
              profilePicture: profile.photos?.[0]?.value,
              provider: 'google',
              role: 'citizen',
            });

            return done(null, newUser);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
    // eslint-disable-next-line no-console
    console.log('Google OAuth strategy initialized. Callback URL:', callbackURL);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to initialize Google OAuth strategy:', err.message);
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('Google OAuth credentials not provided. Google authentication disabled.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;