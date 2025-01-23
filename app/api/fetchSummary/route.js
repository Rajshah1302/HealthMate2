import mongoose from "mongoose";
import { GET as getChatSummary } from "../summary/route";

const Conversation = mongoose.model("Conversation");

/**
 * API route to fetch or generate summaries for all days in the user's history
 */
export async function GET() {
  try {
    const userId = "tes1t@example.com"; // Replace with dynamic userId
    const conversation = await Conversation.findOne({ userId });

    if (!conversation || !conversation.History) {
      throw new Error(`No conversation history found for user ${userId}`);
    }

    const summaries = [];

    // Iterate through each day's history
    for (const entry of conversation.History) {
      if (!entry.summary) {
        // If summary is missing, generate it using `getChatSummary`
        const date = entry.date.toISOString().slice(0, 10);
        console.log(`Generating summary for date: ${date}`);
        const { summary, healthPoints } = await getChatSummary(userId, date);

        // Update entry with generated summary
        entry.summary = summary;
        entry.score = healthPoints;
      }

      summaries.push({
        date: entry.date,
        summary: entry.summary,
        score: entry.score,
      });
    }

    // Save the updated conversation back to the database
    await conversation.save();

    return new Response(
      JSON.stringify({ summaries }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching or generating summaries:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500 }
    );
  }
}
