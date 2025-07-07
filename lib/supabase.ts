import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create client only if configured
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

// For client components
export const createClientSupabase = () => {
  if (!isSupabaseConfigured) {
    return null
  }
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Experiment {
  id: string
  user_id: string
  name: string
  hypothesis: string
  start_date: string
  end_date: string
  status: "active" | "completed" | "paused"
  variables: string[]
  metrics: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface DailyLog {
  id: string
  user_id: string
  date: string
  sleep_hours: number
  mood: number
  energy: number
  notes?: string
  experiment_compliance: Record<string, boolean>
  created_at: string
  updated_at: string
}
