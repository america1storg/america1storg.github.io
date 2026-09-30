-- Volunteers Table
-- Stores volunteer opportunity cards for /get-involved page

CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial volunteer opportunities
INSERT INTO volunteers (title, url, description, domain, category, image_url) VALUES
(
  'Join Advisory Boards',
  'https://www.jointab.us/find-your-seat',
  'There''s an empty government seat near you. Many positions are filled by appointment, not election. Find open seats in your area and learn how to apply. Takes minutes to start—just enter your ZIP code.',
  'jointab.us',
  'Civic Leadership',
  'PLACEHOLDER_IMAGE_URL'
),
(
  'JustServe',
  'https://www.justserve.org/',
  'Built to help people find local service projects near them, with a strong community-service focus. Connect with organizations in your area that need volunteers for hands-on projects.',
  'justserve.org',
  'Local Service',
  'PLACEHOLDER_IMAGE_URL'
),
(
  'Volunteers of America',
  'https://www.voa.org/volunteer/',
  'National nonprofit with local affiliate opportunities across the country. Help vulnerable communities through health services, housing support, and community outreach programs.',
  'voa.org',
  'National Nonprofit',
  'PLACEHOLDER_IMAGE_URL'
),
(
  'AmeriCorps',
  'https://www.americorps.gov/join/find-volunteer-opportunity#/',
  'Huge national database with 100,000+ volunteer opportunities, including virtual and onsite roles. Search by location and cause—from education and environment to disaster relief and veterans services.',
  'americorps.gov',
  'National Service',
  'PLACEHOLDER_IMAGE_URL'
),
(
  'Volunteer.gov',
  'https://www.volunteer.gov/s/',
  'Official federal volunteer portal with opportunities at national parks, forests, wildlife areas, and other federal sites. Serve your country while preserving America''s natural treasures.',
  'volunteer.gov',
  'Federal Programs',
  'PLACEHOLDER_IMAGE_URL'
);
