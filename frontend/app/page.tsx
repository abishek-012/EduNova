"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useLanguage } from "@/components/language-context"
import LanguageSelector from "@/components/language-selector"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const { login, user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [loginForm, setLoginForm] = useState({ email: "", password: "", role: "" })
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    router.push(`/dashboard/${user.role}`)
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginForm.role) {
      alert("Please select your role")
      return
    }
    setIsLoading(true)
    const success = await login(loginForm.email, loginForm.password)
    if (!success) {
      alert("Invalid credentials. Try admin@edunova.com / password")
    }
    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-screen h-screen object-cover z-0"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      

      {/* Header */}
      <header className="relative z-20 border-b border-border/20 bg-emerald-300/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white dark:text-white">EduNova</h1>
                <p className="text-sm text-gray-400 dark:text-gray-300">The Future Classroom</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="border-4 shadow-2xl bg-gradient from-emerald-300 to-emerald-900 dark:from-gray-900/90 dark:to-emerald-900/85 backdrop-blur-lg ring-1 ring-emerald-200/50 dark:ring-emerald-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(16,185,129,0.12)] hover:scale-[1.02] hover:ring-emerald-300/60 dark:hover:ring-emerald-400/50">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-white mb-2">Sign In</CardTitle>
              <CardDescription className="text-white/90">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white font-medium">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="h-12 text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white font-medium">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="h-12 text-white border-gray-300 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-select" className="text-white font-medium">
                    Role
                  </Label>
                  <Select value={loginForm.role} onValueChange={(value) => setLoginForm({ ...loginForm, role: value })}>
                    <SelectTrigger className="h-12 text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-900 to-emerald-600 hover:from-emerald-600 hover:to-emerald-900 dark:from-gray-700 dark:to-slate-700 dark:hover:from-gray-600 dark:hover:to-slate-600 text-white font-semibold text-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-400 hover:scale-105 ring-1 ring-gray-600/50 hover:ring-gray-500/70"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-white font-medium">
                  Need an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Contact your administrator
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
