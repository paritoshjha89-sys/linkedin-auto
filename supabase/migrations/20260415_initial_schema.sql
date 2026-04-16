-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CAMPAIGNS: The high-level workflow containers
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Simplified for prototype, usually REFERENCES auth.users(id)
  name TEXT NOT NULL,
  nodes JSONB NOT NULL, -- Stores the React Flow graph structure
  edges JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. LEADS: The prospects you are targeting
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  linkedin_url TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  job_title TEXT,
  last_post_content TEXT, -- Feed this to Gemini for personalization
  status TEXT DEFAULT 'queued', -- queued, connecting, messaged, replied, blacklisted
  sentiment TEXT, -- Analyzed by Gemini: positive, neutral, negative
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MESSAGES: The history for the "Smart Inbox"
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  direction TEXT NOT NULL, -- 'inbound' or 'outbound'
  ai_analyzed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ANALYTICS: For your high-end dashboard
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id),
  date DATE DEFAULT CURRENT_DATE,
  sent_count INTEGER DEFAULT 0,
  accepted_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  UNIQUE(campaign_id, date)
);

-- RLS (Row Level Security) - Simplified for prototype development
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Creating open policies for the prototype
CREATE POLICY "Enable all for all" ON campaigns FOR ALL USING (true);
CREATE POLICY "Enable all for all" ON leads FOR ALL USING (true);
CREATE POLICY "Enable all for all" ON messages FOR ALL USING (true);
CREATE POLICY "Enable all for all" ON daily_stats FOR ALL USING (true);
