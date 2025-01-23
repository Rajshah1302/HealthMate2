import Groq from "groq-sdk";

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