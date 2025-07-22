import express from "express";
import {getReportsToreview, 
  getAllReports,
  getSpecificReport,
  reviewReport,
} from "../../controllers/admin/admin.report.controller.js";

const router = express.Router();

router.get("/allReports", getAllReports);
router.get("/specReport", getSpecificReport);
router.post("/review", reviewReport);
router.get("/pending", getReportsToreview);
export default router;
