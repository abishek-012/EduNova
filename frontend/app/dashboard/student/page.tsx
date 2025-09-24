"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import AIAssistant from "@/components/ai-assistant";
import WeeklyTimetable from "@/components/weekly-timetable";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  BarChart3,
  Clock,
  Video,
  LogOut,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface TimetableEntry {
  id: string;
  subject: string;
  time: string;
  room: string;
  teacher: string;
  day: string;
  color: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  description: string;
}

interface Grade {
  subject: string;
  internal1: number;
  internal2: number;
  final: number;
  total: number;
}

interface AttendanceRecord {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
  status: "good" | "warning" | "critical";
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [timetableView, setTimetableView] = useState<"today" | "weekly">(
    "today"
  );

  // Mock data
  const [timetable] = useState<TimetableEntry[]>([
    {
      id: "1",
      subject: "Data Structures",
      time: "09:00 AM",
      room: "Room 101",
      teacher: "Dr. Sarah Johnson",
      day: "Monday",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      id: "2",
      subject: "Algorithms",
      time: "11:00 AM",
      room: "Room 102",
      teacher: "Prof. Michael Chen",
      day: "Monday",
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    },
    {
      id: "3",
      subject: "Database Systems",
      time: "02:00 PM",
      room: "Lab 201",
      teacher: "Dr. Emily Davis",
      day: "Monday",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Binary Tree Implementation",
      subject: "Data Structures",
      dueDate: "2024-01-15",
      status: "pending",
      description:
        "Implement a binary search tree with insertion, deletion, and traversal operations.",
    },
    {
      id: "2",
      title: "Sorting Algorithms Analysis",
      subject: "Algorithms",
      dueDate: "2024-01-18",
      status: "submitted",
      description: "Compare the performance of different sorting algorithms.",
    },
    {
      id: "3",
      title: "Database Design Project",
      subject: "Database Systems",
      dueDate: "2024-01-10",
      status: "graded",
      grade: "A",
      description:
        "Design a complete database schema for an e-commerce application.",
    },
  ]);

  const [grades] = useState<Grade[]>([
    {
      subject: "Data Structures",
      internal1: 85,
      internal2: 88,
      final: 92,
      total: 88,
    },
    {
      subject: "Algorithms",
      internal1: 78,
      internal2: 82,
      final: 85,
      total: 82,
    },
    {
      subject: "Database Systems",
      internal1: 90,
      internal2: 87,
      final: 89,
      total: 89,
    },
  ]);

  const [attendance] = useState<AttendanceRecord[]>([
    {
      subject: "Data Structures",
      attended: 42,
      total: 45,
      percentage: 93,
      status: "good",
    },
    {
      subject: "Algorithms",
      attended: 38,
      total: 42,
      percentage: 90,
      status: "good",
    },
    {
      subject: "Database Systems",
      attended: 28,
      total: 38,
      percentage: 74,
      status: "warning",
    },
  ]);

