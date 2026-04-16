export async function generatePersonalizedMessage(leadName: string, company: string, context?: string) {
  try {
    const response = await fetch('http://localhost:3000/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY || 'sk-mock-key'}`
      },
      body: JSON.stringify({
        model: "gemini-3-flash",
        messages: [{
          role: "system", 
          content: `Persona: Act as a Senior SDR with 10 years of experience in high-ticket B2B sales. Your goal is a 1-to-1 connection, not a pitch.
          Task: Generate a LinkedIn connection note (under 140 characters) for:
          Name: ${leadName}
          Company: ${company}
          Context: ${context || "N/A"}

          Rules (Strict):
          1. The "No-Bot" Rule: Do NOT start with "I came across your profile" or "I see you work at."
          2. The "Post-First" Hook: Start directly with a reaction to their Context. If it's missing, mention a recent trend in their industry.
          3. The Curiosity Gap: End with a "soft" curiosity question about their work, NOT a meeting request.
          4. Brevity: Maximum 140 characters. No emojis.
          5. Template Structure: "[Observation about their post/work] + [Internal thought/validating statement] + [Soft question]?"`
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error('AI request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Generation Error:', error);
    // Fallback message for demo purposes if proxy is not running
    return `Hi ${leadName.split(' ')[0]}, I've been following ${company} and I'm really impressed by your recent growth. I'd love to connect and learn more about your strategy!`;
  }
}
