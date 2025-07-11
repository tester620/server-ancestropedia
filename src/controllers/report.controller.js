import mongoose from "mongoose";
import Report from "../models/report.model.js";
import { imagekit } from "../config/imagekit.js";

export const getMyReports = async (req, res) => {
  const user = req.user;
  try {
    const reports = await Report.find({ fromId: user._id });
    if (!reports || reports.length === 0) {
      return res.status(404).json({
        message: "No reports found",
      });
    }

    return res.status(200).json({
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.log("Error in fetching my reports", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const submitReport = async (req, res) => {
  const { description, type, image } = req.body;
  if (!description || !type) {
    return res.status(400).json({
      message: "Report data is needed",
    });
  }

  try {
    let mediaURL;
    if (image) {
      const response = await imagekit.upload({
        file: image,
        fileName: fileName,
      });
      mediaURL = response.url;
    }
    const report = new Report({
      fromId: req.user._id,
      description,
      type,
      mediaURL
    });
    await report.save();
    return res.status(200).json({
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    console.log("Error in submitting report", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const abortReport = async (req, res) => {
  const user = req.user;
  const { id } = req.query;
  if (!mongoose.Schema.ObjectId(id)) {
    return res.status(400).json({
      message: "Invalid report id",
    });
  }
  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        message: "Report not found to delete",
      });
    }

    if (report.fromId.toString !== user._id.toSrting()) {
      return res.status(401).json({
        message: "Not authorized to abort report",
      });
    }
    report.status = "aborted";
    return res.status(200).json({
      message: "Report Aborted successfully",
    });
  } catch (error) {
    console.log("Error in aborting report", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
