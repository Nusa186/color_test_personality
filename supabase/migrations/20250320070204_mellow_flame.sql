/*
  # Create personality test tables

  1. New Tables
    - `warna_personality`
      - `id_personality` (text, primary key)
      - `warna` (text)
      - `nama_personality` (text)
      - `deskripsi` (text)

    - `keunggulan_personality`
      - `id` (serial, primary key)
      - `id_personality` (text, foreign key)
      - `keunggulan` (text)

    - `kelemahan_personality`
      - `id` (serial, primary key)
      - `id_personality` (text, foreign key)
      - `kelemahan` (text)

    - `pertanyaan_personality`
      - `id` (serial, primary key)
      - `pertanyaan` (text)

    - `pilihan_personality`
      - `id` (serial, primary key)
      - `id_pertanyaan` (int, foreign key)
      - `pilihan` (text)
      - `id_personality` (text, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create warna_personality table
CREATE TABLE IF NOT EXISTS warna_personality (
  id_personality text PRIMARY KEY,
  warna text NOT NULL,
  nama_personality text NOT NULL,
  deskripsi text,
  created_at timestamptz DEFAULT now()
);

-- Create keunggulan_personality table
CREATE TABLE IF NOT EXISTS keunggulan_personality (
  id serial PRIMARY KEY,
  id_personality text REFERENCES warna_personality(id_personality),
  keunggulan text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create kelemahan_personality table
CREATE TABLE IF NOT EXISTS kelemahan_personality (
  id serial PRIMARY KEY,
  id_personality text REFERENCES warna_personality(id_personality),
  kelemahan text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pertanyaan_personality table
CREATE TABLE IF NOT EXISTS pertanyaan_personality (
  id serial PRIMARY KEY,
  pertanyaan text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pilihan_personality table
CREATE TABLE IF NOT EXISTS pilihan_personality (
  id serial PRIMARY KEY,
  id_pertanyaan int REFERENCES pertanyaan_personality(id),
  pilihan text NOT NULL,
  id_personality text REFERENCES warna_personality(id_personality),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE warna_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE keunggulan_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelemahan_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE pertanyaan_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilihan_personality ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on warna_personality"
  ON warna_personality FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on keunggulan_personality"
  ON keunggulan_personality FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on kelemahan_personality"
  ON kelemahan_personality FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on pertanyaan_personality"
  ON pertanyaan_personality FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on pilihan_personality"
  ON pilihan_personality FOR SELECT TO public USING (true);

-- Insert sample data for warna_personality
INSERT INTO warna_personality (id_personality, warna, nama_personality, deskripsi) VALUES
  ('red', 'Merah', 'Dominan', 'Pribadi yang tegas dan berorientasi pada hasil'),
  ('blue', 'Biru', 'Analitis', 'Pribadi yang sistematis dan berorientasi pada detail'),
  ('green', 'Hijau', 'Stabil', 'Pribadi yang sabar dan berorientasi pada harmoni'),
  ('yellow', 'Kuning', 'Inspiratif', 'Pribadi yang kreatif dan berorientasi pada ide');