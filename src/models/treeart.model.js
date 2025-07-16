import mongoose from "mongoose";

const modelSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ["placed", "delivered", "receieved"],
  },
  addressDetails: {
    country: {
      type: String,
      default: "India",
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },
  notes: {
    type: String,
  },
  details: {
    type: String,
  },
};

const TreeArtModel = mongoose.model("TreeArtModel", modelSchema);
export default TreeArtModel;