  const [submissionText, setSubmissionText] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
    null
  );

  if (!user || user.role !== "student") {
    router.push("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const submitAssignment = (assignmentId: string) => {
    // TODO: Implement assignment submission
    alert("Assignment submitted successfully!");
    setSubmissionText("");
    setSelectedAssignment(null);
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-emerald-600";
      case "warning":
        return "text-amber-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  EduNova
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors"
              >
                Student
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/calendar")}
                className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 hover:from-blue-700 hover:to-indigo-700 hover:border-blue-700 shadow-md"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/lms")}
                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                LMS
              </Button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600">
                  {user.class} • {user.batch}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Today's Classes
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {timetable.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Scheduled today</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Pending Assignments
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {assignments.filter((a) => a.status === "pending").length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Due soon</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Average Grade
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(
                  grades.reduce((acc, grade) => acc + grade.total, 0) /
                    grades.length
                )}
                %
              </div>
              <p className="text-sm text-gray-500 mt-1">Overall performance</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Overall Attendance
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(
                  attendance.reduce(
                    (acc, record) => acc + record.percentage,
                    0
                  ) / attendance.length
                )}
                %
              </div>
              <p className="text-sm text-gray-500 mt-1">Attendance rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="timetable" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm rounded-xl p-1">
            <TabsTrigger
              value="timetable"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Timetable
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Assignments
            </TabsTrigger>
            <TabsTrigger
              value="grades"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Grades
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="materials"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Materials
            </TabsTrigger>
            <TabsTrigger
              value="ai-assistant"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* Timetable Tab */}
          <TabsContent value="timetable" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant={timetableView === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimetableView("today")}
                className={
                  timetableView === "today"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                    : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
                }
              >
                Today's Schedule
              </Button>
              <Button
                variant={timetableView === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimetableView("weekly")}
                className={
                  timetableView === "weekly"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                    : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
                }
              >
                Weekly View
              </Button>
            </div>

            {timetableView === "today" ? (
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    Today's Schedule
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your classes for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {timetable.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-5 p-5 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div
                          className={`w-1.5 h-20 ${entry.color} rounded-full shadow-sm`}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg text-gray-900">
                              {entry.subject}
                            </h4>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1"
                            >
                              {entry.time}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium">{entry.room}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{entry.teacher}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200 hover:border-emerald-300 transition-all duration-200"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Live
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                <WeeklyTimetable
                  userRole="student"
                  userBatch={user?.class}
                  userName={user?.name}
                />
              </div>
            )}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-8">
            <div className="grid gap-6">
              {assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
                          {assignment.title}
                          {assignment.status === "pending" && (
                            <Badge
                              variant="destructive"
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm"
                            >
                              Due Soon
                            </Badge>
                          )}
                          {assignment.status === "submitted" && (
                            <Badge
                              variant="secondary"
                              className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300"
                            >
                              Submitted
                            </Badge>
                          )}
                          {assignment.status === "graded" && (
                            <Badge
                              variant="default"
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm"
                            >
                              Graded: {assignment.grade}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">
                            {assignment.subject}
                          </span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>Due: {assignment.dueDate}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-gray-700 leading-relaxed">
                      {assignment.description}
                    </p>

                    {assignment.status === "pending" && (
                      <div className="space-y-5 p-5 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
                        <div className="space-y-3">
                          <Label
                            htmlFor={`submission-${assignment.id}`}
                            className="text-sm font-semibold text-gray-700"
                          >
                            Your Submission
                          </Label>
                          <Textarea
                            id={`submission-${assignment.id}`}
                            placeholder="Enter your submission text or paste a link to your work..."
                            value={
                              selectedAssignment === assignment.id
                                ? submissionText
                                : ""
                            }
                            onChange={(e) => {
                              setSubmissionText(e.target.value);
                              setSelectedAssignment(assignment.id);
                            }}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg min-h-[120px] resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => submitAssignment(assignment.id)}
                            disabled={
                              !submissionText &&
                              selectedAssignment === assignment.id
                            }
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Assignment
                          </Button>
                          <Button
                            variant="outline"
                            className="hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </Button>
                        </div>
                      </div>
                    )}

                    {assignment.status === "submitted" && (
                      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <p className="text-blue-800 font-medium">
                          Assignment submitted successfully. Waiting for teacher
                          review.
                        </p>
                      </div>
                    )}

                    {assignment.status === "graded" && (
                      <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                        <p className="text-emerald-800 font-bold mb-2">
                          Grade: {assignment.grade}
                        </p>
                        <p className="text-emerald-700">
                          Great work! Your implementation was well-structured
                          and efficient.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  Academic Performance
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your grades across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {grades.map((grade) => (
                    <div
                      key={grade.subject}
                      className="space-y-4 p-6 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-gray-900">
                          {grade.subject}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-lg px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 font-bold"
                        >
                          {grade.total}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600">
                            Internal 1
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {grade.internal1}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600">
                            Internal 2
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {grade.internal2}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600">
                            Final
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {grade.final}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress
                          value={grade.total}
                          className="h-3 bg-gray-200 rounded-full overflow-hidden"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-300"
                            style={{ width: `${grade.total}%` }}
                          />
                        </Progress>
                        <p className="text-xs text-gray-500 text-right">
                          Overall Score: {grade.total}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  Attendance Record
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Track your attendance across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {attendance.map((record) => (
                    <div
                      key={record.subject}
                      className="flex items-center justify-between p-5 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
                          {getAttendanceIcon(record.status)}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-900">
                            {record.subject}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {record.attended} of {record.total} classes attended
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p
                          className={`text-2xl font-bold ${getAttendanceColor(
                            record.status
                          )}`}
                        >
                          {record.percentage}%
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {record.status === "critical" && "Below minimum"}
                          {record.status === "warning" && "Needs attention"}
                          {record.status === "good" && "Good standing"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  Course Materials
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Access learning materials and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 px-8">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mx-auto mb-6 shadow-lg">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Access Course Materials
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    View lectures, assignments, discussions, and recorded
                    sessions in the Learning Management System.
                  </p>
                  <Button
                    onClick={() => router.push("/lms")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Go to LMS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
              <AIAssistant
                studentData={{
                  name: user.name,
                  class: user.class ?? "",
                  batch: user.batch ?? "",
                  subjects: [
                    "Data Structures",
                    "Algorithms",
                    "Database Systems",
                  ],
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}