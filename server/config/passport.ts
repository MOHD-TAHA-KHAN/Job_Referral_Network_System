// @ts-nocheck
import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/pg/user';

const getGoogleCallbackURL = () => {
  const baseURL = process.env.GOOGLE_CALLBACK_URL || 
    (process.env.API_URL ? `${process.env.API_URL}/api/auth/google/callback` :
    'http://localhost:5000/api/auth/google/callback');
  return baseURL;
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: getGoogleCallbackURL(),
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({
      where: { email: profile.emails[0].value }
    })

    if (user) {
      // User exists — just return them
      return done(null, user)
    }

    // New user — create account automatically
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: null,  // No password for OAuth users
      role: 'FRESHER',
    })

    return done(null, user)
  } catch (err: any) {
    return done(err, null)
  }
}))


passport.serializeUser((user: any, done) => {
    done(null, user.id);        // or user._id if using Mongo
});

passport.deserializeUser(async (id: any, done) => {
  const user = await User.findByPk(id)
  done(null, user)
})

export default passport;