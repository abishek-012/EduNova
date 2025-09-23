"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserRole, SignupData } from "@/components/auth-context"
import { useLanguage } from "@/components/language-context"
import { Users, Mail, Phone, Clock } from "lucide-react"

interface RoleSignupFormProps {
  onSubmit: (data: SignupData) => Promise<void>
  isLoading: boolean
}

export default function RoleSignupForm({ onSubmit, isLoading }: RoleSignupFormProps) {
  const { t } = useLanguage()
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Contact The Administrator
        </CardTitle>
        <CardDescription>
          <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setSelectedRole("")}>
            ← Back
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 text-center">
          {/* Email Contact */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
              <p className="text-sm text-primary font-mono">admin@edunova.com</p>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Phone</p>
              <p className="text-sm text-primary font-mono">+91 5555500000</p>
            </div>
          </div>

          {/* Visit Hours */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Visiting Hours</p>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Admin Block<br />
                Weekdays: 9AM - 4PM
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-xs text-muted-foreground">
              Please contact the administrator for account access
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}