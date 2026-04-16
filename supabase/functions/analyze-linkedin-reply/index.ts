import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json() // The new message row

    // Only analyze inbound messages
    if (record.direction !== 'inbound') {
      return new Response('Skipping outbound', { status: 200 })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Ask Gemini to analyze sentiment and suggest next step
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Prospect said: "${record.content}". 
            Categorize sentiment: POSITIVE (wants to meet), NEUTRAL (questions), NEGATIVE (no/stop).
            Provide 3 smart reply snippets. 
            Return ONLY JSON format: { "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE", "suggestions": ["string", "string", "string"] }`
          }]
        }]
      })
    })

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const aiData = await geminiResponse.json()
    const content = aiData.candidates[0].content.parts[0].text
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim()
    const analysis = JSON.parse(jsonString)

    // 2. Update the Lead with the new AI context
    const { error: leadError } = await supabase
      .from('leads')
      .update({ 
        sentiment: analysis.sentiment.toLowerCase(),
        status: analysis.sentiment === 'NEGATIVE' ? 'paused' : 'replied'
      })
      .eq('id', record.lead_id)

    if (leadError) throw leadError

    // 3. Store the AI suggestions for the Smart Inbox
    const { error: msgError } = await supabase
      .from('messages')
      .update({ 
        ai_suggestions: analysis.suggestions,
        ai_analyzed: true 
      })
      .eq('id', record.id)

    if (msgError) throw msgError

    return new Response(JSON.stringify({ success: true, sentiment: analysis.sentiment }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
