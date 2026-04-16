import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'sk-mock-key',
  baseURL: "http://localhost:3000/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { prospectName, lastMessage } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        options: [
          { type: "The Closer", text: `Hi ${prospectName.split(' ')[0]}, thanks for the reply! Would you be open to a quick 15-minute chat next Tuesday to dive deeper into this?` },
          { type: "The Educator", text: `That's a great point, ${prospectName.split(' ')[0]}. We actually found that multi-channel outreach improves conversion by 24%. I'd be happy to send over our latest case study on this.` },
          { type: "The Friendly", text: `Appreciate the feedback, ${prospectName}! It's always great to connect with fellow leaders in this space. Looking forward to keeping in touch.` }
        ]
      });
    }

    const response = await gemini.chat.completions.create({
      model: "gemini-3-flash",
      messages: [{
        role: "system",
        content: `You are an expert sales assistant. Analyze the message from ${prospectName}: "${lastMessage}".
        Generate 3 distinct reply options:
        1. "The Closer" (Suggest a meeting)
        2. "The Educator" (Answer questions/provide value)
        3. "The Friendly" (Casual acknowledgment)
        Return ONLY JSON format: { "options": [{ "type": "string", "text": "string" }] }`
      }]
    });

    const content = response.choices[0].message.content || '{}';
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return NextResponse.json(JSON.parse(jsonString));
  } catch (error) {
    console.error('Reply Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate replies' }, { status: 500 });
  }
}
