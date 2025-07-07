"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, LogOut, Plus, Activity, Calendar, TrendingUp, BookOpen, Target, Clock, CheckCircle } from "lucide-react"
import {
  getCurrentUser,
  logoutUser,
  getExperiments,
  getDailyLogs,
  getExperimentTemplates,
  type User as UserType,
  type Experiment,
} from "@/lib/storage"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)

    // Load user's experiments
    const userExperiments = getExperiments(currentUser.id)
    setExperiments(userExperiments)

    setIsLoading(false)
  }, [router])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      logoutUser()
      router.push("/auth/signin")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeExperiments = experiments.filter((exp) => exp.status === "active")
  const completedExperiments = experiments.filter((exp) => exp.status === "completed")
  const totalLogs = getDailyLogs(user.id).length
  const templates = getExperimentTemplates()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back{user.name ? `, ${user.name}` : ""}!</h1>
              <p className="text-gray-600">Track your biohacking experiments and optimize your health</p>
            </div>

            {/* User Info and Sign Out */}
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeExperiments.length}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExperiments.length}</div>
              <p className="text-xs text-muted-foreground">Experiments finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Logs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLogs}</div>
              <p className="text-xs text-muted-foreground">Data points recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">Ready to start</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with your biohacking journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" onClick={() => router.push("/experiments/new")}>
                <Target className="h-4 w-4 mr-2" />
                Start New Experiment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/log")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Log Today's Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/library")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Active Experiments
              </CardTitle>
              <CardDescription>Your current biohacking experiments</CardDescription>
            </CardHeader>
            <CardContent>
              {activeExperiments.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active experiments yet</p>
                  <Button onClick={() => router.push("/experiments/new")}>Start Your First Experiment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeExperiments.slice(0, 3).map((experiment) => {
                    const startDate = new Date(experiment.startDate)
                    const endDate = new Date(experiment.endDate)
                    const today = new Date()
                    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                    const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100)

                    return (
                      <div key={experiment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{experiment.title}</h3>
                          <Badge variant="secondary">
                            Day {Math.max(daysPassed, 1)} of {totalDays}
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
                  {activeExperiments.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/experiments")}
                    >
                      View All Experiments
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest experiment logs and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {totalLogs === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No activity yet</p>
                <p className="text-sm text-gray-400">Start logging your daily metrics to see your progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getDailyLogs(user.id)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((log) => {
                    const experiment = experiments.find((exp) => exp.id === log.experimentId)
                    return (
                      <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{experiment?.title || "Unknown Experiment"}</p>
                          <p className="text-sm text-gray-600">Logged on {new Date(log.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Mood: {log.mood}/10</Badge>
                          <Badge variant="outline">Energy: {log.energy}/10</Badge>
                        </div>
                      </div>
                    )
                  })}
                <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/insights")}>
                  View All Activity
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
