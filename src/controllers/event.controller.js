import logger from "../config/logger.js";

export const getEvents = async (req, res) => {
  try {
    
  } catch (error) {
    logger.error("Error in getting all the events", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
