"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/storage"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  const protectedRoutes = ["/", "/experiments", "/log", "/insights", "/library"]
  const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"]

  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  const isAuthRoute = authRoutes.includes(pathname)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    if (isProtectedRoute && !currentUser) {
      router.push("/auth/signin")
    } else if (isAuthRoute && currentUser) {
      router.push("/")
    }
  }, [pathname, isProtectedRoute, isAuthRoute, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
