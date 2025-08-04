import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    email: {
      type: "String",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const NewsLetter = mongoose.model("NewsLetter", modelSchema);
export default NewsLetter;
