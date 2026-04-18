import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';

// We use the edge runtime for streaming
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'sk-mock-key',
  baseURL: "http://localhost:3000/openai/v1", // Using our Gemini-to-OpenAI gateway
});

export async function POST(req: Request) {
  try {
    const { prospectName, lastMessage } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gemini-3-flash",
      stream: true,
      messages: [{
        role: "system",
        content: `You are an expert sales assistant. Analyze the message from ${prospectName}: "${lastMessage}".
        
        Task 1: Classify the lead temperature based on their message:
        - HOT: Wants to meet, asks for pricing, or shows high intent.
        - WARM: Asks questions, showing interest but needs more info.
        - COLD: Not interested, says "not now", or gives a short/abrupt "thanks".
        
        Task 2: Generate 3 distinct reply options:
        1. "The Closer" (Suggest a meeting)
        2. "The Educator" (Answer questions/provide value)
        3. "The Friendly" (Casual acknowledgment)
        
        CRITICAL: Return ONLY JSON format. DO NOT use markdown blocks.
        Format: { "temp": "HOT" | "WARM" | "COLD", "options": [{ "type": "string", "text": "string" }] }`
      }]
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Reply Generation Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate replies' }), { status: 500 });
  }
}
