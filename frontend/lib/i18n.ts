export type Language = "en" | "hi" | "sat" | "ho" | "kha" | "mun"

export interface Translation {
  [key: string]: string | Translation
}

export const languages: Record<Language, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  hi: { name: "Hindi", nativeName: "हिंदी" },
  sat: { name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
  ho: { name: "Ho", nativeName: "Ho" },
  kha: { name: "Kharia", nativeName: "Kharia" },
  mun: { name: "Mundari", nativeName: "Mundari" },
}

export const translations: Record<Language, Translation> = {
  en: {
    common: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    auth: {
      welcome: "Welcome to EduNova",
      description: "Comprehensive Educational Management System",
      email: "Email",
      password: "Password",
      name: "Full Name",
      role: "Role",
      institution: "Institution Name",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      forgotPassword: "Forgot Password?",
    },
    dashboard: {
      todaysClasses: "Today's Classes",
      pendingAssignments: "Pending Assignments",
      averageGrade: "Average Grade",
      overallAttendance: "Overall Attendance",
      timetable: "Timetable",
      assignments: "Assignments",
      grades: "Grades",
      attendance: "Attendance",
      materials: "Materials",
      aiAssistant: "AI Assistant",
    },
    roles: {
      admin: "Administrator",
      teacher: "Teacher",
      student: "Student",
    },
  },
  hi: {
    common: {
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",
      dashboard: "डैशबोर्ड",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      save: "सेव करें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
    },
    auth: {
      welcome: "EduNova में आपका स्वागत है",
      description: "व्यापक शैक्षिक प्रबंधन प्रणाली",
      email: "ईमेल",
      password: "पासवर्ड",
      name: "पूरा नाम",
      role: "भूमिका",
      institution: "संस्थान का नाम",
      createAccount: "खाता बनाएं",
      alreadyHaveAccount: "पहले से खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      forgotPassword: "पासवर्ड भूल गए?",
    },
    dashboard: {
      todaysClasses: "आज की कक्षाएं",
      pendingAssignments: "लंबित असाइनमेंट",
      averageGrade: "औसत ग्रेड",
      overallAttendance: "कुल उपस्थिति",
      timetable: "समय सारणी",
      assignments: "असाइनमेंट",
      grades: "ग्रेड",
      attendance: "उपस्थिति",
      materials: "सामग्री",
      aiAssistant: "AI सहायक",
    },
    roles: {
      admin: "प्रशासक",
      teacher: "शिक्षक",
      student: "छात्र",
    },
  },
  sat: {
    common: {
      login: "ᱵᱚᱞᱚ",
      signup: "ᱧᱩᱛᱩᱢ ᱚᱞ",
      logout: "ᱚᱰᱚᱠ",
      dashboard: "ᱢᱩᱬᱩᱛ ᱥᱟᱦᱴᱟ",
      profile: "ᱢᱚᱦᱚᱨ",
      settings: "ᱥᱟᱡᱟᱣ",
      save: "ᱫᱚᱦᱚ",
      cancel: "ᱵᱟᱹᱰᱨᱟᱹ",
      submit: "ᱡᱚᱢᱟ",
      loading: "ᱞᱟᱫᱮ ᱠᱟᱱᱟ...",
      error: "ᱵᱷᱩᱞ",
      success: "ᱠᱟᱹᱢᱤ ᱦᱩᱭ",
    },
    auth: {
      welcome: "EduNova ᱨᱮ ᱡᱚᱦᱟᱨ",
      description: "ᱯᱩᱨᱟᱹ ᱥᱮᱪᱮᱫ ᱪᱟᱞᱟᱣ ᱥᱤᱥᱴᱚᱢ",
      email: "ᱤᱢᱮᱞ",
      password: "ᱫᱟᱱᱟᱝ ᱟᱹᱲᱟᱹ",
      name: "ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ",
      role: "ᱠᱟᱹᱢᱤ",
      institution: "ᱤᱱᱥᱴᱤᱪᱩᱴ ᱧᱩᱛᱩᱢ",
      createAccount: "ᱮᱠᱟᱣᱩᱸᱴ ᱛᱮᱭᱟᱨ",
      alreadyHaveAccount: "ᱮᱠᱟᱣᱩᱸᱴ ᱢᱮᱱᱟᱜ-ᱟ?",
      dontHaveAccount: "ᱮᱠᱟᱣᱩᱸᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ?",
      forgotPassword: "ᱫᱟᱱᱟᱝ ᱟᱹᱲᱟᱹ ᱦᱤᱲᱤᱧ?",
    },
    dashboard: {
      todaysClasses: "ᱛᱮᱦᱮᱧ ᱠᱞᱟᱥ",
      pendingAssignments: "ᱵᱟᱠᱤ ᱠᱟᱹᱢᱤ",
      averageGrade: "ᱢᱚᱬᱮ ᱜᱨᱮᱰ",
      overallAttendance: "ᱡᱚᱛᱚ ᱦᱟᱡᱤᱨᱤ",
      timetable: "ᱚᱠᱛᱚ ᱛᱟᱹᱞᱠᱟᱹ",
      assignments: "ᱠᱟᱹᱢᱤ",
      grades: "ᱜᱨᱮᱰ",
      attendance: "ᱦᱟᱡᱤᱨᱤ",
      materials: "ᱥᱟᱢᱟᱱ",
      aiAssistant: "AI ᱜᱚᱲᱚᱣᱤᱭᱟᱹ",
    },
    roles: {
      admin: "ᱪᱟᱞᱟᱣᱤᱭᱟᱹ",
      teacher: "ᱢᱟᱪᱮᱛ",
      student: "ᱪᱮᱞᱟ",
    },
  },
  ho: {
    common: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    auth: {
      welcome: "EduNova te johar",
      description: "Comprehensive Educational Management System",
      email: "Email",
      password: "Password",
      name: "Full Name",
      role: "Role",
      institution: "Institution Name",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      forgotPassword: "Forgot Password?",
    },
    dashboard: {
      todaysClasses: "Today's Classes",
      pendingAssignments: "Pending Assignments",
      averageGrade: "Average Grade",
      overallAttendance: "Overall Attendance",
      timetable: "Timetable",
      assignments: "Assignments",
      grades: "Grades",
      attendance: "Attendance",
      materials: "Materials",
      aiAssistant: "AI Assistant",
    },
    roles: {
      admin: "Administrator",
      teacher: "Teacher",
      student: "Student",
    },
  },
  kha: {
    common: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    auth: {
      welcome: "EduNova me aayo",
      description: "Comprehensive Educational Management System",
      email: "Email",
      password: "Password",
      name: "Full Name",
      role: "Role",
      institution: "Institution Name",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      forgotPassword: "Forgot Password?",
    },
    dashboard: {
      todaysClasses: "Today's Classes",
      pendingAssignments: "Pending Assignments",
      averageGrade: "Average Grade",
      overallAttendance: "Overall Attendance",
      timetable: "Timetable",
      assignments: "Assignments",
      grades: "Grades",
      attendance: "Attendance",
      materials: "Materials",
      aiAssistant: "AI Assistant",
    },
    roles: {
      admin: "Administrator",
      teacher: "Teacher",
      student: "Student",
    },
  },
  mun: {
    common: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    auth: {
      welcome: "EduNova re johar",
      description: "Comprehensive Educational Management System",
      email: "Email",
      password: "Password",
      name: "Full Name",
      role: "Role",
      institution: "Institution Name",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      forgotPassword: "Forgot Password?",
    },
    dashboard: {
      todaysClasses: "Today's Classes",
      pendingAssignments: "Pending Assignments",
      averageGrade: "Average Grade",
      overallAttendance: "Overall Attendance",
      timetable: "Timetable",
      assignments: "Assignments",
      grades: "Grades",
      attendance: "Attendance",
      materials: "Materials",
      aiAssistant: "AI Assistant",
    },
    roles: {
      admin: "Administrator",
      teacher: "Teacher",
      student: "Student",
    },
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to English if translation not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key if no translation found
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
