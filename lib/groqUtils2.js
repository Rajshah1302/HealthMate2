import Groq from "groq-sdk";
import Conversation from "@/app/api/__models/conversation";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Function to generate a chat summary for a specific date
 * @param {String} userId - User ID
 * @param {String} date - Date in YYYY-MM-DD format
 */
export async function getChatSummary(userId, date) {
  // Fetch conversation
  const conversation = await Conversation.findOne({ userId });

  if (!conversation || !conversation.History) {
    throw new Error(`No conversation found for user ${userId}`);
  }

  // Find chat history for the specific date
  const chatEntry = conversation.History.find(
    (entry) => entry.date.toISOString().slice(0, 10) === date
  );

  if (!chatEntry) {
    throw new Error(`No chat history found for date ${date}`);
  }

  // Generate summary using Groq API
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an analytical assistant. Your job is to analyze the entire chat conversation, focusing on the user's mood and mental health. Provide a short summary describing the user's emotional state and health. Assign a health score (1-100) based on their well-being. Just give a short description.`,
      },
      {
        role: "user",
        content: `Here is the chat history: ${chatEntry.chatHistory}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  // Extract summary and health points
  const assistantResponse = response.choices[0]?.message?.content || "";
  let healthPoints = 50; // Default value
  let summary = assistantResponse;

  // Extract health score if present
  const healthScoreMatch = assistantResponse.match(/Health score:\s*(\d+)/i);
  if (healthScoreMatch) {
    healthPoints = parseInt(healthScoreMatch[1], 10);
    summary = assistantResponse.replace(/Health score:\s*\d+/i, "").trim();
  }

  // Update the chat entry in the database
  chatEntry.summary = summary;
  chatEntry.score = healthPoints;

  await conversation.save(); // Save the updated conversation

  return { summary, healthPoints };
}