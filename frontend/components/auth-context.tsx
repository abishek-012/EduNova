"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "admin" | "teacher" | "student"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  instituteName?: string
  department?: string
  batch?: string
  class?: string
  employeeId?: string
  studentId?: string
}

interface SignupData {
  role: UserRole
  name: string
  email: string
  password: string
  instituteName?: string
  department?: string
  batch?: string
  class?: string
  employeeId?: string
  studentId?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (data: SignupData) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("edunova-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // Mock authentication logic
      const mockUsers = [
        {
          id: "1",
          name: "John",
          email: "admin@edunova.com",
          role: "admin" as UserRole,
          instituteName: "Tech University",
        },
        {
          id: "2",
          name: "Jane",
          email: "teacher@edunova.com",
          role: "teacher" as UserRole,
          department: "Computer Science",
          employeeId: "EMP001",
        },
        {
          id: "3",
          name: "Bob",
          email: "student@edunova.com",
          role: "student" as UserRole,
          batch: "2024-2028",
          class: "CSE-A",
          studentId: "STU001",
        },
      ]

      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser && password === "password") {
        setUser(foundUser)
        localStorage.setItem("edunova-user", JSON.stringify(foundUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        ...(data.instituteName && { instituteName: data.instituteName }),
        ...(data.department && { department: data.department }),
        ...(data.batch && { batch: data.batch }),
        ...(data.class && { class: data.class }),
        ...(data.employeeId && { employeeId: data.employeeId }),
        ...(data.studentId && { studentId: data.studentId }),
      }

      setUser(newUser)
      localStorage.setItem("edunova-user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("edunova-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { SignupData, UserRole }
