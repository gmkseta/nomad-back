import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";
// import {GoogleStrategy} from "";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { sessions: false }, (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    async(accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const {id , _json: {email}} = profile;
      try {
        const user = await prisma.user({email});
        if (user) {
          // 같은 이메일로 가입
          await prisma.updateUser({
            where: {email}, data: {
              googleId: id
            }
          });
          console.log(user)
          return done(null, user);
        } 
        else {
          const user = await prisma.createUser({
            email,
            username: email,
            googleId: id
          });
          console.log(user)
          return done(null, user);
        }
      } catch(e) {
        return done(e.message);
      }

    }  
  )
);


passport.initialize();