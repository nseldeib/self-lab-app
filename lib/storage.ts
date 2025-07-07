// Types
export interface User {
  id: string
  email: string
  name?: string
  password: string
  createdAt: string
}

export interface Experiment {
  id: string
  userId: string
  name: string
  description: string
  duration: number
  startDate: string
  endDate?: string
  status: "active" | "completed" | "paused"
  metrics: string[]
  notes?: string
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
  name: string
  description: string
  duration: number
  metrics: string[]
  instructions: string
  category: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "selflab_users",
  CURRENT_USER: "selflab_current_user",
  EXPERIMENTS: "selflab_experiments",
  DAILY_LOGS: "selflab_daily_logs",
  TEMPLATES: "selflab_templates",
}

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getStorageData<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function setStorageData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

// Initialize default templates
function initializeTemplates(): void {
  const existingTemplates = getStorageData<ExperimentTemplate>(STORAGE_KEYS.TEMPLATES)
  if (existingTemplates.length === 0) {
    const defaultTemplates: ExperimentTemplate[] = [
      {
        id: "template-1",
        name: "Cold Shower Challenge",
        description: "Take cold showers daily to improve resilience and energy",
        duration: 21,
        metrics: ["mood", "energy", "sleep", "compliance"],
        instructions:
          "Take a cold shower for 2-3 minutes every morning. Start with lukewarm water and gradually decrease temperature.",
        category: "Physical",
      },
      {
        id: "template-2",
        name: "Intermittent Fasting 16:8",
        description: "Fast for 16 hours, eat within 8-hour window",
        duration: 28,
        metrics: ["mood", "energy", "sleep", "compliance"],
        instructions:
          "Fast for 16 hours daily, typically from 8 PM to 12 PM next day. Drink water, tea, or black coffee during fasting.",
        category: "Nutrition",
      },
      {
        id: "template-3",
        name: "Morning Light Exposure",
        description: "Get natural sunlight within first hour of waking",
        duration: 14,
        metrics: ["mood", "energy", "sleep", "compliance"],
        instructions: "Spend 10-15 minutes outside or by a bright window within 1 hour of waking up.",
        category: "Circadian",
      },
      {
        id: "template-4",
        name: "Meditation Practice",
        description: "Daily mindfulness meditation for mental clarity",
        duration: 21,
        metrics: ["mood", "energy", "sleep", "compliance"],
        instructions: "Meditate for 10-20 minutes daily using breathing techniques or guided meditation.",
        category: "Mental",
      },
      {
        id: "template-5",
        name: "High-Intensity Interval Training",
        description: "Short bursts of intense exercise for fitness",
        duration: 28,
        metrics: ["mood", "energy", "sleep", "compliance"],
        instructions: "Perform 15-20 minutes of HIIT exercises 3-4 times per week with rest days.",
        category: "Physical",
      },
      {
        id: "template-6",
        name: "Blue Light Blocking",
        description: "Reduce blue light exposure 2 hours before bed",
        duration: 14,
        metrics: ["mood", "energy", "sleep", "compliance"],
        instructions: "Use blue light blocking glasses or apps 2 hours before bedtime. Avoid screens when possible.",
        category: "Circadian",
      },
    ]
    setStorageData(STORAGE_KEYS.TEMPLATES, defaultTemplates)
  }
}

// User management
export function registerUser(
  email: string,
  password: string,
  name?: string,
): { success: boolean; message: string; user?: User } {
  const users = getStorageData<User>(STORAGE_KEYS.USERS)

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "User already exists" }
  }

  const user: User = {
    id: generateId(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  setStorageData(STORAGE_KEYS.USERS, users)

  return { success: true, message: "User registered successfully", user }
}

export function loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getStorageData<User>(STORAGE_KEYS.USERS)
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, message: "Invalid email or password" }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  }

  return { success: true, message: "Login successful", user }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function signOut(): void {
  logoutUser()
}

export function resetPassword(email: string): { success: boolean; message: string } {
  const users = getStorageData<User>(STORAGE_KEYS.USERS)
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, message: "User not found" }
  }

  return { success: true, message: "Password reset instructions sent to your email" }
}

// Demo account setup
export function setupDemoAccount(): { success: boolean; message: string; user?: User } {
  const demoEmail = "demo@selflab.com"
  const demoPassword = "password123"

  const users = getStorageData<User>(STORAGE_KEYS.USERS)
  let demoUser = users.find((u) => u.email === demoEmail)

  if (!demoUser) {
    const result = registerUser(demoEmail, demoPassword, "Demo User")
    if (!result.success) {
      return result
    }
    demoUser = result.user!
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(demoUser))
  }

  return { success: true, message: "Demo account ready", user: demoUser }
}

