import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected succesfully", connection.connection.host);
  } catch (err) {
    console.log("Error while connecting to database", err);
  }
};
