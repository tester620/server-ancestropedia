import express from "express";
import {
  createNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/fetch", getNotifications);
router.put("/markRead", markAsRead);
router.put("/markAllRead", markAllAsRead);
router.post("/create", createNotification);

export default router;
