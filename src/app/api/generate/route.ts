import { NextResponse } from 'next/server';
import { generatePersonalizedMessage } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { prospectData } = await req.json();
    const resultText = await generatePersonalizedMessage(prospectData.name, prospectData.company);
    return NextResponse.json({ text: resultText });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate icebreaker' }, { status: 500 });
  }
}
