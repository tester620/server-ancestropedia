import mongoose from "mongoose";
import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import logger from "../config/logger.js";

export const sendRequest = async (req, res) => {
  const { type, userId } = req.body;
  try {
    if (!type || !userId) {
      return res.status(400).json({
        message: "Both the feilds are required",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
      });
    }
    if (type !== "phone" && type !== "contact" && !type !== "phone") {
      return res.status(400).json({
        message: "Invalid type for the request",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found to send request",
      });
    }

    const exisitingRequest = await Request.findOne({
      $or: [
        { fromUser: req.user._id, toUser: userId },
        { fromUser: userId, toUser: req.user._id },
      ],
    });
    if (exisitingRequest) {
      return res.status(400).json({
        message: "Request already made",
      });
    }

    const newRequest = new Request({
      fromUser: req.user._id,
      toUser: userId,
      type,
      status: "pending",
    });

    await newRequest.save();
    return res.status(201).json({
      message: "Request sent successfully",
      data: newRequest,
    });
  } catch (error) {
    logger.error("Error in sending the request", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      toUser: req.user._id,
    });

    if (!requests || !requests.length) {
      return res.status(404).json({
        message: "No requests found",
      });
    }

    return res.status(200).json({
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    logger.error("Error in getting my requests", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//review request for the user and store the access in the database for
//Remove it just for now, we will discuss it later on
// export const reviewRequest = async (req, res) => {
//   const { requestId } = req.params;
//   const { status } = req.body;

//   try {
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({
//         message: "Error,Invalid request id",
//       });
//     }

//     if (status !== "accepted" && status !== "rejected") {
//       return res.status(400).json({
//         message: "invalid Status for request",
//       });
//     }
//     request.status = status;
//     await request.save();
//     return res.status(200).json({
//       message: `Request ${status} successfully`,
//       data: request,
//     });
//   } catch (error) {
//     logger.error("Error in reviewing the user request for profile data", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };
