import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar } from "lucide-react"
import Link from "next/link"

export default function ExperimentsPage() {
  const experiments = [
    {
      id: 1,
      name: "Cold Shower Protocol",
      status: "active",
      progress: 65,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      hypothesis: "Cold showers will improve energy and mood",
      metrics: ["Energy", "Mood", "Sleep Quality"],
    },
    {
      id: 2,
      name: "No Caffeine After 2PM",
      status: "active",
      progress: 80,
      startDate: "2024-01-20",
      endDate: "2024-02-05",
      hypothesis: "Avoiding late caffeine will improve sleep quality",
      metrics: ["Sleep Quality", "Sleep Duration", "Morning Energy"],
    },
    {
      id: 3,
      name: "Morning Meditation",
      status: "active",
      progress: 45,
      startDate: "2024-01-10",
      endDate: "2024-02-25",
      hypothesis: "10 minutes of morning meditation will reduce stress",
      metrics: ["Stress Level", "Focus", "Mood"],
    },
    {
      id: 4,
      name: "Intermittent Fasting 16:8",
      status: "completed",
      progress: 100,
      startDate: "2023-12-01",
      endDate: "2024-01-01",
      hypothesis: "IF will improve energy and weight management",
      metrics: ["Weight", "Energy", "Hunger Levels"],
    },
  ]

  const activeExperiments = experiments.filter((exp) => exp.status === "active")
  const completedExperiments = experiments.filter((exp) => exp.status === "completed")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
          <p className="text-gray-600 mt-2">Manage your health experiments and protocols</p>
        </div>
        <Link href="/experiments/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Experiment
          </Button>
        </Link>
      </div>

      {/* Active Experiments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Active Experiments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeExperiments.map((experiment) => (
            <Card key={experiment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{experiment.name}</CardTitle>
                  <Badge variant="default">Active</Badge>
                </div>
                <CardDescription className="text-sm">{experiment.hypothesis}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{experiment.progress}%</span>
                  </div>
                  <Progress value={experiment.progress} className="h-2" />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {experiment.startDate} - {experiment.endDate}
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Tracking:</span>
                  <div className="flex flex-wrap gap-1">
                    {experiment.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Log Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Experiments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Completed Experiments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedExperiments.map((experiment) => (
            <Card key={experiment.id} className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{experiment.name}</CardTitle>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <CardDescription className="text-sm">{experiment.hypothesis}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {experiment.startDate} - {experiment.endDate}
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Tracked:</span>
                  <div className="flex flex-wrap gap-1">
                    {experiment.metrics.map((metric) => (
                      <Badge key={metric} variant="outline" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Results
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
