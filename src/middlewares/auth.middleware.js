const jwt = require("jsonwebtoken");
const Auth = require("../models/auth.model");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authId = decodedToken.id;

    req.authId = authId;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

function roleMiddleware(allowedRoles) {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Auth.findById(decoded.id);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      req.authId = user._id;
      req.role = user.role;

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
}

module.exports = { authMiddleware, roleMiddleware };
