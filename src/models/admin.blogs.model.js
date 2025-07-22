import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    imageFileId: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AdminBlog = mongoose.model("AdminBlog", modelSchema);
export default AdminBlog;
