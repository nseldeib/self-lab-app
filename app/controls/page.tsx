"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  FlaskConical,
  Calendar,
  TrendingUp,
  BookOpen,
  LogIn,
  UserPlus,
  KeyRound,
  Settings,
  ArrowLeft,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react"

interface PageInfo {
  name: string
  path: string
  description: string
  status: "public" | "protected" | "auth-only"
  icon: React.ComponentType<any>
  subPages?: PageInfo[]
}

export default function ControlsPage() {
  const router = useRouter()
  const [showPaths, setShowPaths] = useState(false)

  const pages: PageInfo[] = [
    {
      name: "Dashboard",
      path: "/",
      description: "Main dashboard with stats, active experiments, and quick actions",
      status: "protected",
      icon: Home,
    },
    {
      name: "Experiments",
      path: "/experiments",
      description: "View and manage all your experiments",
      status: "protected",
      icon: FlaskConical,
      subPages: [
        {
          name: "New Experiment",
          path: "/experiments/new",
          description: "Create a new experiment from templates or custom setup",
          status: "protected",
          icon: FlaskConical,
        },
      ],
    },
    {
      name: "Log",
      path: "/log",
      description: "Daily logging interface for tracking experiment data",
      status: "protected",
      icon: Calendar,
    },
    {
      name: "Insights",
      path: "/insights",
      description: "Analytics and insights from your experiment data",
      status: "protected",
      icon: TrendingUp,
    },
    {
      name: "Library",
      path: "/library",
      description: "Browse and explore experiment templates",
      status: "protected",
      icon: BookOpen,
    },
    {
      name: "Authentication",
      path: "/auth",
      description: "Authentication pages and flows",
      status: "public",
      icon: LogIn,
      subPages: [
        {
          name: "Sign In",
          path: "/auth/signin",
          description: "User login page with demo account option",
          status: "auth-only",
          icon: LogIn,
        },
        {
          name: "Sign Up",
          path: "/auth/signup",
          description: "User registration page with password validation",
          status: "auth-only",
          icon: UserPlus,
        },
        {
          name: "Forgot Password",
          path: "/auth/forgot-password",
          description: "Password reset page (demo mode)",
          status: "auth-only",
          icon: KeyRound,
        },
        {
          name: "Auth Callback",
          path: "/auth/callback",
          description: "Authentication callback handler",
          status: "public",
          icon: Settings,
        },
      ],
    },
    {
      name: "Controls",
      path: "/controls",
      description: "This page - app structure overview and navigation",
      status: "protected",
      icon: Settings,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "public":
        return "bg-green-100 text-green-800 border-green-200"
      case "protected":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "auth-only":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalPages = pages.reduce((acc, page) => {
    return acc + 1 + (page.subPages?.length || 0)
  }, 0)

  const mainRoutes = pages.filter((page) => !page.subPages || page.subPages.length === 0).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">App Controls</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">SelfLab App Structure</h2>
          <p className="text-gray-600 mb-6">
            Complete overview of all pages and navigation routes in your biohacking tracker.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
                <p className="text-sm text-gray-600">Total Pages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{mainRoutes}</div>
                <p className="text-sm text-gray-600">Main Routes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {pages.filter((p) => p.subPages?.length).length}
                </div>
                <p className="text-sm text-gray-600">With Sub-pages</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor("public")}>Public</Badge>
              <Badge className={getStatusColor("protected")}>Protected</Badge>
              <Badge className={getStatusColor("auth-only")}>Auth Only</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaths(!showPaths)}
              className="flex items-center space-x-2"
            >
              {showPaths ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPaths ? "Hide" : "Show"} Paths</span>
            </Button>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {pages.map((page) => (
            <Card key={page.path} className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <page.icon className="h-5 w-5" />
                    <span>{page.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(page.status)}>{page.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => router.push(page.path)} className="h-8">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
                <CardDescription>{page.description}</CardDescription>
                {showPaths && <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{page.path}</code>}
              </CardHeader>
              {page.subPages && page.subPages.length > 0 && (
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sub-pages:</h4>
                    {page.subPages.map((subPage) => (
                      <div key={subPage.path} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <subPage.icon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-sm">{subPage.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(subPage.status)} text-xs`}>{subPage.status}</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(subPage.path)}
                              className="h-6 text-xs"
                            >
                              <ExternalLink className="h-2 w-2 mr-1" />
                              Visit
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{subPage.description}</p>
                        {showPaths && (
                          <code className="text-xs bg-white px-2 py-1 rounded font-mono border">{subPage.path}</code>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>Jump to commonly used pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={() => router.push("/")} variant="outline" className="h-16 flex-col space-y-1">
                <Home className="h-5 w-5" />
                <span className="text-xs">Dashboard</span>
              </Button>
              <Button
                onClick={() => router.push("/experiments/new")}
                variant="outline"
                className="h-16 flex-col space-y-1"
              >
                <FlaskConical className="h-5 w-5" />
                <span className="text-xs">New Experiment</span>
              </Button>
              <Button onClick={() => router.push("/log")} variant="outline" className="h-16 flex-col space-y-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Log Data</span>
              </Button>
              <Button onClick={() => router.push("/library")} variant="outline" className="h-16 flex-col space-y-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">Templates</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Info */}
        <Card className="mt-6 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-500">
              <p>🧬 SelfLab Biohacking Tracker</p>
              <p className="mt-1">
                Access this page via the subtle "App Controls" button at the bottom of the dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
