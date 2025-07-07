"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, LogOut, Activity, Target, TrendingUp, Calendar, Plus, BookOpen, BarChart3 } from "lucide-react"
import {
  getCurrentUser,
  signOut,
  getUserExperiments,
  getUserDailyLogs,
  getUserStats,
  type User as UserType,
  type Experiment,
  type DailyLog,
} from "@/lib/storage"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([])
  const [stats, setStats] = useState({
    totalExperiments: 0,
    activeExperiments: 0,
    completedExperiments: 0,
    totalLogs: 0,
    currentStreak: 0,
  })
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)

    // Load user data
    const userExperiments = getUserExperiments(currentUser.id)
    const userLogs = getUserDailyLogs(currentUser.id)
    const userStats = getUserStats(currentUser.id)

    setExperiments(userExperiments)
    setRecentLogs(userLogs.slice(0, 5)) // Show last 5 logs
    setStats(userStats)
    setLoading(false)
  }, [router])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      signOut()
      router.push("/auth/signin")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeExperiments = experiments.filter((exp) => exp.status === "active")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SelfLab</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back{user.name ? `, ${user.name}` : ""}!</h2>
          <p className="text-gray-600">Track your biohacking experiments and optimize your health.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeExperiments}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedExperiments}</div>
              <p className="text-xs text-muted-foreground">Experiments finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
              <p className="text-xs text-muted-foreground">Data points recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">Days logging data</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/experiments/new")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Start New Experiment
              </CardTitle>
              <CardDescription>Create a custom experiment or use a template</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/log")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Log Today's Data
              </CardTitle>
              <CardDescription>Record your daily metrics and observations</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/library")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Templates
              </CardTitle>
              <CardDescription>Explore proven biohacking experiments</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Active Experiments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Experiments</CardTitle>
              <CardDescription>Your currently running experiments</CardDescription>
            </CardHeader>
            <CardContent>
              {activeExperiments.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active experiments</p>
                  <Button onClick={() => router.push("/experiments/new")}>Start Your First Experiment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeExperiments.map((experiment) => {
                    const startDate = new Date(experiment.startDate)
                    const today = new Date()
                    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                    const progress = Math.min((daysElapsed / experiment.duration) * 100, 100)

                    return (
                      <div key={experiment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{experiment.name}</h3>
                          <Badge variant="secondary">
                            Day {daysElapsed + 1} of {experiment.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{experiment.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest data logs</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No logs yet</p>
                  <Button onClick={() => router.push("/log")}>Log Your First Entry</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map((log) => {
                    const experiment = experiments.find((exp) => exp.id === log.experimentId)
                    return (
                      <div key={log.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{experiment?.name || "Unknown Experiment"}</h4>
                          <span className="text-xs text-gray-500">{log.date}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Mood:</span>
                            <span className="ml-1 font-medium">{log.mood}/10</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Energy:</span>
                            <span className="ml-1 font-medium">{log.energy}/10</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Sleep:</span>
                            <span className="ml-1 font-medium">{log.sleep}/10</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Compliance:</span>
                            <span className="ml-1 font-medium">{log.compliance}/10</span>
                          </div>
                        </div>
                        {log.notes && <p className="text-xs text-gray-600 mt-2">{log.notes}</p>}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
