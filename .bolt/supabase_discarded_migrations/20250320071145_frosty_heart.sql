/*
  # Update pilihan_personality table structure

  1. Changes
    - Add columns to pilihan_personality:
      - `teks_pilihan` (text) - Text for multiple choice options
      - `nilai_pilihan` (text) - Mapping value (A, B, C, or D)

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to pilihan_personality
ALTER TABLE pilihan_personality 
ADD COLUMN IF NOT EXISTS teks_pilihan text,
ADD COLUMN IF NOT EXISTS nilai_pilihan text;