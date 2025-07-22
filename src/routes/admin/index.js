import express from "express";
import supportRoutes from "./admin.support.route.js";
import reportRoutes from "./admin.report.route.js";

const router = express.Router();

router.use("/admin/support", supportRoutes);
router.use("/admin/report", reportRoutes);

export default router;
