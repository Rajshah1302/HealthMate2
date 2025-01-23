import connect from "../../../lib/db";
import { getGroqChatCompletion } from "../../../lib/groqUtils";
import Conversation from "../__models/conversation";

export async function POST(req) {
  try {
    console.log("API called: Starting POST request...");

    // Step 1: Connect to the database
    console.log("Connecting to the database...");
    await connect();
    console.log("Database connected successfully.");

    // Step 2: Mock user setup
    const mockUser = {
      email: "tes1t@example.com",
      name: "Test U1ser",
      image: "https://example.com/avatar.jpg",
    };

    // Step 3: Parse request data
    console.log("Parsing request body...");
    const { userInput, chatHistory } = await req.json();
    console.log("Request body parsed:", { userInput, chatHistory });

    // Step 4: Generate chat completion
    console.log("Generating chat completion...");
    const chatCompletion = await getGroqChatCompletion(userInput, chatHistory);
    const assistantResponse =
      chatCompletion.choices[0]?.message?.content || "";
    console.log("Chat completion generated:", { assistantResponse });

    // Step 5: Construct chat log
    const chat = `\n user:${userInput} \n assistant: ${assistantResponse}`;
    console.log("Chat constructed:", chat);

    // Step 6: Fetch or create conversation
    console.log("Fetching conversation for user:", mockUser.email);
    let conversation = await Conversation.findOne({ userId: mockUser.email });

    if (!conversation) {
      console.log("No conversation found. Creating a new one...");
      conversation = new Conversation({
        userId: mockUser.email,
        History: [],
      });
    } else {
      console.log("Existing conversation found:", conversation);
    }

    if (!conversation.History) {
      console.log("Initializing conversation history...");
      conversation.History = [];
    }

    // Step 7: Check for today's history
    const today = new Date().toISOString().slice(0, 10);
    console.log("Checking for today's history...");
    let existingHistory = conversation.History.find(
      (history) => history.date.toISOString().slice(0, 10) === today
    );

    if (existingHistory) {
      console.log("Existing history found. Appending chat...");
      existingHistory.chatHistory += ` ${chat}`;
      existingHistory.summary = "";
    } else {
      console.log("No history for today. Creating new entry...");
      conversation.History.push({
        date: new Date(),
        chatHistory: chat,
        summary: "",
        mood: "",
      });
    }

    // Step 8: Save conversation
    console.log("Saving conversation...");
    await conversation.save();
    console.log("Conversation saved successfully.");

    // Step 9: Return response
    console.log("Returning assistant response...");
    return new Response(JSON.stringify({ assistantResponse }), { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);

    // Log stack trace for better debugging
    console.error("Error stack trace:", error.stack);

    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}
