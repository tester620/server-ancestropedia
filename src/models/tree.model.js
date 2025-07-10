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
    default:process.env.DEFAULT_IMAGE,
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
