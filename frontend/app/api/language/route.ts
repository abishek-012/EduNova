import { type NextRequest, NextResponse } from "next/server"
import type { Language } from "@/lib/i18n"

export async function POST(request: NextRequest) {
  try {
    const { language } = await request.json()

    // Validate language
    const validLanguages: Language[] = ["en", "hi", "sat", "ho", "kha", "mun"]
    if (!validLanguages.includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 })
    }

    // In a real application, you might want to:
    // 1. Save user language preference to database
    // 2. Update user profile
    // 3. Set cookies for server-side rendering

    const response = NextResponse.json({
      success: true,
      language,
      message: "Language updated successfully",
    })

    // Set language cookie for server-side rendering
    response.cookies.set("edunova-language", language, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const language = request.cookies.get("edunova-language")?.value || "en"

    return NextResponse.json({
      language,
      availableLanguages: ["en", "hi", "sat", "ho", "kha", "mun"],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get language" }, { status: 500 })
  }
}
