const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  followUser,
  unfollowUser,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/:id", getUser);
router.put("/:id", authMiddleware, updateUser);
router.post("/:id/follow", authMiddleware, followUser);
router.post("/:id/unfollow", authMiddleware, unfollowUser);

module.exports = router;
