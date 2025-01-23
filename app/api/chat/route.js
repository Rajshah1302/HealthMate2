import Groq from "groq-sdk";
import connect from "../../../lib/db";
import Conversation from "../__models/conversation";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(userInput, chatHistory) {
  return groq.chat.completions.create({
    messages: [
      ...chatHistory,
      {
        role: "system",
        content: `You are a compassionate virtual therapist. Your goal is to provide empathetic, thoughtful, and supportive responses to help users feel heard and guide them through their concerns. Keep your tone calm and understanding. Give messages about 175 words`,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

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
    const chat = '\n user: '+ userInput + ' \n assistant:' + assistantResponse;
    let conversation = await Conversation.findOne({ userId: mockUser.email });

if (!conversation) {
  // Create a new conversation object if none exists
  conversation = new Conversation({
    userId: mockUser.email,
    History: [],
  });
}

// Ensure History exists as an array
if (!conversation.History) {
  conversation.History = [];
}

const today = new Date().toISOString().slice(0, 10);

// Find an existing history entry for today
let existingHistory = conversation.History.find(
  (history) => history.date.toISOString().slice(0, 10) === today
);

if (existingHistory) {
  // Append the new chat to the existing chatHistory string
  existingHistory.chatHistory += ` ${chat}`;
  existingHistory.summary = "";
} else {
  // Create a new entry if none exists for today
  conversation.History.push({
    date: new Date(),
    chatHistory: chat, // Initialize with the new chat text
    summary: "",
    mood: "",
  });
}

// Save the updated conversation to the database
await conversation.save();

    
  
    return new Response(JSON.stringify({ assistantResponse }), { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
