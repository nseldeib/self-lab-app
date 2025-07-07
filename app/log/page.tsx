"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function LogPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [logData, setLogData] = useState({
    sleep: [7],
    mood: [7],
    energy: [7],
    stress: [3],
    weight: "",
    notes: "",
    protocolCompliance: false,
  })

  const activeExperiments = [
    { name: "Cold Shower Protocol", compliance: false },
    { name: "No Caffeine After 2PM", compliance: true },
    { name: "Morning Meditation", compliance: false },
  ]

  const moodEmojis = ["😢", "😞", "😐", "😊", "😄", "🤩"]
  const energyColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-500"]

  const handleProtocolToggle = (experimentName: string) => {
    // Handle protocol compliance toggle
    console.log(`Toggled ${experimentName}`)
  }

  const handleSave = () => {
    console.log("Saving log data:", logData)
    // Handle save logic
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Log</h1>
          <p className="text-gray-600 mt-2">Track your daily metrics and experiment progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal min-w-[200px]",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Metrics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Metrics</CardTitle>
              <CardDescription>Your daily health indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sleep */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Sleep Duration</Label>
                  <span className="text-sm font-medium">{logData.sleep[0]}h</span>
                </div>
                <Slider
                  value={logData.sleep}
                  onValueChange={(value) => setLogData((prev) => ({ ...prev, sleep: value }))}
                  max={12}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Mood</Label>
                  <span className="text-lg">{moodEmojis[Math.min(logData.mood[0] - 1, 5)]}</span>
                </div>
                <Slider
                  value={logData.mood}
                  onValueChange={(value) => setLogData((prev) => ({ ...prev, mood: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Energy Level</Label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-3 rounded-full",
                          i < Math.ceil(logData.energy[0] / 2) ? energyColors[i] : "bg-gray-200",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <Slider
                  value={logData.energy}
                  onValueChange={(value) => setLogData((prev) => ({ ...prev, energy: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              {/* Stress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Stress Level</Label>
                  <span className="text-sm font-medium">{logData.stress[0]}/10</span>
                </div>
                <Slider
                  value={logData.stress}
                  onValueChange={(value) => setLogData((prev) => ({ ...prev, stress: value }))}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Calm</span>
                  <span>Very Stressed</span>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (optional)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70.5"
                  value={logData.weight}
                  onChange={(e) => setLogData((prev) => ({ ...prev, weight: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Notes</CardTitle>
              <CardDescription>Any observations or thoughts</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How did you feel today? Any notable events or observations..."
                value={logData.notes}
                onChange={(e) => setLogData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Experiment Compliance */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Compliance</CardTitle>
              <CardDescription>Did you follow your protocols today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeExperiments.map((experiment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{experiment.name}</div>
                    <div className="text-sm text-gray-600">Protocol followed?</div>
                  </div>
                  <Checkbox
                    checked={experiment.compliance}
                    onCheckedChange={() => handleProtocolToggle(experiment.name)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Your progress summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Days logged</span>
                <span className="font-medium">6/7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg sleep</span>
                <span className="font-medium">7.2h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg mood</span>
                <span className="font-medium">7.5/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg energy</span>
                <span className="font-medium">7.8/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Protocol compliance</span>
                <span className="font-medium">85%</span>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Today's Log
          </Button>
        </div>
      </div>
    </div>
  )
}
