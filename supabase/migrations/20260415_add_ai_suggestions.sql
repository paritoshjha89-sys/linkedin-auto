-- Add ai_suggestions column to messages table for Smart Inbox
ALTER TABLE messages 
ADD COLUMN ai_suggestions JSONB; -- Stores 3 AI-generated reply snippets
