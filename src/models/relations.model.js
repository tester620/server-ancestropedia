import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    treeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree",
      index:true
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["father","mother", "spouse"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Relation = mongoose.model("Relation", modelSchema);
export default Relation;
