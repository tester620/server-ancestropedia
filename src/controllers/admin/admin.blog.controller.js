import mongoose from "mongoose";
import { imagekit } from "../../config/imagekit.js";
import AdminBlog from "../../models/admin.blogs.model.js";
import logger from "../../config/logger.js";

export const createBlog = async (req, res) => {
  const { title, description, image } = req.body;
  try {
    if (!title?.trim() || !description.trim()) {
      return res.status(400).json({
        message: "please fill all the required feilds",
      });
    }
    if (title.length < 5 || title.length > 100) {
      return res.status(400).json({
        message: "Title should be in between 5 and 100 characters",
      });
    }
    if (description.length < 100 || title.length > 5000) {
      return res.status(400).json({
        message: "Title should be in between 100 and 5000 characters",
      });
    }
    let imageUrl = null;
    let imageFileId = null;

    if (image) {
      const uploadRes = await imagekit.upload({
        file: image,
        fileName: "Blog.jpg",
      });
      imageUrl = uploadRes.url;
      imageFileId = uploadRes.fileId;
    }

    const newBlog = new AdminBlog({
      title,
      description,
    });
    if (imageUrl) {
      newBlog.imageUrl = imageUrl;
      newBlog.imageFileId = imageFileId;
    }
    await newBlog.save();
    return res.status(201).json({
      message: "New blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    logger.error("Error in creating blog post", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const editBlog = async (req, res) => {
  const { newTitle, newDescription, newImage } = req.body;
  const { blogId } = req.query;
  if (!blogId || !mongoose.isValidObjectId(blogId)) {
    return res.status(400).json({
      message: "Valid blog Id is required",
    });
  }

  if (!newTitle && !newDescription && !newImage) {
    return res.status(400).json({
      message: "Atleast one feild is required",
    });
  }

  try {
    const blog = await AdminBlog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    if (newTitle) blog.title = newTitle;
    if (newDescription) blog.description = newDescription;
    if (newImage) {
      await imagekit.deleteFile(blog.imageFileId);
      const uploadRes = await imagekit.upload({
        file: newImage,
        fileName: "Blog.jpg",
      });
      blog.imageUrl = uploadRes.url;
      blog.imageFileId = uploadRes.fileId;
    }
    await blog.save();
    return res.status(200).json({
      message: "Blog updated succesfully",
      data: blog,
    });
  } catch (error) {
    logger.error("Error in updating blogs", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeBlog = async (req, res) => {
  const { blogId } = req.query;
  try {
    const blog = await AdminBlog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found to delete",
      });
    }
    if (blog.image) {
      await imagekit.deleteFile(blog.imageFileId);
    }
    await AdminBlog.findByIdAndDelete(blogId);
    return res.status(202).json({
      message: "Blog post has been deleted",
    });
  } catch (error) {
    logger.error("Error in removing the blog", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await AdminBlog.find({});
    if (!blogs) {
      return res.status(404).json({
        message: "No blogs found",
      });
    }

    return res.status(200).json({
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    logger.error("Error in getting my blogs", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSpecificBlog = async (req, res) => {
  const { blogId } = req.query;
  try {
    if (!blogId || !mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        message: "Valid Blog Id is required",
      });
    }

    const blog = await AdminBlog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      message: "Blog fecthed succesfully",
      data: blog,
    });
  } catch (error) {
    logger.error("Error in getting specific blog", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
