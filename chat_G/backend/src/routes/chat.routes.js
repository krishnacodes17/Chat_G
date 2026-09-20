const express = require("express")
const authUser = require("../middleware/auth.middeleware")
const { chatController, getAllChatController, getSingaleChatController } = require("../controllers/chat.controller")

const chatRouter = express.Router()



chatRouter.post("/",authUser ,chatController )
chatRouter.get("/getchatHistory",authUser , getAllChatController)
chatRouter.get("/getSingalChat/:chatId",authUser , getSingaleChatController)


module.exports = chatRouter