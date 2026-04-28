-- Tabel untuk menyimpan setting voting (termasuk waktu reset terakhir)
CREATE TABLE IF NOT EXISTS vote_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vote_settings ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "read settings" ON vote_settings FOR SELECT USING (true);

-- Allow all operations (for admin reset)
CREATE POLICY "manage settings" ON vote_settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default reset time (epoch = semua sudah bisa vote)
INSERT INTO vote_settings (key, value) 
VALUES ('last_reset', '2000-01-01T00:00:00.000Z')
ON CONFLICT (key) DO NOTHING;
