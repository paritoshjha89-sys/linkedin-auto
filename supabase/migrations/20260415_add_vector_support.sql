-- Enable pgvector support for AI search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add profile_embedding column to the leads table
ALTER TABLE leads 
ADD COLUMN profile_embedding vector(1536); -- Matches Gemini's embedding size
