import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "alloted", "rejected"],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TokenRequest = mongoose.model("TokenRequest", modelSchema);

export default TokenRequest;
