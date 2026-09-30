-- Add user preferences columns for dashboard customization

ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name_type VARCHAR(50) DEFAULT 'email'; -- 'email', 'name', 'custom'
ALTER TABLE users ADD COLUMN IF NOT EXISTS sidebar_order JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS quick_actions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Update existing users to have default preferences
UPDATE users SET
  display_name_type = 'email',
  sidebar_order = '["Dashboard", "Articles", "New Article", "Resources", "Volunteers", "Review Queue", "Manage Users", "Feature Flags"]'::jsonb,
  quick_actions = '["New Article", "View Articles", "Manage Users"]'::jsonb
WHERE display_name_type IS NULL;
