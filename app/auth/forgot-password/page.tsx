"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FlaskConical, Loader2, Mail, ArrowLeft, Info, User } from "lucide-react"
import { resetPassword, loginDemoAccount } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = resetPassword(email)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred while processing your request")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const result = loginDemoAccount()
      if (result.success) {
        router.push("/")
      }
    } catch (err) {
      setError("Failed to access demo account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <FlaskConical className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Password Reset</span>
            </CardTitle>
            <CardDescription>
              {success ? "Check your email for reset instructions" : "We'll help you get back into your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Mode:</strong> This is a demonstration app. Password reset emails are not actually sent.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    Password reset instructions have been sent to <strong>{email}</strong>
                  </AlertDescription>
                </Alert>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>Please check your email and follow the instructions to reset your password.</p>
                  <p>If you don't see the email, check your spam folder.</p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                  >
                    Try different email
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleDemoLogin}
                    disabled={loading}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Try Demo Account Instead
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send reset instructions
                    </>
                  )}
                </Button>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Alternative options</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleDemoLogin}
                      disabled={loading}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Try Demo Account
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/signin" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to sign in
              </Link>
              <div>
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link href="/auth/signup" className="text-sm font-medium text-blue-600 hover:text-blue-500">
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
