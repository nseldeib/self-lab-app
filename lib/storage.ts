export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface Experiment {
  id: string
  userId: string
  title: string
  description: string
  duration: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "paused"
  metrics: string[]
  createdAt: string
  updatedAt: string
}

export interface DailyLog {
  id: string
  userId: string
  experimentId: string
  date: string
  mood: number
  energy: number
  sleep: number
  compliance: number
  notes?: string
  createdAt: string
}

export interface ExperimentTemplate {
  id: string
  title: string
  description: string
  duration: number
  metrics: string[]
  instructions: string
  category: string
}

// Default experiment templates
const defaultTemplates: ExperimentTemplate[] = [
  {
    id: "cold-shower",
    title: "Cold Shower Challenge",
    description: "Take cold showers for improved resilience and energy",
    duration: 21,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions: "End your daily shower with 30-60 seconds of cold water. Gradually increase duration.",
    category: "Recovery",
  },
  {
    id: "intermittent-fasting",
    title: "Intermittent Fasting 16:8",
    description: "16-hour fast with 8-hour eating window",
    duration: 28,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions: "Fast for 16 hours, eat within 8-hour window (e.g., 12pm-8pm).",
    category: "Nutrition",
  },
  {
    id: "morning-light",
    title: "Morning Light Exposure",
    description: "Get natural sunlight within first hour of waking",
    duration: 14,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions: "Spend 10-15 minutes outside or by a bright window within 1 hour of waking.",
    category: "Sleep",
  },
  {
    id: "meditation",
    title: "Daily Meditation",
    description: "Practice mindfulness meditation daily",
    duration: 21,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions: "Meditate for 10-20 minutes daily using breath awareness or guided meditation.",
    category: "Mental",
  },
  {
    id: "hiit-workout",
    title: "HIIT Training",
    description: "High-intensity interval training sessions",
    duration: 28,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions: "Perform 15-20 minute HIIT workouts 3-4 times per week.",
    category: "Fitness",
  },
  {
    id: "blue-light-blocking",
    title: "Blue Light Blocking",
    description: "Block blue light 2 hours before bed",
    duration: 14,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions: "Use blue light blocking glasses or apps 2 hours before bedtime.",
    category: "Sleep",
  },
]

// Storage keys
const USERS_KEY = "selflab_users"
const CURRENT_USER_KEY = "selflab_user"
const EXPERIMENTS_KEY = "selflab_experiments"
const DAILY_LOGS_KEY = "selflab_daily_logs"
const TEMPLATES_KEY = "selflab_templates"

// Initialize templates if not exists
function initializeTemplates() {
  if (typeof window === "undefined") return

  const existingTemplates = localStorage.getItem(TEMPLATES_KEY)
  if (!existingTemplates) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(defaultTemplates))
  }
}

// User management
export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export async function signUp(
  email: string,
  password: string,
  name?: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "User already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)
    setCurrentUser(newUser)

    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: "Failed to create account" }
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd verify the password here
    // For demo purposes, we'll accept any password with minimum length
    if (password.length < 6) {
      return { success: false, error: "Invalid password" }
    }

    setCurrentUser(user)
    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Failed to sign in" }
  }
}

export async function signOut(): Promise<void> {
  setCurrentUser(null)
}

export async function createDemoAccount(): Promise<{ success: boolean; user?: User }> {
  const demoEmail = "demo@selflab.com"
  const users = getUsers()

  // Check if demo user already exists
  let demoUser = users.find((u) => u.email === demoEmail)

  if (!demoUser) {
    // Create demo user
    demoUser = {
      id: "demo-user",
      email: demoEmail,
      name: "Demo User",
      createdAt: new Date().toISOString(),
    }

    users.push(demoUser)
    saveUsers(users)
  }

  setCurrentUser(demoUser)
  return { success: true, user: demoUser }
}

// Experiment management
export function getExperiments(userId: string): Experiment[] {
  if (typeof window === "undefined") return []

  const experiments = localStorage.getItem(EXPERIMENTS_KEY)
  const allExperiments: Experiment[] = experiments ? JSON.parse(experiments) : []
  return allExperiments.filter((exp) => exp.userId === userId)
}

export function saveExperiment(experiment: Experiment) {
  if (typeof window === "undefined") return

  const experiments = localStorage.getItem(EXPERIMENTS_KEY)
  const allExperiments: Experiment[] = experiments ? JSON.parse(experiments) : []

  const existingIndex = allExperiments.findIndex((exp) => exp.id === experiment.id)
  if (existingIndex >= 0) {
    allExperiments[existingIndex] = experiment
  } else {
    allExperiments.push(experiment)
  }

  localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(allExperiments))
}

export function deleteExperiment(experimentId: string) {
  if (typeof window === "undefined") return

  const experiments = localStorage.getItem(EXPERIMENTS_KEY)
  const allExperiments: Experiment[] = experiments ? JSON.parse(experiments) : []
  const filteredExperiments = allExperiments.filter((exp) => exp.id !== experimentId)

  localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(filteredExperiments))
}

// Daily log management
export function getDailyLogs(userId: string, experimentId?: string): DailyLog[] {
  if (typeof window === "undefined") return []

  const logs = localStorage.getItem(DAILY_LOGS_KEY)
  const allLogs: DailyLog[] = logs ? JSON.parse(logs) : []

  let userLogs = allLogs.filter((log) => log.userId === userId)
  if (experimentId) {
    userLogs = userLogs.filter((log) => log.experimentId === experimentId)
  }

  return userLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function saveDailyLog(log: DailyLog) {
  if (typeof window === "undefined") return

  const logs = localStorage.getItem(DAILY_LOGS_KEY)
  const allLogs: DailyLog[] = logs ? JSON.parse(logs) : []

  const existingIndex = allLogs.findIndex((l) => l.id === log.id)
  if (existingIndex >= 0) {
    allLogs[existingIndex] = log
  } else {
    allLogs.push(log)
  }

  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(allLogs))
}

// Template management
export function getExperimentTemplates(): ExperimentTemplate[] {
  if (typeof window === "undefined") return defaultTemplates

  initializeTemplates()
  const templates = localStorage.getItem(TEMPLATES_KEY)
  return templates ? JSON.parse(templates) : defaultTemplates
}

// Initialize templates on module load
if (typeof window !== "undefined") {
  initializeTemplates()
}
