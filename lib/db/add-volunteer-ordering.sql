-- Add display_order column to volunteers table for custom ordering

ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial order based on creation date
UPDATE volunteers SET display_order = id WHERE display_order = 0;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_volunteers_display_order ON volunteers(display_order);
