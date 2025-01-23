import mongoose from "mongoose";
import { getChatSummary } from "../../../lib/groqUtils2";

const Conversation = mongoose.model("Conversation");

/**
 * API route to fetch or generate summaries for all days in the user's history
 */
export async function GET() {
  try {
    const userId = "tes1t@example.com"; // Replace with dynamic userId
    const conversation = await Conversation.findOne({ userId });

    if (!conversation || !conversation.History) {
      return new Response(
        JSON.stringify({ error: `No conversation history found for user ${userId}` }),
        { status: 404 }
      );
    }

    const summaries = [];
    let isUpdated = false; // Track if the database needs to be updated

    for (const entry of conversation.History) {
      // If a summary is missing, generate it
      if (!entry.summary) {
        const date = entry.date.toISOString().slice(0, 10);
        console.log(`Generating summary for date: ${date}`);

        try {
          const { summary, healthPoints } = await getChatSummary(userId, date);
          entry.summary = summary;
          entry.score = healthPoints;
          isUpdated = true; // Mark as updated
        } catch (error) {
          console.error(`Failed to generate summary for date: ${date}`, error);
          // Continue processing other entries even if one fails
          continue;
        }
      }

      // Push the entry to the summaries array
      summaries.push({
        date: entry.date,
        summary: entry.summary,
        score: entry.score,
      });
    }

    // Save updates to the database if any summaries were generated
    if (isUpdated) {
      await conversation.save();
    }

    return new Response(JSON.stringify({ summaries }), { status: 200 });
  } catch (error) {
    console.error("Error in fetching or generating summaries:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong while processing summaries." }),
      { status: 500 }
    );
  }
}
