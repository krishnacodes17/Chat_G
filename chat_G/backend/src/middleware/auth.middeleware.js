const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authUser = async (req, res, next) => {
  try {
    // 1) cookie (same-origin) OR 2) Authorization: Bearer <token> (cross-origin)
    let token = req.cookies.token;

    const authHeader = req.headers.authorization;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // console.log("token hai ywe ",token)

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
        success: false,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

module.exports = authUser;
