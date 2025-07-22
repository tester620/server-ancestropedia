import mongoose from "mongoose";
import logger from "../../config/logger.js";
import SupportMessage from "../../models/support.model.js";

export const getSupportMessage = async (req, res) => {
  const { messageId } = req.query;

  try {
    if (!messageId || !mongoose.isValidObjectId(messageId)) {
      return res.status(400).json({
        message: "Valid message Id is required",
      });
    }

    const message = await SupportMessage.findById(messageId);
    if (!messageId) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    return res.status(200).json({
      message: "Message fetched successfully",
      data: message,
    });
  } catch (error) {
    console.log("Error in getting Support Message", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const allMessages = await SupportMessage.find({}).sort({ createdAt: -1 });

    if (!allMessages || !allMessages.length) {
      return res.status(404).json({
        message: "No Messages found",
      });
    }

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: allMessages,
    });
  } catch (error) {
    logger.error("Error in getting all the messages", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
