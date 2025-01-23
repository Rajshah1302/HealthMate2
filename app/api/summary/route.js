import { getChatSummary } from "../../../lib/groqUtils2";

export async function GET() {
  try {
    const userId = "tes1t@example.com"; // Replace with dynamic userId
    const today = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

    const chatSummary = await getChatSummary(userId, today);

    return new Response(JSON.stringify(chatSummary), { status: 200 });
  } catch (error) {
    console.error("Error in generating summary:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
    });
  }
}