import mongoose from "mongoose";
import Report from "../../models/report.model.js";
import Notification from "../../models/notification.model.js";
import User from "../../models/user.model.js";
import { sendReportReviewMail } from "../../utils/helper.js";

//add pagination.limit and offset
export const getAllReports = async (req, res) => {
  try {
    const allReports = await Report.find({}).sort({ createdAt: -1 });
    if (!allReports || !allReports.length) {
      return res.status(404).json({
        message: "No Report found",
      });
    }
    return res.status(200).json({
      message: "All reports fetched successfully",
      data: allReports,
    });
  } catch (error) {
    console.log("Error in getting all the reports", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSpecificReport = async (req, res) => {
  const { reportId } = req.query;
  if (!reportId || !mongoose.isValidObjectId(reportId)) {
    return res.status(400).json({
      message: "Valid report Id is required",
    });
  }
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.status(200).json({
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    console.log("Error in getting specific report", error);
  }
};

export const reviewReport = async (req, res) => {
  const { reportId } = req.query;
  const { about } = req.body;
  if (!reportId || !mongoose.isValidObjectId(reportId)) {
    return res.status(400).json({
      message: "Valid Report Id is requried",
    });
  }
  if (!about) {
    return res.status(400).json({
      message: "About section is required",
    });
  }
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(400).json({
        message: "Report not found",
      });
    }
    if (report.status !== "pending") {
      return res.status(400).json({
        message: "Report cannot be reviewed. Status is not pending",
      });
    }

    const user = await User.findById(report.fromId);
    if (!user) {
      return res.status(400).json({
        message:
          "User has been deleted or removed their account from the platform",
      });
    }
    //update the url after the frontend routing completion
    const newNotifiaction = await Notification({
      about,
      toUser: report.fromId.toString(),
      fromUser: req?.user?._id.toString(),
      redirectUrl: `${process.env.FRONTEND_URL}/report/myReports/${reportId}`,
    });

    await newNotifiaction.save();
    report.status = "resolved";
    await report.save();
    await sendReportReviewMail(report, user);
    return res.status(200).json({
      message: "Report reviwed successsfully",
      data: {
        report,
        newNotifiaction,
      },
    });
  } catch (error) {
    console.log("Error in revewing the report", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//add pagination,offset and limit
export const getReportsToreview = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    if (!reports || !reports.length) {
      return res.status(404).json({
        message: "No pending reports found",
      });
    }
    return res.status(200).json({
      message: "Pending reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.log("Error in fetching pending reports", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
