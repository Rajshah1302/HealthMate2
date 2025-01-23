import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * API route to generate a summary of the chat
 */
export async function POST(req) {
  try {
    const { chatHistory } = await req.json();
    const chatSummary = await getChatSummary(chatHistory);

    return new Response(
      JSON.stringify(chatSummary),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in generating summary:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500 }
    );
  }
}

/**
 * Function to generate a chat summary
 * @param {Array} chatHistory - Array of message history
 */
export async function getChatSummary(chatHistory) {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an analytical assistant. Your job is to analyze the entire chat conversation, focusing on the user's mood and mental health. Provide a short summary describing the user's emotional state and health. Assign a health score (1-100) based on their well-being.`,
      },
      {
        role: "user",
        content: `Here is the chat history: ${JSON.stringify(chatHistory)}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  // Extract the result
  const assistantResponse = response.choices[0]?.message?.content || "";

  // Parse health score and summary if structured output is expected
  let healthPoints = 50; // Default value
  let summary = assistantResponse;

  // Try extracting health score if mentioned in the response
  const healthScoreMatch = assistantResponse.match(/Health score:\s*(\d+)/i);
  if (healthScoreMatch) {
    healthPoints = parseInt(healthScoreMatch[1], 10);
    summary = assistantResponse.replace(/Health score:\s*\d+/i, "").trim();
  }

  return { summary, healthPoints };
}
