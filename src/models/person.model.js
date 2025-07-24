import mongoose from "mongoose";

const schemaModel = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    dod: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    living: {
      type: Boolean,

      required: true,
    },

    profileImage: {
      type: String,
      default: process.env.DEFAULT_IMAGE,
    },
    treeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree",
    },
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", schemaModel);

export default Person;
