import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { userInput, chatHistory } = await req.json();
    const chatCompletion = await getGroqChatCompletion(userInput, chatHistory);
    const assistantResponse = chatCompletion.choices[0]?.message?.content || "";
    return new Response(
      JSON.stringify({ assistantResponse }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500 }
    );
  }
}

/**
 * Function to fetch chat completion from Groq
 * @param {string} userInput - The user's input
 * @param {Array} chatHistory - Array of message history
 */
export async function getGroqChatCompletion(userInput, chatHistory) {
  return groq.chat.completions.create({
    messages: [
      ...chatHistory,
      {
        role: "system",
        content: `You are a compassionate virtual therapist. Your goal is to provide empathetic, thoughtful, and supportive responses to help users feel heard and guide them through their concerns. Keep your tone calm and understanding. Give short messages about 2 lines`,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
