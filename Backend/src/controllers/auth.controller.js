const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const Auth = require("../models/auth.model");
const User = require("../models/user.model");

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Auth.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({
      username,
      email,
      password: hashedPassword,
    });

    await User.create({
      userId: user._id,
    });

    user.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await Auth.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    user.password = undefined;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function logoutUser(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authId = decodedToken.id;

    const user = await User.findOne({ userId: authId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.clearCookie("token");

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = { registerUser, loginUser, logoutUser, deleteUser };
