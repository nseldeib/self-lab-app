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
  title: string
  description: string
  duration: number
  startDate: string
  endDate: string
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
  title: string
  description: string
  duration: number
  metrics: string[]
  instructions: string
  category: string
}

// Utility functions
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Storage keys
const USERS_KEY = "selflab_users"
const EXPERIMENTS_KEY = "selflab_experiments"
const LOGS_KEY = "selflab_logs"
const CURRENT_USER_KEY = "selflab_current_user"
const TEMPLATES_KEY = "selflab_templates"

// Default experiment templates
const DEFAULT_TEMPLATES: ExperimentTemplate[] = [
  {
    id: "template_1",
    title: "Cold Shower Challenge",
    description: "Take cold showers for 2-3 minutes daily to boost alertness and resilience",
    duration: 21,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions:
      "Start with 30 seconds of cold water at the end of your regular shower, gradually increase to 2-3 minutes over the first week.",
    category: "Physical",
  },
  {
    id: "template_2",
    title: "Intermittent Fasting 16:8",
    description: "Fast for 16 hours, eat within an 8-hour window daily",
    duration: 28,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions:
      "Skip breakfast and eat between 12pm-8pm. Stay hydrated with water, black coffee, or plain tea during fasting hours.",
    category: "Nutrition",
  },
  {
    id: "template_3",
    title: "Morning Light Exposure",
    description: "Get 10-15 minutes of natural sunlight within 1 hour of waking",
    duration: 14,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions:
      "Go outside or sit by a bright window within 1 hour of waking. No sunglasses needed, but avoid staring directly at the sun.",
    category: "Circadian",
  },
  {
    id: "template_4",
    title: "Meditation Practice",
    description: "Daily mindfulness meditation to reduce stress and improve focus",
    duration: 21,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions:
      "Start with 5 minutes daily, focusing on breath awareness. Use apps like Headspace or Calm, or practice in silence.",
    category: "Mental",
  },
  {
    id: "template_5",
    title: "High-Intensity Interval Training",
    description: "Short bursts of intense exercise followed by rest periods",
    duration: 28,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions:
      "20-30 minutes, 3x per week. Example: 30 seconds high intensity, 90 seconds rest, repeat 8-12 rounds.",
    category: "Physical",
  },
  {
    id: "template_6",
    title: "Blue Light Blocking",
    description: "Wear blue light blocking glasses 2 hours before bedtime",
    duration: 14,
    metrics: ["mood", "energy", "sleep", "compliance"],
    instructions:
      "Put on blue light blocking glasses 2 hours before your target bedtime. Dim other lights and avoid screens when possible.",
    category: "Circadian",
  },
]

// Initialize templates if not exists
function initializeTemplates(): void {
  if (typeof window === "undefined") return

  const existingTemplates = localStorage.getItem(TEMPLATES_KEY)
  if (!existingTemplates) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES))
  }
}

// User management
export function registerUser(
  email: string,
  password: string,
  name?: string,
): { success: boolean; message: string; user?: User } {
  if (typeof window === "undefined") return { success: false, message: "Not in browser environment" }

  try {
    const users = getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "User already exists with this email" }
    }

    const newUser: User = {
      id: generateId(),
      email,
      password, // In a real app, this would be hashed
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    return { success: true, message: "User registered successfully", user: newUser }
  } catch (error) {
    return { success: false, message: "Failed to register user" }
  }
}

export function loginUser(email: string, password: string): { success: boolean; message: string; user?: User } {
  if (typeof window === "undefined") return { success: false, message: "Not in browser environment" }

  try {
    const users = getUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Set current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))

    return { success: true, message: "Login successful", user }
  } catch (error) {
    return { success: false, message: "Failed to login" }
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    return null
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Add signOut as an alias for logoutUser
export function signOut(): void {
  logoutUser()
}

export function resetPassword(email: string): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Not in browser environment" }

  try {
    const users = getUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, message: "No user found with this email" }
    }

    // In a real app, this would send an email
    return { success: true, message: "Password reset instructions sent to your email" }
  } catch (error) {
    return { success: false, message: "Failed to process password reset" }
  }
}

// Helper functions
function getUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const usersStr = localStorage.getItem(USERS_KEY)
    return usersStr ? JSON.parse(usersStr) : []
  } catch (error) {
    return []
  }
}

// Experiment management
export function createExperiment(experiment: Omit<Experiment, "id" | "createdAt" | "updatedAt">): Experiment {
  if (typeof window === "undefined") throw new Error("Not in browser environment")

  const newExperiment: Experiment = {
    ...experiment,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const experiments = getExperiments()
  experiments.push(newExperiment)
  localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(experiments))

  return newExperiment
}

