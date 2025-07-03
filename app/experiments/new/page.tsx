"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewExperimentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [customMetric, setCustomMetric] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    hypothesis: "",
    duration: "",
    variables: [] as string[],
    notes: "",
  })

  const predefinedMetrics = [
    "Sleep Quality",
    "Sleep Duration",
    "Energy Level",
    "Mood",
    "Stress Level",
    "Focus",
    "Weight",
    "Heart Rate",
    "HRV",
    "Blood Pressure",
    "Steps",
    "Exercise Performance",
    "Hunger Level",
    "Cravings",
    "Digestion",
  ]

  const commonVariables = [
    "Diet",
    "Exercise",
    "Sleep Schedule",
    "Supplements",
    "Temperature Exposure",
    "Light Exposure",
    "Meditation",
    "Breathing Exercises",
    "Hydration",
    "Caffeine",
  ]

  const steps = [
    { number: 1, title: "Basic Info", description: "Name and hypothesis" },
    { number: 2, title: "Timeline", description: "Duration and dates" },
    { number: 3, title: "Variables", description: "What you're testing" },
    { number: 4, title: "Metrics", description: "What you'll track" },
    { number: 5, title: "Review", description: "Confirm details" },
  ]

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  const addCustomMetric = () => {
    if (customMetric && !selectedMetrics.includes(customMetric)) {
      setSelectedMetrics((prev) => [...prev, customMetric])
      setCustomMetric("")
    }
  }

  const handleVariableToggle = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      variables: prev.variables.includes(variable)
        ? prev.variables.filter((v) => v !== variable)
        : [...prev.variables, variable],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Experiment</h1>
        <p className="text-gray-600 mt-2">Design your personal health experiment</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
              )}
            >
              {step.number}
            </div>
            <div className="ml-3 hidden sm:block">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4 hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Experiment Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Cold Shower Protocol"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hypothesis">Hypothesis</Label>
                    <Textarea
                      id="hypothesis"
                      placeholder="What do you expect to happen? e.g., Cold showers will improve my energy and mood"
                      value={formData.hypothesis}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hypothesis: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g., 30 days"
                      value={formData.duration}
                      onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label>Variables Being Tested</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonVariables.map((variable) => (
                      <div key={variable} className="flex items-center space-x-2">
                        <Checkbox
                          id={variable}
                          checked={formData.variables.includes(variable)}
                          onCheckedChange={() => handleVariableToggle(variable)}
                        />
                        <Label htmlFor={variable} className="text-sm">
                          {variable}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.variables.map((variable) => (
                      <Badge key={variable} variant="secondary">
                        {variable}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleVariableToggle(variable)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <Label>Metrics to Track</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedMetrics.map((metric) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric}
                          checked={selectedMetrics.includes(metric)}
                          onCheckedChange={() => handleMetricToggle(metric)}
                        />
                        <Label htmlFor={metric} className="text-sm">
                          {metric}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom metric"
                      value={customMetric}
                      onChange={(e) => setCustomMetric(e.target.value)}
                    />
                    <Button onClick={addCustomMetric} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedMetrics.map((metric) => (
                      <Badge key={metric} variant="secondary">
                        {metric}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleMetricToggle(metric)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Experiment Summary</Label>
                    <div className="mt-4 space-y-3">
                      <div>
                        <span className="font-medium">Name:</span> {formData.name}
                      </div>
                      <div>
                        <span className="font-medium">Hypothesis:</span> {formData.hypothesis}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {formData.duration}
                      </div>
                      <div>
                        <span className="font-medium">Timeline:</span>{" "}
                        {startDate ? format(startDate, "PPP") : "Not set"} -{" "}
                        {endDate ? format(endDate, "PPP") : "Not set"}
                      </div>
                      <div>
                        <span className="font-medium">Variables:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.variables.map((variable) => (
                            <Badge key={variable} variant="outline">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Metrics:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMetrics.map((metric) => (
                            <Badge key={metric} variant="outline">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional details or reminders..."
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 5 ? (
                  <Button onClick={() => setCurrentStep((prev) => prev + 1)}>Next</Button>
                ) : (
                  <Button>Create Experiment</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-gray-600">{formData.name || "Not set"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-sm text-gray-600">{formData.duration || "Not set"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Variables ({formData.variables.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.variables.slice(0, 3).map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                  {formData.variables.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{formData.variables.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Metrics ({selectedMetrics.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMetrics.slice(0, 3).map((metric) => (
                    <Badge key={metric} variant="outline" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                  {selectedMetrics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedMetrics.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
