"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getCurrentUser,
  signOut,
  getExperiments,
  getDailyLogs,
  getExperimentTemplates,
  type User,
  type Experiment,
  type DailyLog,
} from "@/lib/storage"
import { Activity, Beaker, Calendar, TrendingUp, UserIcon, LogOut, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

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

    // Load recent daily logs
    const userLogs = getDailyLogs(currentUser.id)
    setRecentLogs(userLogs.slice(0, 5)) // Get last 5 logs

    setLoading(false)
  }, [router])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push("/auth/signin")
    } catch (error) {
      console.error("Sign out error:", error)
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeExperiments = experiments.filter((exp) => exp.status === "active")
  const completedExperiments = experiments.filter((exp) => exp.status === "completed")
  const templates = getExperimentTemplates()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🧬 SelfLab</h1>
              <p className="text-gray-600">Welcome back, {user.name || user.email}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={signingOut}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {signingOut ? "Signing Out..." : "Sign Out"}
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
              <Beaker className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Daily Logs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentLogs.length}</div>
              <p className="text-xs text-muted-foreground">Total entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">Available to try</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Experiments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Experiments</CardTitle>
                  <CardDescription>Your currently running experiments</CardDescription>
                </div>
                <Link href="/experiments/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {activeExperiments.length === 0 ? (
                <div className="text-center py-8">
                  <Beaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active experiments</h3>
                  <p className="text-gray-600 mb-4">
                    Start your first biohacking experiment to begin tracking your progress.
                  </p>
                  <Link href="/experiments/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Experiment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeExperiments.map((experiment) => (
                    <div key={experiment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{experiment.title}</h4>
                        <Badge variant="secondary">{experiment.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{experiment.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{experiment.duration} days</span>
                        <span>•</span>
                        <span>Started {new Date(experiment.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  <Link href="/experiments">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Experiments
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest daily logs</CardDescription>
                </div>
                <Link href="/log">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Today
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-600 mb-4">Start logging your daily metrics to track your progress.</p>
                  <Link href="/log">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Today
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{new Date(log.date).toLocaleDateString()}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">Mood: {log.mood}/10</Badge>
                          <Badge variant="outline">Energy: {log.energy}/10</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Sleep: {log.sleep} hours</p>
                        {log.notes && <p className="mt-1 italic">"{log.notes}"</p>}
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
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/experiments/new">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                    <Beaker className="h-6 w-6" />
                    <span>Start Experiment</span>
                  </Button>
                </Link>
                <Link href="/log">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                    <Calendar className="h-6 w-6" />
                    <span>Log Today</span>
                  </Button>
                </Link>
                <Link href="/library">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                    <Activity className="h-6 w-6" />
                    <span>Browse Templates</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
