const User = require("../models/user.model");
const Auth = require("../models/auth.model");

async function getUser(req, res) {
  try {
    const userId = req.params.id;

    const authUser = await Auth.findById(userId);
    if (!authUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = await User.findOne({ userId }).populate(
      "followers following",
      "username",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      username: authUser.username,
      role: authUser.role,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const authId = req.authId;

    const { bio, profilePicture } = req.body;

    const user = await User.findOne({ userId: authId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function followUser(req, res) {
  try {
    const currentAuthId = req.authId;
    const targetAuthId = req.params.id;

    if (currentAuthId === targetAuthId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const user = await User.findOne({ userId: targetAuthId });
    const currentUser = await User.findOne({ userId: currentAuthId });

    if (!user || !currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.followers.some((id) => id.toString() === currentAuthId)) {
      return res.status(400).json({
        message: "User already followed",
      });
    }

    user.followers.push(currentAuthId);
    currentUser.following.push(targetAuthId);

    await user.save();
    await currentUser.save();

    return res.status(200).json({
      message: "User followed successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function unfollowUser(req, res) {
  try {
    const currentAuthId = req.authId;
    const targetAuthId = req.params.id;

    if (currentAuthId === targetAuthId) {
      return res.status(400).json({
        message: "You cannot unfollow yourself",
      });
    }

    const user = await User.findOne({ userId: targetAuthId });
    const currentUser = await User.findOne({ userId: currentAuthId });

    if (!user || !currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.followers.some((id) => id.toString() === currentAuthId)) {
      return res.status(400).json({
        message: "User not followed",
      });
    }

    user.followers.pull(currentAuthId);
    currentUser.following.pull(targetAuthId);

    await user.save();
    await currentUser.save();

    return res.status(200).json({
      message: "User unfollowed successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = { getUser, updateUser, followUser, unfollowUser };
