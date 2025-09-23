"use client"

import { useState } from "react"
import { GraduationCap } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useLanguage } from "@/components/language-context"
import LanguageSelector from "@/components/language-selector"
import RoleSignupForm from "@/components/role-signup-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { SignupData } from "@/components/auth-context"

export default function SignupPage() {
  const { signup, user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    router.push(`/dashboard/${user.role}`)
    return null
  }

  const handleSignup = async (data: SignupData) => {
    setIsLoading(true)
    const success = await signup(data)
    if (!success) {
      alert("Signup failed. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-border/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-90">EduNova</h1>
                <p className="text-sm text-gray-600">The Future Classroom</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <RoleSignupForm onSubmit={handleSignup} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
