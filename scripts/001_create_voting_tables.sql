-- Create staff members table
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  division TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Public read access for staff members
DROP POLICY IF EXISTS "Allow public read access to staff_members" ON staff_members;
CREATE POLICY "Allow public read access to staff_members" ON staff_members
  FOR SELECT USING (true);

-- Allow all operations for staff members (used by admin API with service role)
DROP POLICY IF EXISTS "Allow service role to manage staff_members" ON staff_members;
CREATE POLICY "Allow service role to manage staff_members" ON staff_members
  FOR ALL USING (true) WITH CHECK (true);

-- Public insert access for votes
DROP POLICY IF EXISTS "Allow public insert votes" ON votes;
CREATE POLICY "Allow public insert votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Public read access for votes
DROP POLICY IF EXISTS "Allow public read access to votes" ON votes;
CREATE POLICY "Allow public read access to votes" ON votes
  FOR SELECT USING (true);

-- Allow delete on votes (for reset)
DROP POLICY IF EXISTS "Allow service role to delete votes" ON votes;
CREATE POLICY "Allow service role to delete votes" ON votes
  FOR DELETE USING (true);

-- Storage bucket for staff photos (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('staff-photos', 'staff-photos', true) ON CONFLICT (id) DO NOTHING;
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'staff-photos');
-- CREATE POLICY "Service role upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'staff-photos');
-- CREATE POLICY "Service role update" ON storage.objects FOR UPDATE USING (bucket_id = 'staff-photos');
-- CREATE POLICY "Service role delete" ON storage.objects FOR DELETE USING (bucket_id = 'staff-photos');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE staff_members;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
