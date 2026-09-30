-- Resources table for managing civic resource cards
CREATE TABLE IF NOT EXISTS resources (
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

-- Create index for faster lookups
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_domain ON resources(domain);

-- Insert current resources
INSERT INTO resources (title, url, description, domain, category, image_url) VALUES
  ('White House Fact Sheets', 'https://www.whitehouse.gov/briefing-room/statements-releases/', 'Official White House fact sheets, policy statements, and press releases. Detailed information on administration initiatives, policies, and executive actions.', 'whitehouse.gov', 'Executive', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/whitehouse-factsheets.jpg'),
  ('Guides.vote', 'https://guides.vote/', 'Nonpartisan candidate guide with researched comparisons and credible sourcing. Side-by-side candidate comparisons with verified facts and citations.', 'guides.vote', 'Elections', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/guides-vote.jpg'),
  ('GovTrack', 'https://www.govtrack.us/congress/bills/', 'Good for federal bill tracking, voting records, and legislative history. Track Congress with clear visualizations and email alerts for bills you care about.', 'govtrack.us', 'Legislative', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/govtrack.jpg'),
  ('The White House', 'https://www.whitehouse.gov/', 'Official information from the presidency. Presidential statements, policy initiatives, executive actions, and administration updates.', 'whitehouse.gov', 'Executive', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/whitehouse.jpg'),
  ('Congress.gov', 'https://www.congress.gov/', 'Official federal bill site; best for bill status, sponsors, and legislative text. The authoritative source for all congressional legislation and records.', 'congress.gov', 'Legislative', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/congress.jpg'),
  ('Vote Smart', 'https://www.votesmart.org/', 'Best for candidates, voting records, issue positions, public comments, and factual profiles. Nonpartisan research on elected officials and candidates across America.', 'votesmart.org', 'Elections', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/votesmart.jpg'),
  ('National Constitution Center', 'https://constitutioncenter.org/', 'Learn about, debate, and celebrate the greatest vision of human freedom in history—the U.S. Constitution. Interactive exhibits, educational resources, and constitutional debates.', 'constitutioncenter.org', 'Education', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/constitutioncenter.jpg'),
  ('Senate Floor Activity', 'https://www.senate.gov/legislative/LIS/floor_activity/floor_activity.htm', 'Track real-time Senate legislative action. See what bills are being debated, voted on, and moving through the legislative process right now.', 'senate.gov', 'Legislative', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/senate.jpg'),
  ('Ballotpedia Legislation Trackers', 'https://ballotpedia.org/Legislation_Trackers', 'Comprehensive tracking of candidates, ballot measures, and legislation across all 50 states. See who is running, what offices are on the ballot, and topic-based bill trackers.', 'ballotpedia.org', 'Elections', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/ballotpedia.jpg'),
  ('America.gov', 'https://america.gov/', 'Official U.S. government portal providing comprehensive information about American government, society, and values. Access federal resources, services, and information across all branches of government.', 'america.gov', 'Government', 'https://zvlofasbk97vnlui.public.blob.vercel-storage.com/resources/america.jpg');
