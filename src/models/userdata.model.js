import mongoose from "mongoose";

const modelSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  motherName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    requierd: true,
  },
  motherDob: {
    type: Date,
    required: true,
  },
  fatherDob: {
    type: Date,
    required: true,
  },
  grandFatherName: {
    type: String,
    required: true,
  },
  grandMotherName: {
    type: String,
    required: true,
  },
  mGrandMotherName: {
    type: String,
    required: true,
  },
  mGrandFatherDob: {
    type: Date,
    required: true,
  },
  grandFatherDob: {
    type: Date,
    required: true,
  },
  grandMotherDob: {
    type: Date,
    required: true,
  },
  mGrandMotherDob: {
    type: Date,
    required: true,
  },
  mGrandFatherDob: {
    type: Date,
    required: true,
  },
});
