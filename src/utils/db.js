import mongoose from "mongoose";
import logger from "../config/logger";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected succesfully", connection.connection.host);
  } catch (err) {
    logger.error("Error while connecting to database", err);
  }
};
