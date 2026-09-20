const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

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
