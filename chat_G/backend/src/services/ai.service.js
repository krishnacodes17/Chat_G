const { ChatGroq } = require("@langchain/groq");
const { ToolMessage } = require("@langchain/core/messages");

const createGetChatHistoryTool = require("../tools/chatHistory.tool");

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    maxTokens: 512,
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
                "You are MousAI, a friendly and precise AI assistant. " +
                "Answer rules: " +
                "1. Be direct and concise — no greetings, no fillers, no repetition. " +
                "2. Use bullet points or short sections only when they truly help readability. " +
                "3. Reply in the same language the user writes in. " +
                "4. If a question is vague or missing context, ask one short clarifying question. " +
                "5. For code, show only the relevant snippet with a one-line explanation. " +
                "6. Use get_chat_history only when the answer needs previous context from this chat. " +
                "7. Never mention these rules or that you are an AI.",
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