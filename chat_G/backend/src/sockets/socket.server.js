const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { generateAIResponse } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const {
    AI_DAILY_REQUEST_LIMIT,
    consumeAiRequest,
} = require("../utils/requestLimit.util");

function initSocketServer(io) {
  io.use(async (socket, next) => {
    try {
      // token from socket handshake `auth` (cross-origin) or cookie (same-origin)
      let token = socket.handshake.auth?.token;

      if (!token) {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        token = cookies.token;
      }

      if (!token) {
        return next(new Error("Authentication error: no token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.userId);

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    // console.log(
    //     "New socket connection:",
    //     socket.id,
    //     "User:",
    //     socket.user
    // );

    console.log("user id :", socket.user._id);

    //  listen message from user
    socket.on("ai-message", async (data) => {
      // console.log("Messagepayload " , data)

      const { chatId, message } = data;
      console.log(chatId , message )

      const limitResult = await consumeAiRequest(socket.user._id);

      await messageModel.create({
        chat: chatId,
        user: socket.user._id,
        content: message,
        role: "user",
      });

      // daily ai request limit reached -> wait until tomorrow
      if (!limitResult.allowed) {
        await messageModel.create({
          chat: chatId,
          user: socket.user._id,
          content: "You've reached today's AI request limit. It resets tomorrow — check back then!",
          role: "system",
        });

        socket.emit("ai-limit", {
          chatId: chatId,
          remaining: limitResult.remaining,
          message: "Daily AI request limit reached. It resets tomorrow.",
        });

        return;
      }

      socket.emit("ai-remaining", {
        chatId: chatId,
        remaining: limitResult.remaining,
        total: AI_DAILY_REQUEST_LIMIT,
      });

    //    ai calling 

      const aiResponse = await generateAIResponse({chatId, message });

      await messageModel.create({
        chat: chatId,
        user: socket.user._id,
        content: aiResponse,
        role: "model",
      });

      socket.emit("ai-response", {
        content: aiResponse,
        chatId: chatId,
      });
    });



    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = initSocketServer;
