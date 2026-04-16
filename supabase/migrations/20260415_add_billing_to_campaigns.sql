-- Add billing and subscription management to campaigns
ALTER TABLE campaigns 
ADD COLUMN plan_type TEXT DEFAULT 'free', -- 'free', 'pro', 'agency'
ADD COLUMN subscription_active BOOLEAN DEFAULT false,
ADD COLUMN paddle_customer_id TEXT; -- Mapping to our Paddle.js integration
