import express from "express";
import { submitMessage } from "../controllers/support.controller.js";

const router = express.Router();

router.post("/create", submitMessage);

export default router;
