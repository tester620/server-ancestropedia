import mongoose from "mongoose";

const FamilyTreeSchema = new mongoose.Schema({
  fullName: String,
  dob: Date,
  birthplace: String,
  verified:{
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dq1x4j3zv/image/upload/v1735686260/ancestropedia/default-profile-picture.png",
  },
  birthDate: {
    type: Date,
    required: true,
  },
  deathDate: {
    type: Date,
    default: null,
  },
  gender: String,
  mother: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyTree" },
  father: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyTree" },
  siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyTree" }],
});

const familyTree = mongoose.model("FamilyTree", FamilyTreeSchema);
export default familyTree;
