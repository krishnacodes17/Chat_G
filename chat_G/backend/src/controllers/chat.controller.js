const { success } = require("zod");
const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");

const chatController = async (req, res) => {
  try {
    const { title } = req.body;
    const user = req.user;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
        success: false,
      });
    }

    const chat = await chatModel.create({
      user: user._id,
      title: title.trim(),
    });

    return res.status(201).json({
      message: "Chat created successfully",
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getAllChatController = async (req, res) => {
  try {
    const user = req.user;

    const allChatHistory = await chatModel
      .find({ user: user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All chat history get successfully",
      success: true,
      allChatHistory,
    });
  } catch (error) {
    (console.log(error),
      res.status(500).json({
        message: "internal server error",
        success: false,
      }));
  }
};

const getSingaleChatController = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await messageModel
      .find({
        chat: chatId,
        user: req.user._id,
      })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  chatController,
  getAllChatController,
  getSingaleChatController,
};