export function getExperiments(userId?: string): Experiment[] {
  if (typeof window === "undefined") return []

  try {
    const experimentsStr = localStorage.getItem(EXPERIMENTS_KEY)
    const experiments = experimentsStr ? JSON.parse(experimentsStr) : []

    if (userId) {
      return experiments.filter((exp: Experiment) => exp.userId === userId)
    }

    return experiments
  } catch (error) {
    return []
  }
}

export function saveExperiment(experiment: Experiment): void {
  if (typeof window === "undefined") return

  try {
    const experiments = getExperiments()
    const index = experiments.findIndex((exp) => exp.id === experiment.id)

    if (index === -1) {
      // New experiment
      experiments.push({
        ...experiment,
        updatedAt: new Date().toISOString(),
      })
    } else {
      // Update existing experiment
      experiments[index] = {
        ...experiment,
        updatedAt: new Date().toISOString(),
      }
    }

    localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(experiments))
  } catch (error) {
    console.error("Failed to save experiment:", error)
  }
}

export function updateExperiment(id: string, updates: Partial<Experiment>): Experiment | null {
  if (typeof window === "undefined") return null

  try {
    const experiments = getExperiments()
    const index = experiments.findIndex((exp) => exp.id === id)

    if (index === -1) return null

    experiments[index] = {
      ...experiments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(experiments))
    return experiments[index]
  } catch (error) {
    return null
  }
}

export function deleteExperiment(id: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const experiments = getExperiments()
    const filteredExperiments = experiments.filter((exp) => exp.id !== id)

    localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(filteredExperiments))

    // Also delete related logs
    const logs = getDailyLogs()
    const filteredLogs = logs.filter((log) => log.experimentId !== id)
    localStorage.setItem(LOGS_KEY, JSON.stringify(filteredLogs))

    return true
  } catch (error) {
    return false
  }
}

// Daily log management
export function createDailyLog(log: Omit<DailyLog, "id" | "createdAt">): DailyLog {
  if (typeof window === "undefined") throw new Error("Not in browser environment")

  const newLog: DailyLog = {
    ...log,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  const logs = getDailyLogs()
  logs.push(newLog)
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))

  return newLog
}

export function getDailyLogs(userId?: string, experimentId?: string): DailyLog[] {
  if (typeof window === "undefined") return []

  try {
    const logsStr = localStorage.getItem(LOGS_KEY)
    let logs = logsStr ? JSON.parse(logsStr) : []

    if (userId) {
      logs = logs.filter((log: DailyLog) => log.userId === userId)
    }

    if (experimentId) {
      logs = logs.filter((log: DailyLog) => log.experimentId === experimentId)
    }

    return logs
  } catch (error) {
    return []
  }
}

export function saveDailyLog(log: DailyLog): void {
  if (typeof window === "undefined") return

  try {
    const logs = getDailyLogs()
    const index = logs.findIndex((l) => l.id === log.id)

    if (index === -1) {
      // New log
      logs.push(log)
    } else {
      // Update existing log
      logs[index] = log
    }

    localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
  } catch (error) {
    console.error("Failed to save daily log:", error)
  }
}

export function updateDailyLog(id: string, updates: Partial<DailyLog>): DailyLog | null {
  if (typeof window === "undefined") return null

  try {
    const logs = getDailyLogs()
    const index = logs.findIndex((log) => log.id === id)

    if (index === -1) return null

    logs[index] = { ...logs[index], ...updates }
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs))

    return logs[index]
  } catch (error) {
    return null
  }
}

// Template management
export function getExperimentTemplates(): ExperimentTemplate[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES

  initializeTemplates()

  try {
    const templatesStr = localStorage.getItem(TEMPLATES_KEY)
    return templatesStr ? JSON.parse(templatesStr) : DEFAULT_TEMPLATES
  } catch (error) {
    return DEFAULT_TEMPLATES
  }
}

export function createExperimentFromTemplate(templateId: string, userId: string, startDate: string): Experiment | null {
  const templates = getExperimentTemplates()
  const template = templates.find((t) => t.id === templateId)

  if (!template) return null

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + template.duration)

  return createExperiment({
    userId,
    title: template.title,
    description: template.description,
    duration: template.duration,
    startDate,
    endDate: endDate.toISOString().split("T")[0],
    status: "active",
    metrics: template.metrics,
    notes: template.instructions,
  })
}

// Demo account setup
export function setupDemoAccount(): User {
  const demoEmail = "demo@selflab.com"
  const demoPassword = "password123"

  // Check if demo user already exists
  const users = getUsers()
  let demoUser = users.find((u) => u.email === demoEmail)

  if (!demoUser) {
    const result = registerUser(demoEmail, demoPassword, "Demo User")
    if (result.success && result.user) {
      demoUser = result.user
    } else {
      throw new Error("Failed to create demo user")
    }
  }

  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser))

  return demoUser
}

// Initialize storage
export function initializeStorage(): void {
  initializeTemplates()
}
