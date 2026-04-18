import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'sk-mock-key',
  baseURL: "http://localhost:3000/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gemini-3-flash",
      stream: true,
      messages: [
        {
          role: "system",
          content: `Persona: You are the OutreachFlow AI Guide, a world-class expert in LinkedIn B2B sales and automation.
          Your goal is to help users build high-converting campaigns. 
          Knowledge:
          - LinkedIn limits (50-100/day for safety).
          - Personalization is key (mention specific posts/roles).
          - Multi-channel is better than single channel.
          - Never pitch in the first message.
          
          Style: Professional, encouraging, and data-driven. Use short sentences and bullet points.`
        },
        { role: "user", content: prompt }
      ]
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to chat' }), { status: 500 });
  }
}
