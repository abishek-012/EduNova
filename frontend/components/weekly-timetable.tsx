"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react"

interface TimetableEntry {
  id: string
  subject: string
  time: string
  room: string
  teacher: string
  day: string
  color: string
  batch?: string
  students?: number
  code?: string
  type?: "class" | "break" | "lunch"
}

interface WeeklyTimetableProps {
  userRole: "student" | "teacher"
  userBatch?: string
  userName?: string
}

export default function WeeklyTimetable({ userRole, userBatch, userName }: WeeklyTimetableProps) {
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week
  const [viewMode, setViewMode] = useState<"week" | "day">("week")
  const [selectedDay, setSelectedDay] = useState("Monday")

  const weeklySchedule: TimetableEntry[] = [
    // Monday
    {
      id: "mon-1",
      subject: "UEC2504",
      time: "8:00 - 8:45",
      room: "Room 101",
      teacher: "Dr. Sarah Johnson",
      day: "Monday",
      color: "bg-blue-100 text-blue-900 border-blue-200",
      batch: "CSE-A",
      code: "UEC2504",
      type: "class",
    },
    {
      id: "mon-2",
      subject: "UBA2541 KTS",
      time: "8:45 - 9:30",
      room: "Room 102",
      teacher: "Prof. Michael Chen",
      day: "Monday",
      color: "bg-green-100 text-green-900 border-green-200",
      batch: "CSE-A",
      code: "UBA2541",
      type: "class",
    },
    {
      id: "mon-break1",
      subject: "BREAK",
      time: "9:30 - 9:50",
      room: "-",
      teacher: "-",
      day: "Monday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "mon-3",
      subject: "UEC2501 NV",
      time: "9:50 - 10:35",
      room: "Room 103",
      teacher: "Dr. Emily Davis",
      day: "Monday",
      color: "bg-purple-100 text-purple-900 border-purple-200",
      batch: "CSE-A",
      code: "UEC2501",
      type: "class",
    },
    {
      id: "mon-4",
      subject: "UEC2502 SK",
      time: "10:35 - 11:20",
      room: "Room 104",
      teacher: "Prof. Robert Wilson",
      day: "Monday",
      color: "bg-orange-100 text-orange-900 border-orange-200",
      batch: "CSE-A",
      code: "UEC2502",
      type: "class",
    },
    {
      id: "mon-lunch",
      subject: "LUNCH",
      time: "12:05 - 1:05",
      room: "-",
      teacher: "-",
      day: "Monday",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      batch: "CSE-A",
      type: "lunch",
    },
    {
      id: "mon-5",
      subject: "MENTOR",
      time: "12:20 - 1:05",
      room: "Room 105",
      teacher: "Dr. Lisa Anderson",
      day: "Monday",
      color: "bg-indigo-100 text-indigo-900 border-indigo-200",
      batch: "CSE-A",
      code: "MENTOR",
      type: "class",
    },
    {
      id: "mon-6",
      subject: "UEC2502 VV",
      time: "1:05 - 1:50",
      room: "Room 106",
      teacher: "Prof. David Brown",
      day: "Monday",
      color: "bg-red-100 text-red-900 border-red-200",
      batch: "CSE-A",
      code: "UEC2502",
      type: "class",
    },
    {
      id: "mon-break2",
      subject: "BREAK",
      time: "1:50 - 2:10",
      room: "-",
      teacher: "-",
      day: "Monday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "mon-7",
      subject: "UEC2503 LIBRARY",
      time: "2:10 - 2:55",
      room: "Library",
      teacher: "Librarian",
      day: "Monday",
      color: "bg-teal-100 text-teal-900 border-teal-200",
      batch: "CSE-A",
      code: "UEC2503",
      type: "class",
    },
    {
      id: "mon-8",
      subject: "UEC2H23 RR",
      time: "2:55 - 3:40",
      room: "Room 107",
      teacher: "Dr. Maria Garcia",
      day: "Monday",
      color: "bg-pink-100 text-pink-900 border-pink-200",
      batch: "CSE-A",
      code: "UEC2H23",
      type: "class",
    },

    // Tuesday
    {
      id: "tue-1",
      subject: "UEC2503 NP",
      time: "8:00 - 8:45",
      room: "Room 101",
      teacher: "Dr. Sarah Johnson",
      day: "Tuesday",
      color: "bg-blue-100 text-blue-900 border-blue-200",
      batch: "CSE-A",
      code: "UEC2503",
      type: "class",
    },
    {
      id: "tue-2",
      subject: "UEC2512 VV/SB & UEC2511 CA/SK/BP",
      time: "8:45 - 12:05",
      room: "Lab 201",
      teacher: "Multiple",
      day: "Tuesday",
      color: "bg-green-100 text-green-900 border-green-200",
      batch: "CSE-A",
      code: "UEC2512",
      type: "class",
    },
    {
      id: "tue-lunch",
      subject: "LUNCH",
      time: "12:05 - 1:05",
      room: "-",
      teacher: "-",
      day: "Tuesday",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      batch: "CSE-A",
      type: "lunch",
    },
    {
      id: "tue-3",
      subject: "UEC2521 RA/ UEC2523 CA",
      time: "12:20 - 1:05",
      room: "Room 102",
      teacher: "Dr. Emily Davis",
      day: "Tuesday",
      color: "bg-purple-100 text-purple-900 border-purple-200",
      batch: "CSE-A",
      code: "UEC2521",
      type: "class",
    },
    {
      id: "tue-4",
      subject: "UEC2504 VV",
      time: "1:05 - 1:50",
      room: "Room 103",
      teacher: "Prof. Robert Wilson",
      day: "Tuesday",
      color: "bg-orange-100 text-orange-900 border-orange-200",
      batch: "CSE-A",
      code: "UEC2504",
      type: "class",
    },
    {
      id: "tue-break",
      subject: "BREAK",
      time: "1:50 - 2:10",
      room: "-",
      teacher: "-",
      day: "Tuesday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "tue-5",
      subject: "ACTIVE LEARNING",
      time: "2:10 - 2:55",
      room: "Room 104",
      teacher: "Various",
      day: "Tuesday",
      color: "bg-indigo-100 text-indigo-900 border-indigo-200",
      batch: "CSE-A",
      code: "ACTIVE LEARNING",
      type: "class",
    },
    {
      id: "tue-6",
      subject: "UEC2H23 RR",
      time: "2:55 - 3:40",
      room: "Room 105",
      teacher: "Dr. Maria Garcia",
      day: "Tuesday",
      color: "bg-pink-100 text-pink-900 border-pink-200",
      batch: "CSE-A",
      code: "UEC2H23",
      type: "class",
    },

    // Wednesday
    {
      id: "wed-1",
      subject: "UEC2501 NV",
      time: "8:00 - 8:45",
      room: "Room 101",
      teacher: "Dr. Sarah Johnson",
      day: "Wednesday",
      color: "bg-blue-100 text-blue-900 border-blue-200",
      batch: "CSE-A",
      code: "UEC2501",
      type: "class",
    },
    {
      id: "wed-2",
      subject: "UEC2504 VV",
      time: "8:45 - 9:30",
      room: "Room 102",
      teacher: "Prof. Michael Chen",
      day: "Wednesday",
      color: "bg-green-100 text-green-900 border-green-200",
      batch: "CSE-A",
      code: "UEC2504",
      type: "class",
    },
    {
      id: "wed-break1",
      subject: "BREAK",
      time: "9:30 - 9:50",
      room: "-",
      teacher: "-",
      day: "Wednesday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "wed-3",
      subject: "UBA2541 KTS",
      time: "9:50 - 10:35",
      room: "Room 103",
      teacher: "Dr. Emily Davis",
      day: "Wednesday",
      color: "bg-purple-100 text-purple-900 border-purple-200",
      batch: "CSE-A",
      code: "UBA2541",
      type: "class",
    },
    {
      id: "wed-4",
      subject: "UEC2501 NV",
      time: "10:35 - 11:20",
      room: "Room 104",
      teacher: "Prof. Robert Wilson",
      day: "Wednesday",
      color: "bg-orange-100 text-orange-900 border-orange-200",
      batch: "CSE-A",
      code: "UEC2501",
      type: "class",
    },
    {
      id: "wed-lunch",
      subject: "LUNCH",
      time: "12:05 - 1:05",
      room: "-",
      teacher: "-",
      day: "Wednesday",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      batch: "CSE-A",
      type: "lunch",
    },
    {
      id: "wed-5",
      subject: "UEC2512 VV/SB & UEC2511 CA/SK/BP",
      time: "12:20 - 4:00",
      room: "Lab 201",
      teacher: "Multiple",
      day: "Wednesday",
      color: "bg-indigo-100 text-indigo-900 border-indigo-200",
      batch: "CSE-A",
      code: "UEC2512",
      type: "class",
    },
    {
      id: "wed-6",
      subject: "UEC2H61 SAN",
      time: "2:55 - 3:40",
      room: "Room 106",
      teacher: "Dr. James Taylor",
      day: "Wednesday",
      color: "bg-red-100 text-red-900 border-red-200",
      batch: "CSE-A",
      code: "UEC2H61",
      type: "class",
    },

    // Thursday
    {
      id: "thu-1",
      subject: "UEC2521 RA/ UEC2523 CA",
      time: "8:00 - 8:45",
      room: "Room 101",
      teacher: "Dr. Sarah Johnson",
      day: "Thursday",
      color: "bg-blue-100 text-blue-900 border-blue-200",
      batch: "CSE-A",
      code: "UEC2521",
      type: "class",
    },
    {
      id: "thu-2",
      subject: "UEC2502 SK",
      time: "8:45 - 9:30",
      room: "Room 102",
      teacher: "Prof. Michael Chen",
      day: "Thursday",
      color: "bg-green-100 text-green-900 border-green-200",
      batch: "CSE-A",
      code: "UEC2502",
      type: "class",
    },
    {
      id: "thu-break1",
      subject: "BREAK",
      time: "9:30 - 9:50",
      room: "-",
      teacher: "-",
      day: "Thursday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "thu-3",
      subject: "UEC2503 NP",
      time: "9:50 - 10:35",
      room: "Room 103",
      teacher: "Dr. Emily Davis",
      day: "Thursday",
      color: "bg-purple-100 text-purple-900 border-purple-200",
      batch: "CSE-A",
      code: "UEC2503",
      type: "class",
    },
    {
      id: "thu-4",
      subject: "UBA2541 KTS",
      time: "10:35 - 11:20",
      room: "Room 104",
      teacher: "Prof. Robert Wilson",
      day: "Thursday",
      color: "bg-orange-100 text-orange-900 border-orange-200",
      batch: "CSE-A",
      code: "UBA2541",
      type: "class",
    },
    {
      id: "thu-lunch",
      subject: "LUNCH",
      time: "12:05 - 1:05",
      room: "-",
      teacher: "-",
      day: "Thursday",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      batch: "CSE-A",
      type: "lunch",
    },
    {
      id: "thu-5",
      subject: "UEC2503 NP",
      time: "12:20 - 1:05",
      room: "Room 105",
      teacher: "Dr. Lisa Anderson",
      day: "Thursday",
      color: "bg-indigo-100 text-indigo-900 border-indigo-200",
      batch: "CSE-A",
      code: "UEC2503",
      type: "class",
    },
    {
      id: "thu-break2",
      subject: "BREAK",
      time: "1:50 - 2:10",
      room: "-",
      teacher: "-",
      day: "Thursday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "thu-6",
      subject: "TECH CLUB/ UEC2H61 SAN",
      time: "2:10 - 2:55",
      room: "Room 106",
      teacher: "Various",
      day: "Thursday",
      color: "bg-teal-100 text-teal-900 border-teal-200",
      batch: "CSE-A",
      code: "TECH CLUB",
      type: "class",
    },

    // Friday
    {
      id: "fri-1",
      subject: "UEC2502 SK",
      time: "8:00 - 8:45",
      room: "Room 101",
      teacher: "Dr. Sarah Johnson",
      day: "Friday",
      color: "bg-blue-100 text-blue-900 border-blue-200",
      batch: "CSE-A",
      code: "UEC2502",
      type: "class",
    },
    {
      id: "fri-2",
      subject: "UEC2504 VV",
      time: "8:45 - 9:30",
      room: "Room 102",
      teacher: "Prof. Michael Chen",
      day: "Friday",
      color: "bg-green-100 text-green-900 border-green-200",
      batch: "CSE-A",
      code: "UEC2504",
      type: "class",
    },
    {
      id: "fri-break1",
      subject: "BREAK",
      time: "9:30 - 9:50",
      room: "-",
      teacher: "-",
      day: "Friday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "fri-3",
      subject: "UEC2521 RA/ UEC2523 CA",
      time: "9:50 - 10:35",
      room: "Room 103",
      teacher: "Dr. Emily Davis",
      day: "Friday",
      color: "bg-purple-100 text-purple-900 border-purple-200",
      batch: "CSE-A",
      code: "UEC2521",
      type: "class",
    },
    {
      id: "fri-4",
      subject: "SEMINAR/ UEC2H61 SAN",
      time: "10:35 - 11:20",
      room: "Auditorium",
      teacher: "Various",
      day: "Friday",
      color: "bg-orange-100 text-orange-900 border-orange-200",
      batch: "CSE-A",
      code: "SEMINAR",
      type: "class",
    },
    {
      id: "fri-lunch",
      subject: "LUNCH",
      time: "12:05 - 1:05",
      room: "-",
      teacher: "-",
      day: "Friday",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      batch: "CSE-A",
      type: "lunch",
    },
    {
      id: "fri-5",
      subject: "UEC2521 RA/ UEC2523 CA",
      time: "12:20 - 1:05",
      room: "Room 105",
      teacher: "Dr. Lisa Anderson",
      day: "Friday",
      color: "bg-indigo-100 text-indigo-900 border-indigo-200",
      batch: "CSE-A",
      code: "UEC2521",
      type: "class",
    },
    {
      id: "fri-6",
      subject: "UEC2501 NV",
      time: "1:05 - 1:50",
      room: "Room 106",
      teacher: "Prof. David Brown",
      day: "Friday",
      color: "bg-red-100 text-red-900 border-red-200",
      batch: "CSE-A",
      code: "UEC2501",
      type: "class",
    },
    {
      id: "fri-break2",
      subject: "BREAK",
      time: "1:50 - 2:10",
      room: "-",
      teacher: "-",
      day: "Friday",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      batch: "CSE-A",
      type: "break",
    },
    {
      id: "fri-7",
      subject: "UEC2H23 RR",
      time: "2:55 - 3:40",
      room: "Room 107",
      teacher: "Dr. Maria Garcia",
      day: "Friday",
      color: "bg-pink-100 text-pink-900 border-pink-200",
      batch: "CSE-A",
      code: "UEC2H23",
      type: "class",
    },
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = [
    "8:00 - 8:45",
    "8:45 - 9:30",
    "9:30 - 9:50",
    "9:50 - 10:35",
    "10:35 - 11:20",
    "12:05 - 1:05",
    "12:20 - 1:05",
    "1:05 - 1:50",
    "1:50 - 2:10",
    "2:10 - 2:55",
    "2:55 - 3:40",
  ]

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    const weekStart = new Date(currentWeekStart.setDate(currentWeekStart.getDate() + weekOffset * 7))

    return days.map((_, index) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + index)
      return date
    })
  }

  const weekDates = getWeekDates(selectedWeek)

  const getClassesForDayAndTime = (day: string, time: string) => {
    return weeklySchedule.filter(
      (entry) =>
        entry.day === day &&
        entry.time === time &&
        (userRole === "teacher" ? entry.teacher === userName : entry.batch === userBatch),
    )
  }

  const getClassesForDay = (day: string) => {
    return weeklySchedule
      .filter(
        (entry) =>
          entry.day === day && (userRole === "teacher" ? entry.teacher === userName : entry.batch === userBatch),
      )
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getWeekTitle = () => {
    if (selectedWeek === 0) return "This Week"
    if (selectedWeek === -1) return "Last Week"
    if (selectedWeek === 1) return "Next Week"
    return `Week ${selectedWeek > 0 ? "+" : ""}${selectedWeek}`
  }

  const dayClasses = getClassesForDay(selectedDay)
  const dayDate = weekDates[days.indexOf(selectedDay)]

  if (viewMode === "day") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedDay} Schedule
              </CardTitle>
              <CardDescription>
                {formatDate(dayDate)} • {getWeekTitle()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setViewMode("week")}>
                Week View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dayClasses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No classes scheduled for {selectedDay}</div>
            ) : (
              dayClasses.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 ${entry.color}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{entry.subject}</h4>
                      <Badge variant="outline">{entry.time}</Badge>
                    </div>
                    {entry.type !== "break" && entry.type !== "lunch" && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entry.room}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {userRole === "student" ? entry.teacher : `${entry.students} students`}
                        </div>
                        {userRole === "teacher" && <Badge variant="secondary">{entry.batch}</Badge>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Timetable
            </CardTitle>
            <CardDescription>
              {getWeekTitle()} • {formatDate(weekDates[0])} - {formatDate(weekDates[4])}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedWeek(selectedWeek - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedWeek(0)} disabled={selectedWeek === 0}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedWeek(selectedWeek + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("day")}>
              Day View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1200px] text-sm">
            <thead>
              <tr>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center w-20">
                  DAY
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  I<br />
                  8:00 - 8:45
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  II
                  <br />
                  8:45 - 9:30
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center w-16">
                  BREAK
                  <br />
                  9:30 - 9:50
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  III
                  <br />
                  9:50 - 10:35
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  IV
                  <br />
                  10:35 - 11:20
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center w-16">
                  LUNCH
                  <br />
                  12:05 - 1:05
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  V<br />
                  12:20 - 1:05
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  VI
                  <br />
                  1:05 - 1:50
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center w-16">
                  BREAK
                  <br />
                  1:50 - 2:10
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  VII
                  <br />
                  2:10 - 2:55
                </th>
                <th className="border-2 border-gray-800 p-2 bg-gray-100 dark:bg-gray-800 font-bold text-center">
                  VIII
                  <br />
                  2:55 - 3:40
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className="border-2 border-gray-800 p-2 font-bold bg-gray-50 dark:bg-gray-900 text-center">
                    {day.substring(0, 3).toUpperCase()}
                  </td>
                  {timeSlots.map((time) => {
                    const classes = getClassesForDayAndTime(day, time)
                    const isBreakOrLunch = time === "9:30 - 9:50" || time === "12:05 - 1:05" || time === "1:50 - 2:10"

                    return (
                      <td
                        key={`${day}-${time}`}
                        className={`border-2 border-gray-800 p-1 h-16 align-top text-center ${isBreakOrLunch ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                      >
                        {classes.length > 0 ? (
                          <div className="space-y-1">
                            {classes.map((entry) => (
                              <div key={entry.id} className={`${entry.color} p-1 rounded text-xs font-medium border`}>
                                {entry.type === "break" || entry.type === "lunch" ? (
                                  <div className="font-bold">{entry.subject}</div>
                                ) : (
                                  <>
                                    <div className="font-bold">{entry.code || entry.subject}</div>
                                    {entry.teacher !== "Multiple" &&
                                      entry.teacher !== "Various" &&
                                      entry.teacher !== "-" && (
                                        <div className="text-xs">{entry.teacher.split(" ").pop()}</div>
                                      )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : isBreakOrLunch ? (
                          <div className="font-bold text-gray-600 dark:text-gray-400">
                            {time === "9:30 - 9:50" || time === "1:50 - 2:10" ? "BREAK" : "LUNCH"}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">-</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
