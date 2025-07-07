"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Target, Zap, Brain, Heart, Dumbbell } from "lucide-react"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const experimentTemplates = [
    {
      id: 1,
      name: "Cold Shower Protocol",
      description: "Start your day with cold water exposure to boost energy and mood",
      category: "Recovery",
      duration: "30 days",
      difficulty: "Medium",
      goals: ["Energy", "Mood", "Resilience"],
      icon: "🚿",
      metrics: ["Energy Level", "Mood", "Sleep Quality", "Stress Level"],
      protocol: "End your morning shower with 30-60 seconds of cold water",
    },
    {
      id: 2,
      name: "No Caffeine After 2PM",
      description: "Improve sleep quality by avoiding late-day caffeine consumption",
      category: "Sleep",
      duration: "21 days",
      difficulty: "Easy",
      goals: ["Sleep", "Recovery"],
      icon: "☕",
      metrics: ["Sleep Quality", "Sleep Duration", "Morning Energy"],
      protocol: "Avoid all caffeine (coffee, tea, chocolate) after 2:00 PM",
    },
    {
      id: 3,
      name: "Morning Meditation",
      description: "Start each day with 10 minutes of mindfulness meditation",
      category: "Mental",
      duration: "28 days",
      difficulty: "Easy",
      goals: ["Stress", "Focus", "Mood"],
      icon: "🧘",
      metrics: ["Stress Level", "Focus", "Mood", "Sleep Quality"],
      protocol: "Meditate for 10 minutes within 1 hour of waking up",
    },
    {
      id: 4,
      name: "Intermittent Fasting 16:8",
      description: "Fast for 16 hours, eat within an 8-hour window",
      category: "Nutrition",
      duration: "30 days",
      difficulty: "Hard",
      goals: ["Weight", "Energy", "Focus"],
      icon: "⏰",
      metrics: ["Weight", "Energy Level", "Hunger Level", "Focus"],
      protocol: "Eat only between 12:00 PM and 8:00 PM daily",
    },
    {
      id: 5,
      name: "Daily 10K Steps",
      description: "Walk at least 10,000 steps every day",
      category: "Movement",
      duration: "30 days",
      difficulty: "Medium",
      goals: ["Fitness", "Energy", "Mood"],
      icon: "👟",
      metrics: ["Steps", "Energy Level", "Mood", "Sleep Quality"],
      protocol: "Achieve 10,000+ steps daily through walking or other activities",
    },
    {
      id: 6,
      name: "Blue Light Blocking",
      description: "Wear blue light blocking glasses 2 hours before bed",
      category: "Sleep",
      duration: "21 days",
      difficulty: "Easy",
      goals: ["Sleep", "Recovery"],
      icon: "🕶️",
      metrics: ["Sleep Quality", "Sleep Duration", "Morning Energy"],
      protocol: "Wear blue light blocking glasses from 8 PM until bedtime",
    },
    {
      id: 7,
      name: "Wim Hof Breathing",
      description: "Practice controlled breathing exercises for stress and energy",
      category: "Recovery",
      duration: "21 days",
      difficulty: "Medium",
      goals: ["Stress", "Energy", "Focus"],
      icon: "💨",
      metrics: ["Stress Level", "Energy Level", "Focus", "Mood"],
      protocol: "3 rounds of 30 breaths followed by breath holds, daily",
    },
    {
      id: 8,
      name: "Gratitude Journaling",
      description: "Write down 3 things you're grateful for each day",
      category: "Mental",
      duration: "30 days",
      difficulty: "Easy",
      goals: ["Mood", "Stress"],
      icon: "📝",
      metrics: ["Mood", "Stress Level", "Sleep Quality"],
      protocol: "Write 3 specific things you're grateful for before bed",
    },
  ]

  const categories = ["All", "Sleep", "Nutrition", "Movement", "Mental", "Recovery"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTemplates = experimentTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sleep":
        return <Clock className="h-4 w-4" />
      case "Nutrition":
        return <Target className="h-4 w-4" />
      case "Movement":
        return <Dumbbell className="h-4 w-4" />
      case "Mental":
        return <Brain className="h-4 w-4" />
      case "Recovery":
        return <Heart className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Experiment Library</h1>
        <p className="text-gray-600 mt-2">Discover proven biohacking protocols and health experiments</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                {category !== "All" && getCategoryIcon(category)}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTemplates.length} experiment{filteredTemplates.length !== 1 ? "s" : ""}
      </div>

      {/* Experiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryIcon(template.category)}
                      <span className="text-sm text-gray-600">{template.category}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
              </div>
              <CardDescription className="mt-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{template.duration}</span>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Goals:</span>
                <div className="flex flex-wrap gap-1">
                  {template.goals.map((goal) => (
                    <Badge key={goal} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Metrics Tracked:</span>
                <div className="flex flex-wrap gap-1">
                  {template.metrics.slice(0, 3).map((metric) => (
                    <Badge key={metric} variant="secondary" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                  {template.metrics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.metrics.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Protocol:</span>
                <p className="text-xs text-gray-600 line-clamp-2">{template.protocol}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  Try This
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No experiments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Popular Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Categories</CardTitle>
          <CardDescription>Explore experiments by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(1).map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)}
                <span className="text-sm">{category}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
