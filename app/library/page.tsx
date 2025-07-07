"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import {
  getCurrentUser,
  getExperimentTemplates,
  saveExperiment,
  generateId,
  type User,
  type ExperimentTemplate,
  type Experiment,
} from "@/lib/storage"
import { Search, BookOpen, Clock, Plus } from "lucide-react"

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [templates, setTemplates] = useState<ExperimentTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<ExperimentTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = "/auth/signin"
      return
    }

    setUser(currentUser)
    const allTemplates = getExperimentTemplates()
    setTemplates(allTemplates)
    setFilteredTemplates(allTemplates)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = templates

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((template) => template.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((template) => template.difficulty === selectedDifficulty)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, selectedCategory, selectedDifficulty])

  const handleStartExperiment = (template: ExperimentTemplate) => {
    if (!user) return

    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + template.duration_days)

    const experiment: Experiment = {
      id: generateId(),
      user_id: user.id,
      name: template.name,
      hypothesis: template.hypothesis,
      start_date: today.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      status: "active",
      variables: template.variables,
      metrics: template.metrics,
      notes: `Protocol: ${template.protocol}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveExperiment(experiment)
    alert(`Started experiment: ${template.name}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category.toLowerCase())))]
  const difficulties = ["all", "beginner", "intermediate", "advanced"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Experiment Library</h1>
          <p className="text-gray-600 mt-2">Discover proven biohacking experiments to try</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search experiments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory !== category ? "bg-transparent" : ""}
                >
                  {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Difficulty:</span>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={selectedDifficulty !== difficulty ? "bg-transparent" : ""}
                >
                  {difficulty === "all" ? "All" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} experiments
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-2">{template.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Category & Duration */}
                    <div className="flex justify-between items-center text-sm">
                      <Badge variant="outline">{template.category}</Badge>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {template.duration_days} days
                      </div>
                    </div>

                    {/* Hypothesis */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Hypothesis:</h4>
                      <p className="text-sm text-gray-600">{template.hypothesis}</p>
                    </div>

                    {/* Variables & Metrics */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">Variables:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.variables.slice(0, 3).map((variable, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                          {template.variables.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.variables.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">Metrics:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.metrics.slice(0, 3).map((metric, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                          {template.metrics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.metrics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Protocol Preview */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Protocol:</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{template.protocol}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => handleStartExperiment(template)} className="flex-1">
                        <Plus className="h-4 w-4 mr-1" />
                        Start Experiment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiments found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
            <Button onClick={() => (setSearchQuery(""), setSelectedCategory("all"), setSelectedDifficulty("all"))}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
