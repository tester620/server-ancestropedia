import express from "express";
import { abortReport, getMyReports, submitReport } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/submit",submitReport);
router.get("/reports",getMyReports);

router.put("/abort/:id",abortReport);


export default router;