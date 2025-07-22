import mongoose, { mongo } from "mongoose";

const modelSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SupportMessage = mongoose.model("SupportMessage", modelSchema);

export default SupportMessage;
