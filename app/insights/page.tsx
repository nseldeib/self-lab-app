"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Lightbulb, Calendar } from "lucide-react"

export default function InsightsPage() {
  const sleepData = [
    { date: "1/15", sleep: 7.5, mood: 8, energy: 7 },
    { date: "1/16", sleep: 6.5, mood: 6, energy: 5 },
    { date: "1/17", sleep: 8.0, mood: 9, energy: 8 },
    { date: "1/18", sleep: 7.0, mood: 7, energy: 7 },
    { date: "1/19", sleep: 7.5, mood: 8, energy: 8 },
    { date: "1/20", sleep: 8.5, mood: 9, energy: 9 },
    { date: "1/21", sleep: 7.0, mood: 7, energy: 6 },
  ]

  const coldShowerData = [
    { week: "Week 1", baseline: 6.2, experiment: 6.8 },
    { week: "Week 2", baseline: 6.2, experiment: 7.1 },
    { week: "Week 3", baseline: 6.2, experiment: 7.5 },
    { week: "Week 4", baseline: 6.2, experiment: 7.8 },
  ]

  const insights = [
    {
      title: "Sleep Quality Correlation",
      description: "Your mood increases by 1.2 points for every extra hour of sleep",
      trend: "positive",
      confidence: "high",
    },
    {
      title: "Cold Shower Impact",
      description: "Energy levels increased by 25% during cold shower experiment",
      trend: "positive",
      confidence: "high",
    },
    {
      title: "Caffeine Timing",
      description: "Sleep quality improved by 15% when avoiding caffeine after 2PM",
      trend: "positive",
      confidence: "medium",
    },
    {
      title: "Weekend Pattern",
      description: "Mood tends to be 10% lower on Sundays",
      trend: "negative",
      confidence: "medium",
    },
  ]

  const experiments = [
    { name: "Cold Shower Protocol", status: "active" },
    { name: "No Caffeine After 2PM", status: "active" },
    { name: "Morning Meditation", status: "active" },
    { name: "Intermittent Fasting 16:8", status: "completed" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600 mt-2">Discover patterns and results from your experiments</p>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Key Insights
          </CardTitle>
          <CardDescription>Patterns discovered from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{insight.title}</h3>
                  <div className="flex items-center gap-2">
                    {insight.trend === "positive" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant={insight.confidence === "high" ? "default" : "secondary"}>
                      {insight.confidence}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experiment Results */}
      <Tabs defaultValue="cold-shower" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cold-shower">Cold Shower</TabsTrigger>
          <TabsTrigger value="caffeine">Caffeine</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="fasting">IF 16:8</TabsTrigger>
        </TabsList>

        <TabsContent value="cold-shower" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cold Shower Protocol Results</CardTitle>
              <CardDescription>Energy levels: Baseline vs Experiment period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coldShowerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="baseline" fill="#e5e7eb" name="Baseline" />
                  <Bar dataKey="experiment" fill="#3b82f6" name="With Cold Showers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+25%</div>
                <p className="text-sm text-gray-600">Energy increase</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <p className="text-sm text-gray-600">Days followed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Side Effects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-600">None</div>
                <p className="text-sm text-gray-600">Reported</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caffeine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>No Caffeine After 2PM Results</CardTitle>
              <CardDescription>Sleep quality improvements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} name="Sleep Quality" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meditation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Morning Meditation Results</CardTitle>
              <CardDescription>Stress and mood tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>Experiment in progress - results will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intermittent Fasting 16:8 Results</CardTitle>
              <CardDescription>Completed experiment summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Key Outcomes</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Weight decreased by 3.2kg
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Energy levels increased by 15%
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Hunger cravings reduced significantly
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Compliance</h3>
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <p className="text-sm text-gray-600">28 out of 30 days successfully completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Overall Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Health Trends</CardTitle>
          <CardDescription>Your key metrics over the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={2} name="Sleep" />
              <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} name="Energy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
