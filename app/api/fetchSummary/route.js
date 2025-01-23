import { getChatSummary } from "../../../lib/groqUtils2";
import Conversation from "../__models/conversation";

/**
 * API route to fetch or generate summaries for all days in the user's history
 */
export async function GET() {
  try {
    console.log("API called: Starting GET request for chat summaries...");

    // Static userId for testing; replace with dynamic fetching as needed
    const userId = "tes1t@example.com";
    console.log("Fetching conversation for user:", userId);

    // Fetch the conversation for the user
    const conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      console.error(`No conversation found for user: ${userId}`);
      return new Response(
        JSON.stringify({
          error: `No conversation history found for user ${userId}`,
        }),
        { status: 404 }
      );
    }

    if (!conversation.History) {
      console.error(`No history found in conversation for user: ${userId}`);
      return new Response(
        JSON.stringify({
          error: `No conversation history found for user ${userId}`,
        }),
        { status: 404 }
      );
    }

    console.log("Conversation history found:", conversation.History);

    const summaries = [];
    let isUpdated = false; // Track if any updates are made to the database

    for (const entry of conversation.History) {
      // Log processing of each entry
      console.log("Processing entry:", entry);

      // If a summary is missing, generate it
      if (!entry.summary) {
        const date = entry.date.toISOString().slice(0, 10);
        console.log(`Generating summary for date: ${date}`);

        try {
          // Call getChatSummary to fetch summary and health points
          const { summary, healthPoints } = await getChatSummary(userId, date);

          // Update the entry
          entry.summary = summary;
          entry.score = healthPoints;
          isUpdated = true; // Mark as updated

          console.log(
            `Summary generated for date: ${date}`,
            { summary, healthPoints }
          );
        } catch (error) {
          console.error(
            `Failed to generate summary for date: ${date}`,
            error.message
          );

          // Log the error stack for more details
          console.error("Error stack trace:", error.stack);

          // Continue to process other entries
          continue;
        }
      }

      // Push the processed entry to the summaries array
      summaries.push({
        date: entry.date,
        summary: entry.summary,
        score: entry.score,
      });
    }

    // Save updates to the database if any summaries were generated
    if (isUpdated) {
      console.log("Saving updated conversation...");
      await conversation.save();
      console.log("Conversation updated successfully.");
    }

    console.log("Returning summaries:", summaries);
    return new Response(JSON.stringify({ summaries }), { status: 200 });
  } catch (error) {
    console.error("Error in fetching or generating summaries:", error.message);
    console.error("Error stack trace:", error.stack);

    return new Response(
      JSON.stringify({
        error: "Something went wrong while processing summaries.",
      }),
      { status: 500 }
    );
  }
}
