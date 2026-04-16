import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Mock Supabase to keep prototype functional
const supabase = {
  from: (table: string) => ({
    update: (data: any) => ({
      eq: (col: string, val: any) => {
        console.log(`[MOCK SUPABASE] Updating ${table}: set ${JSON.stringify(data)} where ${col} = ${val}`);
        return Promise.resolve({ error: null });
      }
    })
  })
};

const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'sk-mock-key',
  baseURL: "http://localhost:3000/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { lastMessage, prospectContext } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Logic: If sentiment is negative, automatically tag as 'Do Not Contact' in Supabase
      const mockSentiment = lastMessage.toLowerCase().includes('stop') || lastMessage.toLowerCase().includes('not interested') ? 'negative' : 'positive';
      
      if (mockSentiment === 'negative') {
        await supabase.from('leads').update({ status: 'blacklisted' }).eq('id', prospectContext.id);
      }
      return NextResponse.json({ branch: mockSentiment });
    }

    const aiResponse = await gemini.chat.completions.create({
      model: "gemini-3-flash",
      messages: [{
        role: "system",
        content: `You are an SDR Lead. Categorize this LinkedIn reply: "${lastMessage}".
        Return ONLY JSON: { "sentiment": "positive" | "neutral" | "negative", "reason": "string", "next_action": "book_meeting" | "answer_query" | "stop" }`
      }]
    });

    const content = aiResponse.choices[0].message.content || '{}';
    // Handle potential markdown formatting in response
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const { sentiment } = JSON.parse(jsonString);

    if (sentiment === 'negative') {
      await supabase.from('leads').update({ status: 'blacklisted' }).eq('id', prospectContext.id);
    }

    return NextResponse.json({ branch: sentiment });
  } catch (error) {
    console.error('Sentiment AI Analysis Error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
