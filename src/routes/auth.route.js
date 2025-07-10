import express from "express";
import { googleAuth, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signup);

router.post("authO",googleAuth)


export default router