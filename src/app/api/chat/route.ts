import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
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
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to chat' }), { status: 500 });
  }
}
