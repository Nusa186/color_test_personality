/*
  # Create questions table for mining personality test

  1. New Tables
    - `questions`
      - `id` (int, primary key)
      - `question` (text)
      - `options` (jsonb)
      - `personality_mapping` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `questions` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS questions (
  id serial PRIMARY KEY,
  question text NOT NULL,
  options jsonb NOT NULL,
  personality_mapping jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON questions
  FOR SELECT
  TO public
  USING (true);

-- Insert sample questions
INSERT INTO questions (question, options, personality_mapping) VALUES
  (
    'How do you approach a new mining site?',
    '{"A": "Dive right in with full force", "B": "Carefully analyze the terrain", "C": "Consult with the local community", "D": "Look for innovative extraction methods"}',
    '{"A": "red", "B": "blue", "C": "green", "D": "yellow"}'
  ),
  (
    'What''s your preferred mining tool?',
    '{"A": "Power drill - maximum impact", "B": "Precision laser cutter", "C": "Eco-friendly excavator", "D": "Experimental smart equipment"}',
    '{"A": "red", "B": "blue", "C": "green", "D": "yellow"}'
  ),
  (
    'How do you handle mining safety protocols?',
    '{"A": "Focus on speed and efficiency", "B": "Follow every rule meticulously", "C": "Prioritize team wellbeing", "D": "Develop new safety measures"}',
    '{"A": "red", "B": "blue", "C": "green", "D": "yellow"}'
  )
  -- Add more questions to reach 20 total
;