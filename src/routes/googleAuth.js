import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/users/user/social-login'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const tokens = await googleLogin(profile);
    done(null, tokens);
  } catch (err) {
    done(err, null);
  }
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/user/social-login', 
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    res.json(req.user);
  }
);

export default router;
