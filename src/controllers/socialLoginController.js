import passport from "passport";
import { generateToken } from "../utils";

export const googleLogin = passport.authenticate("google", {
  session: false,
  scope: ["email"]
});

export const googleLoginCallback = passport.authenticate("google", { session: false });

export const returnToken = (req, res) => {
  const token = generateToken(req.user.id);
  res.redirect(`http://localhost:3000/login?token=${token}`);
};