import mongoose from "mongoose";
import { imagekit } from "../config/imagekit.js";
import Post from "../models/post.model.js";

export const postStory = async (req, res) => {
  const { image, videoUrl, description } = req.body;
  try {
    let data = {
      imageUrl: "",
      videoUrl: "",
      description: "",
    };
    if (image) {
      const uplaodRes = await imagekit.upload(image);
      data.imageUrl = uplaodRes.url;
    }
    if (videoUrl) {
      data.videoUrl = videoUrl;
    }
    if (description) {
      data.description = description;
    }
    const newPost = new Post({
      userId: req.user._id,
      videoUrl: data?.videoUrl,
      imageUrl: data?.imageUrl,
      description: data?.description,
    });

    await newPost.save();
    return res.status(201).json({
      message: "Post submitted successfully",
      data: newPost,
    });
  } catch (error) {
    console.log("Error in uploading post", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const editPost = async (req, res) => {
  const { description } = req.body;
  const { id } = req.query;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found to update",
      });
    }
    if (post.userId) {
      return res.status(401).json({
        message: "Unathorized, cant edit this post",
      });
    }

    post.description = description;
    await post.save();
    return res.status(200).json({
      message: "Post Updated successfully",
      data: post,
    });
  } catch (error) {
    console.log("Error in updating post", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deletePost = async (req, res) => {
  const user = req.user;
  const { id } = req.query;
  if(!mongoose.isValidObjectId(id)){
    return res.status(400).json({
      message:"Invalid Post id"
    })
  }
  try {
    const post = await Post.findById(id);
    if (!post.userId.toString() === user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorised to delete the post",
      });
    }

    await Post.findByIdAndDelete(id);
    return res.status(202).json({
      message: "Delete request have been made",
    });
  } catch (error) {
    console.log("Error in deleting the post");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
