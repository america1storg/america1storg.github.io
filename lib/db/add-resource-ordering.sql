-- Add display_order column to resources table for custom ordering

ALTER TABLE resources ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial order based on creation date
UPDATE resources SET display_order = id WHERE display_order = 0;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_resources_display_order ON resources(display_order);
