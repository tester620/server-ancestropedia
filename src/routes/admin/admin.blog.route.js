import express from "express";
import {
  createBlog,
  editBlog,
  getMyBlogs,
  getSpecificBlog,
  removeBlog,
} from "../../controllers/admin/admin.blog.controller.js";

const router = express.Router();

router.post("/createBlog", createBlog);
router.put("/update", editBlog);
router.delete("/remove", removeBlog);
router.get("/myBlogs", getMyBlogs);
router.get("/specificBlog", getSpecificBlog);

export default router;
