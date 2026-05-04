const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Post = require("../models/post.model");

async function getAllPost(req, res) {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function likePost(req, res) {
  try {
    const authId = req.authId;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.likes.some((id) => id.toString() === authId)) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    post.likes.push(authId);
    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      post,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

async function unlikePost(req, res) {
  try {
    const authId = req.authId;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!post.likes.some((id) => id.toString() === authId)) {
      return res.status(400).json({
        message: "Post not liked",
      });
    }

    post.likes.pull(authId);
    await post.save();

    return res.status(200).json({
      message: "Post unliked successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function commentOnPost(req, res) {
  try {
    const authId = req.authId;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const text = req.body.comment || req.body.message;

    if (!text) {
      return res.status(400).json({
        message: "Comment is empty",
      });
    }

    post.comments.push({
      user: authId,
      content: text,
    });

    await post.save();

    return res.status(200).json({
      message: "Post commented successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { getAllPost, likePost, unlikePost, commentOnPost };
