const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const {
    AI_DAILY_REQUEST_LIMIT,
    getRemainingAiRequests,
} = require("../utils/requestLimit.util");

/**
 * @param {*} req /api/v1/profile
 * @param {*} description  get logged in user profile
 */

const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("fullName email createdAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Profile stats
    const [totalChats, totalMessages, requestsRemaining] = await Promise.all([
      chatModel.countDocuments({ user: user._id }),
      messageModel.countDocuments({ user: user._id }),
      getRemainingAiRequests(user._id),
    ]);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        fullName: user.fullName,
        email: user.email,
        joinedAt: user.createdAt,
        dailyRequestLimit: AI_DAILY_REQUEST_LIMIT,
        stats: {
          totalChats,
          totalMessages,
          requestsRemaining,
        },
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getUserProfileController;