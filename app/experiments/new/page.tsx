"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { getCurrentUser, saveExperiment, generateId, type User, type Experiment } from "@/lib/storage"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function NewExperimentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Form state
  const [name, setName] = useState("")
  const [hypothesis, setHypothesis] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [variables, setVariables] = useState<string[]>([])
  const [metrics, setMetrics] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [newVariable, setNewVariable] = useState("")
  const [newMetric, setNewMetric] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = "/auth/signin"
      return
    }

    setUser(currentUser)
    setLoading(false)

    // Set default dates
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)

    setStartDate(today.toISOString().split("T")[0])
    setEndDate(nextMonth.toISOString().split("T")[0])
  }, [])

  const addVariable = () => {
    if (newVariable.trim() && !variables.includes(newVariable.trim())) {
      setVariables([...variables, newVariable.trim()])
      setNewVariable("")
    }
  }

  const removeVariable = (variable: string) => {
    setVariables(variables.filter((v) => v !== variable))
  }

  const addMetric = () => {
    if (newMetric.trim() && !metrics.includes(newMetric.trim())) {
      setMetrics([...metrics, newMetric.trim()])
      setNewMetric("")
    }
  }

  const removeMetric = (metric: string) => {
    setMetrics(metrics.filter((m) => m !== metric))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setSaving(true)

    const experiment: Experiment = {
      id: generateId(),
      user_id: user.id,
      name,
      hypothesis,
      start_date: startDate,
      end_date: endDate,
      status: "active",
      variables,
      metrics,
      notes: notes || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveExperiment(experiment)

    setSaving(false)
    router.push("/experiments")
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
          <Link href="/experiments">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experiments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Experiment</h1>
          <p className="text-gray-600 mt-2">Design your next biohacking experiment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Experiment Details</CardTitle>
            <CardDescription>Define your hypothesis and tracking parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Experiment Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Cold Shower Challenge"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="hypothesis">Hypothesis *</Label>
                  <Textarea
                    id="hypothesis"
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="e.g., Taking cold showers daily will improve my energy levels and mood"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Variables */}
              <div>
                <Label>Variables to Track</Label>
                <p className="text-sm text-gray-600 mb-3">What factors will you be changing or controlling?</p>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    placeholder="e.g., water temperature"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addVariable())}
                  />
                  <Button type="button" onClick={addVariable} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="flex items-center gap-1">
                      {variable}
                      <button type="button" onClick={() => removeVariable(variable)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div>
                <Label>Metrics to Measure</Label>
                <p className="text-sm text-gray-600 mb-3">What outcomes will you be tracking?</p>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g., energy level"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMetric())}
                  />
                  <Button type="button" onClick={addMetric} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metrics.map((metric) => (
                    <Badge key={metric} variant="secondary" className="flex items-center gap-1">
                      {metric}
                      <button type="button" onClick={() => removeMetric(metric)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details, protocols, or reminders..."
                  rows={3}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Creating..." : "Create Experiment"}
                </Button>
                <Link href="/experiments">
                  <Button type="button" variant="outline" className="bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
