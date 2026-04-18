ALTER TABLE leads ADD COLUMN IF NOT EXISTS temperature TEXT CHECK (temperature IN ('hot', 'warm', 'cold', 'unknown')) DEFAULT 'unknown';
