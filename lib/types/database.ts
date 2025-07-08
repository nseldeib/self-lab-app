export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      experiments: {
        Row: {
          id: string
          user_id: string
          name: string
          hypothesis: string
          start_date: string
          end_date: string
          status: "active" | "completed" | "paused"
          variables: string[]
          metrics: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          hypothesis: string
          start_date: string
          end_date: string
          status?: "active" | "completed" | "paused"
          variables: string[]
          metrics: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          hypothesis?: string
          start_date?: string
          end_date?: string
          status?: "active" | "completed" | "paused"
          variables?: string[]
          metrics?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          sleep_hours: number
          mood: number
          energy: number
          stress_level: number | null
          weight: number | null
          notes: string | null
          experiment_compliance: Record<string, boolean>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          sleep_hours: number
          mood: number
          energy: number
          stress_level?: number | null
          weight?: number | null
          notes?: string | null
          experiment_compliance?: Record<string, boolean>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          sleep_hours?: number
          mood?: number
          energy?: number
          stress_level?: number | null
          weight?: number | null
          notes?: string | null
          experiment_compliance?: Record<string, boolean>
          created_at?: string
          updated_at?: string
        }
      }
      experiment_templates: {
        Row: {
          id: string
          name: string
          description: string
          hypothesis: string
          duration_days: number
          difficulty: "beginner" | "intermediate" | "advanced"
          category: string
          variables: string[]
          metrics: string[]
          protocol: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          hypothesis: string
          duration_days: number
          difficulty: "beginner" | "intermediate" | "advanced"
          category: string
          variables: string[]
          metrics: string[]
          protocol: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          hypothesis?: string
          duration_days?: number
          difficulty?: "beginner" | "intermediate" | "advanced"
          category?: string
          variables?: string[]
          metrics?: string[]
          protocol?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experiment_status: "active" | "completed" | "paused"
      difficulty_level: "beginner" | "intermediate" | "advanced"
    }
  }
}
