-- Insert default experiment templates
INSERT INTO experiment_templates (name, description, hypothesis, duration_days, difficulty, category, variables, metrics, protocol) VALUES
(
  'Cold Shower Challenge',
  'Take cold showers daily to improve energy and mood',
  'Cold exposure will increase energy levels and improve mood through hormetic stress response',
  30,
  'beginner',
  'Recovery',
  ARRAY['water_temperature', 'shower_duration'],
  ARRAY['energy', 'mood', 'sleep_quality'],
  'Take a cold shower (15-18°C) for 2-3 minutes every morning after your regular shower. Start with 30 seconds and gradually increase duration.'
),
(
  'No Caffeine After 2PM',
  'Eliminate caffeine consumption after 2PM to improve sleep quality',
  'Avoiding late caffeine will improve sleep onset and quality',
  21,
  'beginner',
  'Sleep',
  ARRAY['caffeine_timing', 'caffeine_amount'],
  ARRAY['sleep_quality', 'sleep_onset_time', 'morning_energy'],
  'Stop consuming all caffeinated beverages (coffee, tea, energy drinks) after 2:00 PM. Track your last caffeine intake time daily.'
),
(
  '16:8 Intermittent Fasting',
  'Practice 16:8 intermittent fasting to improve metabolic health',
  'Time-restricted eating will improve energy, focus, and metabolic markers',
  28,
  'intermediate',
  'Nutrition',
  ARRAY['fasting_window', 'eating_window'],
  ARRAY['energy', 'focus', 'hunger_levels', 'weight'],
  'Fast for 16 hours and eat within an 8-hour window. Example: eat between 12 PM - 8 PM, fast from 8 PM - 12 PM next day.'
),
(
  'Daily Meditation',
  'Practice 10 minutes of daily meditation to reduce stress and improve focus',
  'Regular meditation will decrease stress levels and improve cognitive performance',
  21,
  'beginner',
  'Mental',
  ARRAY['meditation_duration', 'meditation_type'],
  ARRAY['stress_level', 'focus', 'mood', 'sleep_quality'],
  'Meditate for 10 minutes daily using a guided app or technique of choice. Track the type of meditation and any insights.'
),
(
  '10,000 Steps Daily',
  'Walk at least 10,000 steps every day to improve cardiovascular health',
  'Consistent daily walking will improve energy, mood, and cardiovascular markers',
  30,
  'beginner',
  'Movement',
  ARRAY['step_count', 'walking_duration'],
  ARRAY['energy', 'mood', 'sleep_quality'],
  'Achieve at least 10,000 steps daily through walking. Use a step counter or smartphone app to track. Can be broken into multiple walks throughout the day.'
);
