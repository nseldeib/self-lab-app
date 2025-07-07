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
import { signIn, createDemoAccount } from "@/lib/storage"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn(email, password)
      if (result.success) {
        router.push("/")
      } else {
        setError(result.error || "Failed to sign in")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccount = async () => {
    setDemoLoading(true)
    setError("")

    try {
      const result = await createDemoAccount()
      if (result.success) {
        router.push("/")
      } else {
        setError("Failed to create demo account")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧬 SelfLab</h1>
          <h2 className="text-xl font-semibold text-gray-700">Welcome back</h2>
          <p className="text-gray-600">Sign in to your biohacking dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <Button
                onClick={handleDemoAccount}
                disabled={demoLoading}
                variant="outline"
                className="w-full mt-4 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                {demoLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating demo account...
                  </>
                ) : (
                  "🚀 Try Demo Account"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
