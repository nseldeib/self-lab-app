"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/navigation"
import {
  getCurrentUser,
  getDailyLogs,
  saveDailyLog,
  getExperiments,
  generateId,
  type User,
  type DailyLog,
  type Experiment,
} from "@/lib/storage"
import { Calendar, Moon, Zap, Smile, Save } from "lucide-react"

export default function LogPage() {
  const [user, setUser] = useState<User | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [date, setDate] = useState("")
  const [sleepHours, setSleepHours] = useState("")
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [notes, setNotes] = useState("")
  const [experimentCompliance, setExperimentCompliance] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = "/auth/signin"
      return
    }

    setUser(currentUser)
    const userExperiments = getExperiments().filter((e) => e.user_id === currentUser.id && e.status === "active")
    setExperiments(userExperiments)

    // Set today's date
    const today = new Date().toISOString().split("T")[0]
    setDate(today)

    // Load existing log for today if it exists
    const dailyLogs = getDailyLogs()
    const todayLog = dailyLogs.find((log) => log.user_id === currentUser.id && log.date === today)

    if (todayLog) {
      setSleepHours(todayLog.sleep_hours.toString())
      setMood(todayLog.mood)
      setEnergy(todayLog.energy)
      setNotes(todayLog.notes || "")
      setExperimentCompliance(todayLog.experiment_compliance)
    } else {
      // Initialize compliance for active experiments
      const initialCompliance: Record<string, boolean> = {}
      userExperiments.forEach((exp) => {
        initialCompliance[exp.id] = false
      })
      setExperimentCompliance(initialCompliance)
    }

    setLoading(false)
  }, [])

  const handleComplianceChange = (experimentId: string, compliant: boolean) => {
    setExperimentCompliance((prev) => ({
      ...prev,
      [experimentId]: compliant,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setSaving(true)

    const log: DailyLog = {
      id: generateId(),
      user_id: user.id,
      date,
      sleep_hours: Number.parseFloat(sleepHours) || 0,
      mood,
      energy,
      notes: notes || undefined,
      experiment_compliance: experimentCompliance,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveDailyLog(log)

    setSaving(false)

    // Show success message (you could add a toast here)
    alert("Daily log saved successfully!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Daily Log</h1>
          <p className="text-gray-600 mt-2">Track your daily metrics and experiment compliance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </CardContent>
          </Card>

          {/* Sleep */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Sleep
              </CardTitle>
              <CardDescription>How many hours did you sleep?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  placeholder="8.0"
                  className="w-24"
                  required
                />
                <span className="text-gray-600">hours</span>
              </div>
            </CardContent>
          </Card>

          {/* Mood */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                Mood
              </CardTitle>
              <CardDescription>Rate your overall mood today (1-5)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMood(rating)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      mood >= rating
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </CardContent>
          </Card>

          {/* Energy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy
              </CardTitle>
              <CardDescription>Rate your energy level today (1-5)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setEnergy(rating)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      energy >= rating
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-300"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </CardContent>
          </Card>

          {/* Experiment Compliance */}
          {experiments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Experiment Compliance</CardTitle>
                <CardDescription>Did you follow your active experiments today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiments.map((experiment) => (
                    <div key={experiment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{experiment.name}</h4>
                        <p className="text-sm text-gray-600">{experiment.hypothesis}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={experimentCompliance[experiment.id] || false}
                          onCheckedChange={(checked) => handleComplianceChange(experiment.id, checked)}
                        />
                        <Badge variant={experimentCompliance[experiment.id] ? "default" : "secondary"}>
                          {experimentCompliance[experiment.id] ? "Followed" : "Skipped"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Any additional observations or thoughts?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel today? Any notable events or observations..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Daily Log"}
          </Button>
        </form>
      </div>
    </div>
  )
}
