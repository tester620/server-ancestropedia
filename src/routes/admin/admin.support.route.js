import express from "express";
import { getAllMessages, getSupportMessage } from "../../controllers/admin/admin.support.controller.js";

const router = express.Router();

router.get("/message", getSupportMessage);
router.get("/getAllMessages", getAllMessages);

export default router;
