"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { languages, type Language } from "@/lib/i18n"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <Languages className="h-4 w-4 mr-2" />
          {languages[language].nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { name, nativeName }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={language === code ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{nativeName}</span>
              <span className="text-xs text-muted-foreground">{name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
