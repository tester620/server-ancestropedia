import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import dotenv from "dotenv";
import logger from "../config/logger.js";

dotenv.config();

export const getNotifications = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const notifications = await Notification.find({ toUser: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ toUser: user._id });

    if (!notifications.length) {
      return res.status(404).json({
        message: "No notifications available",
      });
    }

    return res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotifications: total,
    });
  } catch (error) {
    logger.error("Error in getting notifications", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const markAsRead = async (req, res) => {
  const { notificationId } = req.query;
  try {
    if (!notificationId) {
      return res.status(400).json({
        message: "Request Id is required",
      });
    }
    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({
        message: "Invalid request Id",
      });
    }

    const notification = await Notification.findById(notificationId);
    if (notification.toUser.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized- Can't mark read to others notifications",
      });
    }
    notification.isRead = true;
    await notification.save();
    return res.status(200).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    logger.error("Error in marking notification as read", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: req.user._id });
    if (!notifications || !notifications.length) {
      return res.status(404).json({
        message: "No Notifications found",
      });
    }
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      message: "Notification marked as read ",
    });
  } catch (error) {
    logger.error("Error in upadting all the notification as read", error);
    return res.status(500).json({
      message: "internal Server Error",
    });
  }
};

export const createNotification = async (req, res) => {
  const { userId, about } = req.body;
  try {
    if (!userId || !about) {
      return res.status(400).json({
        message: "Both the feilds are required",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid User Id",
      });
    }
    const newNotification = new Notification({
      fromUser: req.user._id,
      toUser: userId,
      about,
      redirectUrl: `${process.env.FRONTEND_URL}/user/view/${userId}`,
    });
    await newNotification.save();
    return res.status(201).json({
      message: "New notification created",
      data: newNotification,
    });
  } catch (error) {
    logger.error("Error in creating new notification", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
