"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, FlaskConical, Loader2, Check, X } from "lucide-react"
import { registerUser } from "@/lib/storage"

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const result = registerUser(formData.name, formData.email, formData.password)

      if (result.success) {
        router.push("/")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains number", met: /\d/.test(formData.password) },
  ]

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <FlaskConical className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your SelfLab account</h2>
          <p className="mt-2 text-sm text-gray-600">Start tracking your biohacking experiments today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="mt-1 flex items-center space-x-1">
                      {passwordsMatch ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Password requirements:</Label>
                    <div className="grid grid-cols-1 gap-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {req.met ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-xs ${req.met ? "text-green-600" : "text-red-600"}`}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !passwordsMatch || passwordRequirements.some((req) => !req.met)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What you'll get</CardTitle>
              <CardDescription>Powerful tools to track and optimize your health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium">Experiment Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Design and monitor your biohacking experiments with detailed progress tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium">Daily Logging</h4>
                  <p className="text-sm text-gray-600">
                    Record daily metrics like mood, energy, sleep quality, and custom variables.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium">Template Library</h4>
                  <p className="text-sm text-gray-600">
                    Access pre-built experiment templates for common biohacks like cold therapy and fasting.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <h4 className="font-medium">Progress Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Visualize your data with charts and insights to understand what works for you.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Cold Therapy</Badge>
                  <Badge variant="secondary">Intermittent Fasting</Badge>
                  <Badge variant="secondary">Sleep Tracking</Badge>
                  <Badge variant="secondary">Meditation</Badge>
                  <Badge variant="secondary">Exercise</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
