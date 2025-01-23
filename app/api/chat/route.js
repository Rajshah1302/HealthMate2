import connect from "../../../lib/db";
import { getGroqChatCompletion } from "../../../lib/groqUtils";
import Conversation from "../__models/conversation";

export async function POST(req) {
  try {
    await connect();

    const mockUser = {
      email: "tes1t@example.com",
      name: "Test U1ser",
      image: "https://example.com/avatar.jpg",
    };

    const { userInput, chatHistory } = await req.json();
    const chatCompletion = await getGroqChatCompletion(userInput, chatHistory);
    const assistantResponse = chatCompletion.choices[0]?.message?.content || "";

    const chat = `\n user:${userInput} \n assistant: ${assistantResponse}`;
    let conversation = await Conversation.findOne({ userId: mockUser.email });

    if (!conversation) {
      conversation = new Conversation({
        userId: mockUser.email,
        History: [],
      });
    }

    if (!conversation.History) {
      conversation.History = [];
    }

    const today = new Date().toISOString().slice(0, 10);
    let existingHistory = conversation.History.find(
      (history) => history.date.toISOString().slice(0, 10) === today
    );

    if (existingHistory) {
      existingHistory.chatHistory += ` ${chat}`;
      existingHistory.summary = "";
    } else {
      conversation.History.push({
        date: new Date(),
        chatHistory: chat,
        summary: "",
        mood: "",
      });
    }

    await conversation.save();

    return new Response(JSON.stringify({ assistantResponse }), { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}