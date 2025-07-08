-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE experiment_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create experiments table
CREATE TABLE experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status experiment_status DEFAULT 'active',
  variables TEXT[] DEFAULT '{}',
  metrics TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_logs table
CREATE TABLE daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  sleep_hours DECIMAL(3,1) NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5) NOT NULL,
  energy INTEGER CHECK (energy >= 1 AND energy <= 5) NOT NULL,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  weight DECIMAL(5,2),
  notes TEXT,
  experiment_compliance JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create experiment_templates table
CREATE TABLE experiment_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty difficulty_level NOT NULL,
  category TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  metrics TEXT[] DEFAULT '{}',
  protocol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for experiments
CREATE POLICY "Users can view own experiments" ON experiments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiments" ON experiments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiments" ON experiments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiments" ON experiments
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_logs
CREATE POLICY "Users can view own daily logs" ON daily_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs" ON daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs" ON daily_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs" ON daily_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for experiment_templates (public read)
CREATE POLICY "Anyone can view experiment templates" ON experiment_templates
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_experiments_user_id ON experiments(user_id);
CREATE INDEX idx_experiments_status ON experiments(status);
CREATE INDEX idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(date);
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, date);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON experiments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiment_templates_updated_at BEFORE UPDATE ON experiment_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
