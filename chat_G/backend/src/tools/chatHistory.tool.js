const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const messageModel = require("../models/message.model");

function createGetChatHistoryTool(chatId) {
    return tool(
        async () => {
            const history = await messageModel
                .find({
                    chat: chatId,
                })
                .sort({
                    createdAt: 1,
                })
                .limit(15)
                .lean();

            return JSON.stringify(
                history.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }))
            );
        },
        {
            name: "get_chat_history",

            description:
                "Get previous messages from the current chat conversation. Use this tool when previous conversation context is required.",

            schema: z.object({}),
        }
    );
}

module.exports = createGetChatHistoryTool;