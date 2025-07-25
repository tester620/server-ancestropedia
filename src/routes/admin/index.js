import express from "express";
import supportRoutes from "./admin.support.route.js";
import reportRoutes from "./admin.report.route.js";
import blogRoutes from "./admin.blog.route.js";
import tokenRoutes from "./admin.token.route.js";

const router = express.Router();

router.use("/admin/support", supportRoutes);
router.use("/admin/report", reportRoutes);
router.use("/admin/blog", blogRoutes);
router.use("/admin/token", tokenRoutes);

export default router;
