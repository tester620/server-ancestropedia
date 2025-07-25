import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    spouseA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    spouseB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    marriageDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Marriage = mongoose.model("Marriage", modelSchema);

export default Marriage;
