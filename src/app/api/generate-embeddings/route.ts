import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'sk-mock-key',
  baseURL: "http://localhost:3000/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    // In a real scenario, we'd use gemini.embeddings.create
    // For this prototype, we'll return a mock vector if no key is present
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ embedding: Array(1536).fill(0).map(() => Math.random()) });
    }

    const response = await gemini.embeddings.create({
      model: "text-embedding-004",
      input: text,
    });

    return NextResponse.json({ embedding: response.data[0].embedding });
  } catch (error) {
    console.error('Embedding Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
  }
}
