import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["placed", "delivered", "received"],
      required: true
    },
    addressDetails: {
      country: {
        type: String,
        default: "India"
      },
      state: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      pincode: {
        type: Number,
        required: true
      }
    },
    notes: {
      type: String
    },
    details: {
      type: String
    }
  },
  { timestamps: true }
);

const DnaModel = mongoose.model("DnaModel", modelSchema);
export default DnaModel;