// Experiment management
export function getUserExperiments(userId: string): Experiment[] {
  const experiments = getStorageData<Experiment>(STORAGE_KEYS.EXPERIMENTS)
  return experiments.filter((exp) => exp.userId === userId)
}

export function saveExperiment(experiment: Omit<Experiment, "id" | "createdAt" | "updatedAt">): Experiment {
  const experiments = getStorageData<Experiment>(STORAGE_KEYS.EXPERIMENTS)

  const newExperiment: Experiment = {
    ...experiment,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  experiments.push(newExperiment)
  setStorageData(STORAGE_KEYS.EXPERIMENTS, experiments)

  return newExperiment
}

export function updateExperiment(id: string, updates: Partial<Experiment>): Experiment | null {
  const experiments = getStorageData<Experiment>(STORAGE_KEYS.EXPERIMENTS)
  const index = experiments.findIndex((exp) => exp.id === id)

  if (index === -1) return null

  experiments[index] = {
    ...experiments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  setStorageData(STORAGE_KEYS.EXPERIMENTS, experiments)
  return experiments[index]
}

export function deleteExperiment(id: string): boolean {
  const experiments = getStorageData<Experiment>(STORAGE_KEYS.EXPERIMENTS)
  const filteredExperiments = experiments.filter((exp) => exp.id !== id)

  if (filteredExperiments.length === experiments.length) return false

  setStorageData(STORAGE_KEYS.EXPERIMENTS, filteredExperiments)

  // Also delete related daily logs
  const logs = getStorageData<DailyLog>(STORAGE_KEYS.DAILY_LOGS)
  const filteredLogs = logs.filter((log) => log.experimentId !== id)
  setStorageData(STORAGE_KEYS.DAILY_LOGS, filteredLogs)

  return true
}

// Daily log management
export function getUserDailyLogs(userId: string): DailyLog[] {
  const logs = getStorageData<DailyLog>(STORAGE_KEYS.DAILY_LOGS)
  return logs.filter((log) => log.userId === userId)
}

export function saveDailyLog(log: Omit<DailyLog, "id" | "createdAt">): DailyLog {
  const logs = getStorageData<DailyLog>(STORAGE_KEYS.DAILY_LOGS)

  // Check if log already exists for this date and experiment
  const existingLogIndex = logs.findIndex(
    (l) => l.userId === log.userId && l.experimentId === log.experimentId && l.date === log.date,
  )

  const newLog: DailyLog = {
    ...log,
    id: existingLogIndex >= 0 ? logs[existingLogIndex].id : generateId(),
    createdAt: existingLogIndex >= 0 ? logs[existingLogIndex].createdAt : new Date().toISOString(),
  }

  if (existingLogIndex >= 0) {
    logs[existingLogIndex] = newLog
  } else {
    logs.push(newLog)
  }

  setStorageData(STORAGE_KEYS.DAILY_LOGS, logs)
  return newLog
}

export function getDailyLog(userId: string, experimentId: string, date: string): DailyLog | null {
  const logs = getStorageData<DailyLog>(STORAGE_KEYS.DAILY_LOGS)
  return logs.find((log) => log.userId === userId && log.experimentId === experimentId && log.date === date) || null
}

// Template management
export function getExperimentTemplates(): ExperimentTemplate[] {
  initializeTemplates()
  return getStorageData<ExperimentTemplate>(STORAGE_KEYS.TEMPLATES)
}

export function getTemplate(id: string): ExperimentTemplate | null {
  const templates = getExperimentTemplates()
  return templates.find((template) => template.id === id) || null
}

// Statistics
export function getUserStats(userId: string): {
  totalExperiments: number
  activeExperiments: number
  completedExperiments: number
  totalLogs: number
  currentStreak: number
} {
  const experiments = getUserExperiments(userId)
  const logs = getUserDailyLogs(userId)

  const activeExperiments = experiments.filter((exp) => exp.status === "active").length
  const completedExperiments = experiments.filter((exp) => exp.status === "completed").length

  // Calculate current streak (consecutive days with logs)
  const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let currentStreak = 0
  const today = new Date()

  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date)
    const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === currentStreak) {
      currentStreak++
    } else {
      break
    }
  }

  return {
    totalExperiments: experiments.length,
    activeExperiments,
    completedExperiments,
    totalLogs: logs.length,
    currentStreak,
  }
}

// Initialize storage on first load
if (typeof window !== "undefined") {
  initializeTemplates()
}
