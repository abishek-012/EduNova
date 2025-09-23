"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, getTranslation } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load language from localStorage or browser preference
    const savedLanguage = localStorage.getItem("edunova-language") as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    } else {
      // Detect browser language and set appropriate default
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("hi")) {
        setLanguageState("hi")
      } else {
        setLanguageState("en")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("edunova-language", lang)
    // Update document direction for RTL languages if needed
    document.documentElement.dir = ["ar", "he"].includes(lang) ? "rtl" : "ltr"
  }

  const t = (key: string) => getTranslation(language, key)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
