"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { getCurrentUser, getExperiments, deleteExperiment, type User, type Experiment } from "@/lib/storage"
import { Plus, Target, Calendar, Trash2, Edit, Play, Pause, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ExperimentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = "/auth/signin"
      return
    }

    setUser(currentUser)
    loadExperiments(currentUser.id)
    setLoading(false)
  }, [])

  const loadExperiments = (userId: string) => {
    const allExperiments = getExperiments()
    setExperiments(allExperiments.filter((e) => e.user_id === userId))
  }

  const handleDeleteExperiment = (id: string) => {
    deleteExperiment(id)
    if (user) {
      loadExperiments(user.id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const calculateProgress = (experiment: Experiment) => {
    const startDate = new Date(experiment.start_date)
    const endDate = new Date(experiment.end_date)
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
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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

  const activeExperiments = experiments.filter((e) => e.status === "active")
  const completedExperiments = experiments.filter((e) => e.status === "completed")
  const pausedExperiments = experiments.filter((e) => e.status === "paused")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Experiments</h1>
            <p className="text-gray-600 mt-2">Track and manage your biohacking experiments</p>
          </div>
          <Link href="/experiments/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Experiment
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{experiments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Play className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeExperiments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExperiments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paused</CardTitle>
              <Pause className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pausedExperiments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Experiments Grid */}
        {experiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => {
              const progress = calculateProgress(experiment)
              const startDate = new Date(experiment.start_date)
              const endDate = new Date(experiment.end_date)
              const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
              const today = new Date()
              const daysPassed = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

              return (
                <Card key={experiment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{experiment.name}</CardTitle>
                        <CardDescription className="mt-2">{experiment.hypothesis}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(experiment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(experiment.status)}
                          {experiment.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>
                            Day {Math.min(daysPassed, totalDays)} of {totalDays}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Dates */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Start:</span> {startDate.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">End:</span> {endDate.toLocaleDateString()}
                        </div>
                      </div>

                      {/* Variables & Metrics */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Variables:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {experiment.variables.map((variable, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Metrics:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {experiment.metrics.map((metric, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Experiment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{experiment.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteExperiment(experiment.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiments yet</h3>
            <p className="text-gray-600 mb-6">
              Start your first biohacking experiment to begin tracking your progress.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/experiments/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Experiment
                </Button>
              </Link>
              <Link href="/library">
                <Button variant="outline" className="bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
