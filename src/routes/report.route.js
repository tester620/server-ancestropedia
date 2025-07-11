import express from "express";
import { abortReport, submitReport } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/submit",submitReport);
router.put("/abort/:id",abortReport);


export default router;