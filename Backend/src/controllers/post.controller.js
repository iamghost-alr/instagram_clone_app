const Post = require("../models/post.model");
const { uploadFile } = require("../services/storage.service");

async function createPost(req, res) {
  try {
    const authId = req.authId;
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    // Upload to storage
    const result = await uploadFile(file.buffer, {
      fileName: file.originalname,
      folder: "posts",
    });

    const post = new Post({
      user: authId,
      caption: caption || "",
      image: result.url,
    });

    await post.save();

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function deletePost(req, res) {
  try {
    const authId = req.authId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.user.toString() !== authId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = { createPost, deletePost };
