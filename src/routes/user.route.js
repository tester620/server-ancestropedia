import express from "express";
import {
  deletePost,
  editPost,
  getFamilyRelatedFeed,
  getMyPosts,
  postStory,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/post/myPosts", getMyPosts);
router.post("/post/create", postStory);
router.put("/post/edit/:id", editPost);
router.delete("/post/delete/:id", deletePost);
router.get("/feed", getFamilyRelatedFeed);

export default router;
