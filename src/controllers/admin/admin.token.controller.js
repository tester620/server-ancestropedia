import mongoose from "mongoose";
import logger from "../../config/logger.js";
import TokenRequest from "../../models/token.model.js";
import User from "../../models/user.model.js";
import {
  sendTokenAllotmentMail,
  sendTokenRejectionMail,
  sendTokenRemovalMail,
} from "../../utils/helper.js";

const redirectUrl = process.env.FRONTEND_URL;

export const getPendingTokenRequests = async (req, res) => {
  try {
    const tokenRequests = await TokenRequest.find({ status: "pending" });
    if (!tokenRequests || !tokenRequests.length) {
      return res.status(404).json({
        message: "No token request found",
      });
    }
    return res.status(200).json({
      message: "Token Requests fetched successfully",
      data: tokenRequests,
    });
  } catch (error) {
    logger.error("Error in getting pending token requests", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//Also create a new notification for the user when rejecting the token request
export const rejectTokenRequest = async (req, res) => {
  const { comment, tokenId } = req.body;
  if (!tokenId || !mongoose.isValidObjectId(tokenId)) {
    return res.status(400).json({
      message: "Valid token request id is required",
    });
  }
  if (!comment || !comment.length) {
    return res.status(400).json({
      message: "Comment is required",
    });
  }
  if (comment.length > 100 || comment.length < 5) {
    return res.status(400).json({
      message: "Comment length should be betweeen 5 and 100 characters",
    });
  }
  try {
    const tokenRequest = await TokenRequest.findById(tokenId);
    if (!tokenRequest) {
      return res.status(404).json({
        message: "Token request not found",
      });
    }
    if (tokenRequest.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be rejected",
      });
    }
    const user = await User.findById(tokenRequest.userId);
    if (!user) {
      return res.status(404).json({
        message: "No user found with the token request",
      });
    }
    tokenRequest.status = "rejected";
    tokenRequest.comment = comment;
    await tokenRequest.save();
    await sendTokenRejectionMail(user, redirectUrl);

    return res.status(200).json({
      message: "Token request rejected successfully",
      data: tokenRequest,
    });
  } catch (error) {
    logger.error("Error in rejecting token request", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//Also create a new notification for the user when alloting the token request
export const allotToken = async (req, res) => {
  const { tokenId, comment } = req.body;
  if (!comment || !comment.length) {
    return res.status(400).json({
      message: "Comment is required",
    });
  }
  if (comment.length > 100 || comment.length < 5) {
    return res.status(400).json({
      message: "Comment length should be betweeen 5 and 100 characters",
    });
  }
  if (!tokenId || !mongoose.isValidObjectId(tokenId)) {
    return res.status(400).json({
      message: "Valid token id is required",
    });
  }
  try {
    const tokenRequest = await TokenRequest.findById(tokenId);
    if (!tokenRequest) {
      return res.status(404).json({
        message: "Token request not found",
      });
    }
    tokenRequest.status = "alloted";
    tokenRequest.comment = comment;
    const user = await User.findById(tokenRequest.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.tokens = tokenRequest.amount;
    await user.save();
    await tokenRequest.save();
    await sendTokenAllotmentMail(user, redirectUrl);
    return res.status(200).json({
      message: "Token alotted successfully",
      data: tokenRequest,
    });
  } catch (error) {
    logger.error("Error in alloting tokens", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//Also create a new notification for the user when removing the tokens
export const removeToken = async (req, res) => {
  const { tokenId, comment, amount } = req.body;
  if (!comment || !comment.length) {
    return res.status(400).json({
      message: "Comment is required",
    });
  }
  if (!amount || typeof amount !== "number") {
    return res.status(400).json({
      message: "Amount must be a valid number",
    });
  }
  if (comment.length > 100 || comment.length < 5) {
    return res.status(400).json({
      message: "Comment length should be betweeen 5 and 100 characters",
    });
  }
  if (!tokenId || !mongoose.isValidObjectId(tokenId)) {
    return res.status(400).json({
      message: "Valid token request is required",
    });
  }

  try {
    const tokenRequest = await TokenRequest.findById(tokenId);
    if (!tokenRequest) {
      return res.status(404).json({
        message: "No token found with given id",
      });
    }
    const user = await User.findById(tokenRequest.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.tokens = amount;
    await user.save();
    await sendTokenRemovalMail(user, redirectUrl);
    return res.status(200).json({
      message: "User token removed successfully",
    });
  } catch (error) {
    logger.error("Error in removing the tokens", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllTokenRequests = async (req, res) => {
  try {
    const tokens = await TokenRequest.find({});
    if (!tokens || !tokens.length) {
      return res.status(404).json({
        message: "No token requests found",
      });
    }
    return res.status(200).json({
      message: "All token requests fetched successfully",
      data: tokens,
    });
  } catch (error) {
    logger.error("Error in getting all the token requests", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
