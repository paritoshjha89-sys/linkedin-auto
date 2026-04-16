-- Ensure RLS is enabled
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see campaigns they created
-- First, drop the broad prototype policy if it exists
DROP POLICY IF EXISTS "Enable all for all" ON campaigns;

CREATE POLICY "Users can manage their own campaigns" 
ON campaigns FOR ALL 
USING (auth.uid() = user_id);

-- Policy: Users can only see leads in their campaigns
-- First, drop the broad prototype policy if it exists
DROP POLICY IF EXISTS "Enable all for all" ON leads;

CREATE POLICY "Users can manage leads in their campaigns" 
ON leads FOR ALL 
USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);
