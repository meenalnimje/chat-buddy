import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
});

const generationConfig = {
  temperature: 0.5,
  topP: 1,
  maxOutputTokens: 2048,
  responseMimeType: "text/plain",
};

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Create a new chat session
    const chatSession = model.startChat({
      generationConfig,
    });

    // Send the user message to the chat session
    const result = await chatSession.sendMessage(message);

    // Send the AI response back to the frontend
    return new Response(JSON.stringify({ response: result.response.text() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate AI response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
