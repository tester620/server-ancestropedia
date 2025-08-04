import express from "express";
import validator from "validator";
import NewsLetter from "../models/newletter.model.js";
import logger from "../config/logger.js";

const router = express.Router();

router.post("/sub", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }
    const exisitingEntry = await NewsLetter.findOne({ email });
    if (exisitingEntry) {
      return res.status(400).json({
        message: "Already subscribed",
      });
    }
    const newEntry = new NewsLetter({
      email,
    });
    await newEntry.save();
    return res.status(201).json({
      message: "Subscribed successfully",
      data: newEntry,
    });
  } catch (error) {
    logger.error("Error in subscribing to newsletter", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
