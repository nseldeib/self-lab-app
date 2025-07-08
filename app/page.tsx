"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Calendar, Clock, FlaskConical, LogOut, Plus, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import { getCurrentUser, signOut, getExperiments, getDailyLogs, getExperimentTemplates } from "@/lib/storage"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [experiments, setExperiments] = useState([])
  const [dailyLogs, setDailyLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)
    setExperiments(getExperiments(currentUser.id))
    setDailyLogs(getDailyLogs(currentUser.id))
    setLoading(false)
  }, [router])

  const handleSignOut = () => {
    signOut()
    router.push("/auth/signin")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeExperiments = experiments.filter((exp) => exp.status === "active")
  const completedExperiments = experiments.filter((exp) => exp.status === "completed")
  const templates = getExperimentTemplates()

  const getExperimentProgress = (experiment) => {
    const startDate = new Date(experiment.startDate)
    const endDate = new Date(experiment.endDate)
    const today = new Date()

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100)
  }

  const getDaysRemaining = (experiment) => {
    const endDate = new Date(experiment.endDate)
    const today = new Date()
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(daysRemaining, 0)
  }

  const recentLogs = dailyLogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FlaskConical className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SelfLab</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
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
              <div className="text-2xl font-bold">{activeExperiments.length}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExperiments.length}</div>
              <p className="text-xs text-muted-foreground">Experiments finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyLogs.length}</div>
              <p className="text-xs text-muted-foreground">Data points collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">Available templates</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Experiments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Active Experiments</span>
              </CardTitle>
              <CardDescription>Your currently running experiments</CardDescription>
            </CardHeader>
            <CardContent>
              {activeExperiments.length === 0 ? (
                <div className="text-center py-8">
                  <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active experiments</p>
                  <Button onClick={() => router.push("/experiments/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Experiment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeExperiments.map((experiment) => (
                    <div key={experiment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{experiment.name}</h3>
                        <Badge variant="secondary">{experiment.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{experiment.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(getExperimentProgress(experiment))}%</span>
                        </div>
                        <Progress value={getExperimentProgress(experiment)} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{getDaysRemaining(experiment)} days remaining</span>
                          <span>Started {new Date(experiment.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest experiment logs</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No logs yet</p>
                  <Button onClick={() => router.push("/log")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Log Data
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLogs.map((log) => {
                    const experiment = experiments.find((exp) => exp.id === log.experimentId)
                    return (
                      <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {experiment?.name || "Unknown Experiment"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleDateString()} • {log.notes || "No notes"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to help you track your experiments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => router.push("/experiments/new")} className="h-20 flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Start New Experiment</span>
              </Button>
              <Button variant="outline" onClick={() => router.push("/log")} className="h-20 flex-col space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Log Today's Data</span>
              </Button>
              <Button variant="outline" onClick={() => router.push("/library")} className="h-20 flex-col space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>Browse Templates</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
