const express = require("express");

const router = express.Router();

const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

const { createPost, deletePost } = require("../controllers/post.controller");
const {
  getAllPost,
  likePost,
  unlikePost,
  commentOnPost,
} = require("../controllers/feed.controller");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["influencer", "admin"]),
  upload.single("image"),
  createPost,
);

router.delete(
  "/delete/:postId",
  authMiddleware,
  roleMiddleware(["influencer", "admin"]),
  deletePost,
);

router.get("/", authMiddleware, getAllPost);

router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/unlike", authMiddleware, unlikePost);

router.post("/:id/comment", authMiddleware, commentOnPost);

module.exports = router;
