"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import {
  getCurrentUser,
  getExperiments,
  getDailyLogs,
  signOut,
  type User,
  type Experiment,
  type DailyLog,
} from "@/lib/storage"
import { Target, Calendar, TrendingUp, Plus, Clock, CheckCircle, Pause, LogOut, UserIcon } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/auth/signin")
        return
      }

      setUser(currentUser)
      const userExperiments = getExperiments(currentUser.id)
      const userLogs = getDailyLogs(currentUser.id)
      setExperiments(userExperiments)
      setDailyLogs(userLogs)
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      setUser(null)
      router.push("/auth/signin")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setSigningOut(false)
    }
  }

  const activeExperiments = experiments.filter((exp) => exp.status === "active")
  const completedExperiments = experiments.filter((exp) => exp.status === "completed")
  const recentLogs = dailyLogs.slice(-7) // Last 7 days

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = (experiment: Experiment) => {
    const startDate = new Date(experiment.startDate)
    const endDate = new Date(experiment.endDate)
    const today = new Date()

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header with User Info and Sign Out */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || user?.email?.split("@")[0]}! 👋
            </h1>
            <p className="text-gray-600">Track your biohacking journey and optimize your health.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserIcon className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={signingOut}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {signingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeExperiments.length}</div>
              <p className="text-xs text-muted-foreground">{completedExperiments.length} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Logged</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyLogs.length}</div>
              <p className="text-xs text-muted-foreground">{recentLogs.length} in last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Energy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentLogs.length > 0
                  ? (recentLogs.reduce((sum, log) => sum + log.energy, 0) / recentLogs.length).toFixed(1)
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground">out of 10 (last 7 days)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Experiments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Experiments</CardTitle>
                <CardDescription>Your current biohacking experiments</CardDescription>
              </div>
              <Link href="/experiments/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeExperiments.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active experiments</h3>
                  <p className="text-gray-600 mb-4">Start your first biohacking experiment to begin tracking.</p>
                  <Link href="/experiments/new">
                    <Button>Create Experiment</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeExperiments.slice(0, 3).map((experiment) => (
                    <div key={experiment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{experiment.title}</h4>
                        <Badge className={getStatusColor(experiment.status)}>
                          {getStatusIcon(experiment.status)}
                          <span className="ml-1 capitalize">{experiment.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{experiment.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(calculateProgress(experiment))}%</span>
                        </div>
                        <Progress value={calculateProgress(experiment)} className="h-2" />
                      </div>
                    </div>
                  ))}
                  {activeExperiments.length > 3 && (
                    <Link href="/experiments">
                      <Button variant="outline" className="w-full bg-transparent">
                        View All Experiments
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest daily logs</CardDescription>
              </div>
              <Link href="/log">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Today
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent logs</h3>
                  <p className="text-gray-600 mb-4">Start logging your daily metrics to track progress.</p>
                  <Link href="/log">
                    <Button>Log Today</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLogs
                    .slice(-5)
                    .reverse()
                    .map((log) => (
                      <div key={log.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">{new Date(log.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-600">
                            Sleep: {log.sleep}h • Energy: {log.energy}/10 • Mood: {log.mood}/10
                          </div>
                        </div>
                      </div>
                    ))}
                  <Link href="/log">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Logs
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/experiments/new">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-6">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">New Experiment</h3>
                    <p className="text-sm text-gray-600">Start tracking something new</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/log">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-6">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium">Daily Log</h3>
                    <p className="text-sm text-gray-600">Record today's metrics</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/insights">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-6">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-medium">View Insights</h3>
                    <p className="text-sm text-gray-600">Analyze your progress</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/library">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-3 p-6">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="font-medium">Browse Library</h3>
                    <p className="text-sm text-gray-600">Find experiment ideas</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
