/*
  # Add nilai_pilihan table and update pilihan_personality

  1. New Tables
    - `nilai_pilihan`
      - `id` (serial, primary key)
      - `id_pilihan` (int, foreign key)
      - `nilai` (int)
      - `teks_pilihan` (text)

  2. Security
    - Enable RLS on new table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS nilai_pilihan (
  id serial PRIMARY KEY,
  id_pilihan int REFERENCES pilihan_personality(id),
  nilai int NOT NULL,
  teks_pilihan text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nilai_pilihan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on nilai_pilihan"
  ON nilai_pilihan FOR SELECT TO public USING (true);