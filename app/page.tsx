import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, Plus, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const activeExperiments = [
    { name: "Cold Shower Protocol", progress: 65, daysLeft: 12 },
    { name: "No Caffeine After 2PM", progress: 80, daysLeft: 6 },
    { name: "Morning Meditation", progress: 45, daysLeft: 18 },
  ]

  const todayMetrics = {
    sleep: 7.5,
    mood: 8,
    energy: 7,
    protocolCompliance: true,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back to SelfLab</h1>
          <p className="text-gray-600 mt-2">Track your experiments and optimize your health</p>
        </div>
        <Link href="/experiments/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Experiment
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">2 ending this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">days logging</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Energy</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-gray-600">+0.8 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-600">patterns found</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Log Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Log
            </CardTitle>
            <CardDescription>Quick overview of today's metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sleep</span>
              <Badge variant="secondary">{todayMetrics.sleep}h</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mood</span>
              <Badge variant="secondary">{todayMetrics.mood}/10</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Energy</span>
              <Badge variant="secondary">{todayMetrics.energy}/10</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Protocol Followed</span>
              <Badge variant={todayMetrics.protocolCompliance ? "default" : "destructive"}>
                {todayMetrics.protocolCompliance ? "Yes" : "No"}
              </Badge>
            </div>
            <Link href="/log">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Update Today's Log
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Experiments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Experiments</CardTitle>
            <CardDescription>Your ongoing health experiments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeExperiments.map((experiment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{experiment.name}</span>
                  <span className="text-xs text-gray-600">{experiment.daysLeft} days left</span>
                </div>
                <Progress value={experiment.progress} className="h-2" />
                <div className="text-xs text-gray-600">{experiment.progress}% complete</div>
              </div>
            ))}
            <Link href="/experiments">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Experiments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to keep your experiments on track</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/experiments/new">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Plus className="h-6 w-6" />
                Start New Experiment
              </Button>
            </Link>
            <Link href="/log">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                Log Today's Data
              </Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                View Insights
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
