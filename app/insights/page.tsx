"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { getCurrentUser, getDailyLogs, getExperiments, type User, type DailyLog, type Experiment } from "@/lib/storage"
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Zap, Moon, Smile } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function InsightsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = "/auth/signin"
      return
    }

    setUser(currentUser)
    const userLogs = getDailyLogs().filter((log) => log.user_id === currentUser.id)
    const userExperiments = getExperiments().filter((exp) => exp.user_id === currentUser.id)

    // Sort logs by date
    userLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setDailyLogs(userLogs)
    setExperiments(userExperiments)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
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

  // Calculate trends
  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return { trend: "stable", change: 0 }

    const recent = values.slice(-7) // Last 7 days
    const previous = values.slice(-14, -7) // Previous 7 days

    if (recent.length === 0 || previous.length === 0) return { trend: "stable", change: 0 }

    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
    const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length

    const change = ((recentAvg - previousAvg) / previousAvg) * 100

    if (Math.abs(change) < 5) return { trend: "stable", change }
    return { trend: change > 0 ? "up" : "down", change }
  }

  const energyValues = dailyLogs.map((log) => log.energy)
  const moodValues = dailyLogs.map((log) => log.mood)
  const sleepValues = dailyLogs.map((log) => log.sleep_hours)

  const energyTrend = calculateTrend(energyValues)
  const moodTrend = calculateTrend(moodValues)
  const sleepTrend = calculateTrend(sleepValues)

  // Prepare chart data
  const chartData = dailyLogs.slice(-30).map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    energy: log.energy,
    mood: log.mood,
    sleep: log.sleep_hours,
  }))

  // Calculate averages
  const avgEnergy = energyValues.length > 0 ? energyValues.reduce((sum, val) => sum + val, 0) / energyValues.length : 0
  const avgMood = moodValues.length > 0 ? moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length : 0
  const avgSleep = sleepValues.length > 0 ? sleepValues.reduce((sum, val) => sum + val, 0) / sleepValues.length : 0

  // Experiment compliance analysis
  const complianceData = experiments
    .filter((exp) => exp.status === "active")
    .map((exp) => {
      const complianceLogs = dailyLogs.filter((log) => log.experiment_compliance[exp.id] === true)
      const totalLogs = dailyLogs.filter((log) => log.experiment_compliance.hasOwnProperty(exp.id))
      const complianceRate = totalLogs.length > 0 ? (complianceLogs.length / totalLogs.length) * 100 : 0

      return {
        name: exp.name,
        compliance: Math.round(complianceRate),
      }
    })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
          <p className="text-gray-600 mt-2">Discover patterns in your biohacking journey</p>
        </div>

        {dailyLogs.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No data to analyze yet</h3>
            <p className="text-gray-600 mb-6">Start logging your daily metrics to see insights and trends.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Energy</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgEnergy.toFixed(1)}/5</div>
                  <div className={`flex items-center gap-1 text-xs ${getTrendColor(energyTrend.trend)}`}>
                    {getTrendIcon(energyTrend.trend)}
                    {Math.abs(energyTrend.change).toFixed(1)}% vs last week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                  <Smile className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgMood.toFixed(1)}/5</div>
                  <div className={`flex items-center gap-1 text-xs ${getTrendColor(moodTrend.trend)}`}>
                    {getTrendIcon(moodTrend.trend)}
                    {Math.abs(moodTrend.change).toFixed(1)}% vs last week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Sleep</CardTitle>
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgSleep.toFixed(1)}h</div>
                  <div className={`flex items-center gap-1 text-xs ${getTrendColor(sleepTrend.trend)}`}>
                    {getTrendIcon(sleepTrend.trend)}
                    {Math.abs(sleepTrend.change).toFixed(1)}% vs last week
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Trends Over Time</CardTitle>
                <CardDescription>Your daily metrics over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
                      <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} name="Mood" />
                      <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} name="Sleep (hrs)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Experiment Compliance */}
            {complianceData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Experiment Compliance</CardTitle>
                  <CardDescription>How well you're following your active experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={complianceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, "Compliance Rate"]} />
                        <Bar dataKey="compliance" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Patterns and observations from your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {energyTrend.trend === "up" && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Energy Levels Improving</h4>
                        <p className="text-sm text-green-700">
                          Your energy has increased by {energyTrend.change.toFixed(1)}% compared to last week. Keep up
                          the good work!
                        </p>
                      </div>
                    </div>
                  )}

                  {moodTrend.trend === "up" && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Mood Trending Positive</h4>
                        <p className="text-sm text-blue-700">
                          Your mood has improved by {moodTrend.change.toFixed(1)}% over the past week.
                        </p>
                      </div>
                    </div>
                  )}

                  {avgSleep < 7 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Moon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Consider More Sleep</h4>
                        <p className="text-sm text-yellow-700">
                          Your average sleep is {avgSleep.toFixed(1)} hours. Most adults need 7-9 hours for optimal
                          health.
                        </p>
                      </div>
                    </div>
                  )}

                  {complianceData.some((exp) => exp.compliance < 70) && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <Target className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Low Experiment Compliance</h4>
                        <p className="text-sm text-red-700">
                          Some experiments have low compliance rates. Consider adjusting protocols or reducing the
                          number of active experiments.
                        </p>
                      </div>
                    </div>
                  )}

                  {dailyLogs.length >= 7 && (
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Great Consistency!</h4>
                        <p className="text-sm text-purple-700">
                          You've been consistently logging data for {dailyLogs.length} days. This consistency will help
                          you identify meaningful patterns.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
