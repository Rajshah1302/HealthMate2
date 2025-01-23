import Groq from "groq-sdk";

// Initialize the Groq client with the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Main API route handler for chat completions
 */
export async function POST(req) {
  try {
    // Parse the incoming request JSON
    const { userInput, chatHistory } = await req.json();

    // Get the chat completion from Groq
    const chatCompletion = await getGroqChatCompletion(userInput, chatHistory);

    // Extract the assistant's response
    const assistantResponse = chatCompletion.choices[0]?.message?.content || "";

    // Return the response
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
        role: "user",
        content: userInput,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
