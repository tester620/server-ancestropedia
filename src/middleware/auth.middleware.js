import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../config/logger.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized - Please Login" });
    }
    const decodedId = jwt.verify(token, process.env.JWT_KEY);
    if (!decodedId) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decodedId.userId).select(
      "-viewsLeft -verificationToken"
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
