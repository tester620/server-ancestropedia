import mongoose from "mongoose";
import logger from "../config/logger.js";
import TokenRequest from "../models/token.model.js";

export const createTokenRequest = async (req, res) => {
  const { amount } = req.body;
  if (amount !== 10 && amount !== 50 && amount !== 100) {
    return res.status(400).json({
      message: "Valid amount values are 10, 50 and 100",
    });
  }
  try {
    const existingRequest = await TokenRequest.findOne({
      userId: req.user._id,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Request already pending",
      });
    }
    const newTokenRequest = new TokenRequest({
      amount,
      userId: req.user._id,
      status: "pending",
      comment: "Created request",
    });
    await newTokenRequest.save();
    return res.status(201).json({
      message: "New Token request created successfully",
      data: newTokenRequest,
    });
  } catch (error) {
    logger.error("Error in creating token request-User", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyTokenRequests = async (req, res) => {
  try {
    const allRequests = await TokenRequest.find({ userId: req.user._id });
    if (!allRequests || !allRequests.length) {
      return res.status(404).json({
        message: "No token requests found",
      });
    }
    return res.status(200).json({
      message: "All token requests fetched successfully",
      data: allRequests,
    });
  } catch (error) {
    logger.error("Error in getting all the requests for tokens", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSpecificTokenRequest = async (req, res) => {
  const { tokenId } = req.query;
  if (!tokenId || !mongoose.isValidObjectId(tokenId)) {
    return res.status(400).json({
      message: "Valid token request id is required",
    });
  }
  try {
    const tokenRequest = await TokenRequest.findById(tokenId);
    if (!tokenRequest) {
      return res.status(404).json({
        message: "No token request found",
      });
    }
    return res.status(200).json({
      message: "Token request fetched succesfully",
      data: tokenRequest,
    });
  } catch (error) {
    logger.error("Error in getting specific tokken request", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
