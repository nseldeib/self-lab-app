// Types
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface Experiment {
  id: string
  userId: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "paused"
  category: string
  metrics: string[]
  notes?: string
  createdAt: string
}

export interface DailyLog {
  id: string
  userId: string
  experimentId: string
  date: string
  metrics: Record<string, any>
  notes?: string
  createdAt: string
}

export interface ExperimentTemplate {
  id: string
  name: string
  description: string
  category: string
  duration: number
  metrics: string[]
  instructions: string
}

// Storage keys
const USERS_KEY = "selflab_users"
const EXPERIMENTS_KEY = "selflab_experiments"
const DAILY_LOGS_KEY = "selflab_daily_logs"
const CURRENT_USER_KEY = "selflab_current_user"

// Default templates
const DEFAULT_TEMPLATES: ExperimentTemplate[] = [
  {
    id: "template_1",
    name: "Cold Shower Challenge",
    description: "Take cold showers for improved energy and resilience",
    category: "Physical",
    duration: 30,
    metrics: ["Duration (minutes)", "Water Temperature", "Energy Level (1-10)", "Mood (1-10)"],
    instructions: "Start with 30 seconds of cold water at the end of your regular shower. Gradually increase duration.",
  },
  {
    id: "template_2",
    name: "Intermittent Fasting",
    description: "Track your fasting windows and energy levels",
    category: "Nutrition",
    duration: 21,
    metrics: ["Fasting Hours", "Energy Level (1-10)", "Hunger Level (1-10)", "Weight"],
    instructions: "Start with a 16:8 fasting schedule. Fast for 16 hours, eat within 8 hours.",
  },
  {
    id: "template_3",
    name: "Daily Meditation",
    description: "Build a consistent meditation practice",
    category: "Mental",
    duration: 30,
    metrics: ["Duration (minutes)", "Focus Level (1-10)", "Stress Level (1-10)", "Technique Used"],
    instructions: "Start with 5-10 minutes daily. Use apps like Headspace or simply focus on breathing.",
  },
  {
    id: "template_4",
    name: "Sleep Optimization",
    description: "Track and improve your sleep quality",
    category: "Recovery",
    duration: 28,
    metrics: ["Bedtime", "Wake Time", "Sleep Quality (1-10)", "Dreams Recalled"],
    instructions: "Maintain consistent sleep schedule. Track factors affecting your sleep quality.",
  },
  {
    id: "template_5",
    name: "Exercise Tracking",
    description: "Monitor your daily physical activity",
    category: "Physical",
    duration: 30,
    metrics: ["Exercise Type", "Duration (minutes)", "Intensity (1-10)", "Calories Burned"],
    instructions: "Track all forms of exercise including walking, gym sessions, sports, etc.",
  },
  {
    id: "template_6",
    name: "Hydration Challenge",
    description: "Optimize your daily water intake",
    category: "Nutrition",
    duration: 21,
    metrics: ["Water Intake (liters)", "Urine Color", "Energy Level (1-10)", "Skin Quality (1-10)"],
    instructions: "Aim for 8-10 glasses of water daily. Track how hydration affects your energy and skin.",
  },
]

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save to storage:", error)
  }
}

// User management
export function registerUser(
  name: string,
  email: string,
  password: string,
): { success: boolean; message: string; user?: User } {
  const users = getFromStorage<User>(USERS_KEY)

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "User with this email already exists" }
  }

  const newUser: User = {
    id: generateId(),
    name,
    email,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveToStorage(USERS_KEY, users)

  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
  }

  return { success: true, message: "User registered successfully", user: newUser }
}

export function loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
  // Note: This is a simplified auth for demo purposes
  // In production, use proper authentication with Supabase Auth
  const users = getFromStorage<User>(USERS_KEY)
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, message: "Invalid email or password" }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }

  return { success: true, message: "Login successful", user }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const userData = localStorage.getItem(CURRENT_USER_KEY)
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

export function signOut(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function resetPassword(email: string): { success: boolean; message: string } {
  return { success: true, message: "Password reset instructions sent to your email" }
}

export function loginDemoAccount(): { success: boolean; message: string; user?: User } {
  const demoUser: User = {
    id: "demo_user",
    name: "Demo User",
    email: "demo@selflab.com",
    createdAt: new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser))
  }

  return { success: true, message: "Demo account logged in", user: demoUser }
}

// Experiment management
export function getExperiments(userId: string): Experiment[] {
  const experiments = getFromStorage<Experiment>(EXPERIMENTS_KEY)
  return experiments.filter((exp) => exp.userId === userId)
}

export function saveExperiment(experiment: Experiment): boolean {
  try {
    const experiments = getFromStorage<Experiment>(EXPERIMENTS_KEY)
    const existingIndex = experiments.findIndex((exp) => exp.id === experiment.id)

    if (existingIndex >= 0) {
      experiments[existingIndex] = experiment
    } else {
      experiments.push(experiment)
    }

    saveToStorage(EXPERIMENTS_KEY, experiments)
    return true
  } catch {
    return false
  }
}

export function deleteExperiment(id: string): boolean {
  try {
    const experiments = getFromStorage<Experiment>(EXPERIMENTS_KEY)
    const filteredExperiments = experiments.filter((exp) => exp.id !== id)
    saveToStorage(EXPERIMENTS_KEY, filteredExperiments)

    const dailyLogs = getFromStorage<DailyLog>(DAILY_LOGS_KEY)
    const filteredLogs = dailyLogs.filter((log) => log.experimentId !== id)
    saveToStorage(DAILY_LOGS_KEY, filteredLogs)

    return true
  } catch {
    return false
  }
}

// Daily log management
export function getDailyLogs(userId: string): DailyLog[] {
  const logs = getFromStorage<DailyLog>(DAILY_LOGS_KEY)
  return logs.filter((log) => log.userId === userId)
}

export function getExperimentLogs(experimentId: string): DailyLog[] {
  const logs = getFromStorage<DailyLog>(DAILY_LOGS_KEY)
  return logs.filter((log) => log.experimentId === experimentId)
}

export function saveDailyLog(log: DailyLog): boolean {
  try {
    const logs = getFromStorage<DailyLog>(DAILY_LOGS_KEY)
    const existingIndex = logs.findIndex((l) => l.id === log.id)

    if (existingIndex >= 0) {
      logs[existingIndex] = log
    } else {
      logs.push(log)
    }

    saveToStorage(DAILY_LOGS_KEY, logs)
    return true
  } catch {
    return false
  }
}

// Template management
export function getExperimentTemplates(): ExperimentTemplate[] {
  return DEFAULT_TEMPLATES
}
