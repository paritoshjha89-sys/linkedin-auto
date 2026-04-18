import { supabase } from './supabase';

export const LINKEDIN_LIMITS = {
  MAX_MESSAGES_PER_DAY: 50,
  MIN_DELAY_MS: 30000, // 30 seconds
  MAX_DELAY_MS: 120000, // 2 minutes
};

export async function queueReply(leadId: string, content: string) {
  // 1. Check if we've hit the daily limit for this user/campaign
  const today = new Date().toISOString().split('T')[0];
  
  const { count, error: countError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('direction', 'outbound')
    .gte('created_at', today);

  if (count !== null && count >= LINKEDIN_LIMITS.MAX_MESSAGES_PER_DAY) {
    throw new Error('Daily LinkedIn message limit reached. Safety first!');
  }

  // 2. Add to a "pending_actions" table (you'd need to create this or use status)
  // For this prototype, we'll update the lead status to 'reply_queued'
  const { error: leadError } = await supabase
    .from('leads')
    .update({ 
      status: 'reply_queued',
      // We'd ideally store the planned content in a 'pending_replies' table
    })
    .eq('id', leadId);

  if (leadError) throw leadError;

  return { success: true, message: "Reply queued with safety delays." };
}

export function getRandomDelay() {
  const { MIN_DELAY_MS, MAX_DELAY_MS } = LINKEDIN_LIMITS;
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}
