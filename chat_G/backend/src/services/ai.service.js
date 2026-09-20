const { ChatGroq } = require("@langchain/groq");
const { ToolMessage } = require("@langchain/core/messages");

const createGetChatHistoryTool = require("../tools/chatHistory.tool");

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
});

async function generateAIResponse({ chatId, message }) {

    const getChatHistoryTool = createGetChatHistoryTool(chatId);

    const modelWithTools = model.bindTools([
        getChatHistoryTool,
    ]);

    const messages = [
        {
            role: "system",
            content:
                "You are a helpful AI assistant and your name is MouseAI. " +
                "Use get_chat_history when you need previous conversation context.",
        },
        {
            role: "user",
            content: message,
        },
    ];

    // First AI call
    const response = await modelWithTools.invoke(messages);

    // console.log("AI response:", response);
    // console.log("Tool calls:", response.tool_calls);

    // Agar AI ko tool ki zarurat nahi hai
    if (!response.tool_calls?.length) {
        return response.content;
    }

    // AIMessage ko conversation mein add karo
    messages.push(response);

    // Tool calls execute karo
    for (const toolCall of response.tool_calls) {

        if (toolCall.name === "get_chat_history") {

            const toolResult = await getChatHistoryTool.invoke(
                toolCall.args
            );

            console.log("Tool result:", toolResult);

            messages.push(
                new ToolMessage({
                    content: toolResult,
                    tool_call_id: toolCall.id,
                })
            );
        }
    }

    // Tool result ke baad AI ko dobara call karo
    const finalResponse = await modelWithTools.invoke(messages);

    // console.log("Final AI response:", finalResponse);

    return finalResponse.content;
}

module.exports = {
    generateAIResponse,
};