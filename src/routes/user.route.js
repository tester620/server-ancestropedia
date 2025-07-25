import express from "express";
import {
  bulkDeletePost,
  deletePost,
  editPost,
  getMyPosts,
  postStory,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/post/myPosts", getMyPosts);
router.post("/post/create", postStory);
router.put("/post/edit/:id", editPost);
router.delete("/post/delete/:id", deletePost);
router.post("/post/remove/bulk", bulkDeletePost);

export default router;
