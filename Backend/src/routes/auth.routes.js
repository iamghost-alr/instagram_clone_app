const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, deleteUser } = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete", deleteUser);

module.exports = router;