import express from "express";
import {
  googleCallback,
  login,
  logout,
  resetPassToken,
  resetPassword,
  signup,
  verifyMailToken,
  verifyPassToken,
} from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/mail/reset-pass",resetPassToken);


router.post("/verifypassToken",verifyPassToken);
router.post("/verifyMailToken",verifyMailToken);
router.post("/reset-pass",resetPassword);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/callback/google",
  passport.authenticate("google", { session: false }),
  googleCallback
);


export default router;
