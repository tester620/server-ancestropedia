import mongoose from "mongoose";

const modelSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  addressType: {
    type: String,
    required: true,
    enum: ["home", "work"],
  },
  landmark: {
    type: String,
    requried: true,
  },
});

const Address = mongoose.model("Address", modelSchema);
export default Address;
