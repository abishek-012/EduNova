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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WeeklyTimetable from "@/components/weekly-timetable";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Users,
  Clock,
  FileText,
  Video,
  LogOut,
  Play,
  Square,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AttendanceSystem from "@/components/attendance-system";

interface Class {
  id: string;
  subject: string;
  time: string;
  room: string;
  students: number;
  batch: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
}

interface LiveSession {
  id: string;
  title: string;
  subject: string;
  scheduledTime: string;
  status: "upcoming" | "live" | "completed";
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [todayClasses] = useState<Class[]>([
    {
      id: "1",
      subject: "Data Structures",
      time: "09:00 AM - 10:00 AM",
      room: "Room 101",
      students: 45,
      batch: "CSE-A",
    },
    {
      id: "2",
      subject: "Algorithms",
      time: "11:00 AM - 12:00 PM",
      room: "Room 102",
      students: 42,
      batch: "CSE-B",
    },
    {
      id: "3",
      subject: "Database Systems",
      time: "02:00 PM - 03:00 PM",
      room: "Lab 201",
      students: 38,
      batch: "CSE-A",
    },
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Binary Tree Implementation",
      subject: "Data Structures",
      dueDate: "2024-01-15",
      submissions: 35,
      totalStudents: 45,
    },
    {
      id: "2",
      title: "Sorting Algorithms Analysis",
      subject: "Algorithms",
      dueDate: "2024-01-18",
      submissions: 28,
      totalStudents: 42,
    },
  ]);

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([
    {
      id: "1",
      title: "Advanced Data Structures Review",
      subject: "Data Structures",
      scheduledTime: "2024-01-12 15:00",
      status: "upcoming",
    },
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
  });

  const [newSession, setNewSession] = useState({
    title: "",
    subject: "",
    date: "",
    time: "",
    description: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState(false);
  const [scheduleView, setScheduleView] = useState<"today" | "weekly">("today");

  if (!user || user.role !== "teacher") {
    router.push("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const createAssignment = () => {
    if (newAssignment.title && newAssignment.subject && newAssignment.dueDate) {
      // TODO: Add to assignments list
      setNewAssignment({
        title: "",
        subject: "",
        description: "",
        dueDate: "",
      });
      alert("Assignment created successfully!");
    }
  };

  const scheduleSession = () => {
    if (
      newSession.title &&
      newSession.subject &&
      newSession.date &&
      newSession.time
    ) {
      const newLiveSession: LiveSession = {
        id: Date.now().toString(),
        title: newSession.title,
        subject: newSession.subject,
        scheduledTime: `${newSession.date} ${newSession.time}`,
        status: "upcoming",
      };
      setLiveSessions([...liveSessions, newLiveSession]);
      setNewSession({
        title: "",
        subject: "",
        date: "",
        time: "",
        description: "",
      });
      alert("Live session scheduled successfully!");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording logic
  };

  const toggleAttendance = () => {
    setAttendanceMode(!attendanceMode);
    // TODO: Implement facial recognition attendance
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  EduNova
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 transition-colors"
              >
                Teacher
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/calendar")}
                className="hidden sm:inline-flex bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 hover:from-emerald-700 hover:to-teal-700 hover:border-emerald-700 shadow-md"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/lms")}
                className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                LMS
              </Button>
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome back,{" "}
                <span className="font-semibold text-gray-900">{user.name}</span>
              </span>
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Today's Classes
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {todayClasses.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Scheduled today</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Active Assignments
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {assignments.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Students
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {todayClasses.reduce((acc, cls) => acc + cls.students, 0)}
              </div>
              <p className="text-sm text-gray-500 mt-1">Under supervision</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Pending Reviews
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {assignments.reduce(
                  (acc, assignment) => acc + assignment.submissions,
                  0
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Submissions to grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedule" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm rounded-xl p-1">
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 font-medium rounded-lg transition-all duration-200"
            >
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 font-medium rounded-lg transition-all duration-200"
            >
              Assignments
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 font-medium rounded-lg transition-all duration-200"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="live-sessions"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 font-medium rounded-lg transition-all duration-200"
            >
              Live Sessions
            </TabsTrigger>
            <TabsTrigger
              value="materials"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 font-medium rounded-lg transition-all duration-200"
            >
              Materials
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant={scheduleView === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setScheduleView("today")}
                className={
                  scheduleView === "today"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                    : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-200"
                }
              >
                Today's Schedule
              </Button>
              <Button
                variant={scheduleView === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setScheduleView("weekly")}
                className={
                  scheduleView === "weekly"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                    : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-200"
                }
              >
                Weekly View
              </Button>
            </div>

            {scheduleView === "today" ? (
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
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
                    {todayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center justify-between p-6 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-1.5 h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full shadow-sm" />
                          <div className="space-y-2">
                            <h4 className="font-bold text-lg text-gray-900">
                              {cls.subject}
                            </h4>
                            <p className="text-sm font-medium text-gray-600">
                              {cls.time}
                            </p>
                            <div className="flex gap-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                              >
                                {cls.room}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-700 font-medium"
                              >
                                {cls.batch}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {cls.students} students
                            </span>
                            <p className="text-xs text-gray-500">enrolled</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={toggleRecording}
                              className={
                                isRecording
                                  ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200 hover:from-red-100 hover:to-red-200"
                                  : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
                              }
                            >
                              {isRecording ? (
                                <Square className="h-4 w-4" />
                              ) : (
                                <Video className="h-4 w-4" />
                              )}
                              {isRecording ? "Stop" : "Record"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={toggleAttendance}
                              className={
                                attendanceMode
                                  ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200"
                                  : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-200"
                              }
                            >
                              <Users className="h-4 w-4 mr-2" />
                              {attendanceMode ? "Stop" : "Attendance"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                <WeeklyTimetable userRole="teacher" userName={user?.name} />
              </div>
            )}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    Create Assignment
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Create a new assignment for your students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <Label
                      htmlFor="assignment-title"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Assignment Title
                    </Label>
                    <Input
                      id="assignment-title"
                      placeholder="Enter assignment title"
                      value={newAssignment.title}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          title: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="assignment-subject"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Subject
                    </Label>
                    <Select
                      value={newAssignment.subject}
                      onValueChange={(value) =>
                        setNewAssignment({ ...newAssignment, subject: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg h-12">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-lg rounded-lg">
                        <SelectItem
                          value="data-structures"
                          className="rounded-md"
                        >
                          Data Structures
                        </SelectItem>
                        <SelectItem value="algorithms" className="rounded-md">
                          Algorithms
                        </SelectItem>
                        <SelectItem
                          value="database-systems"
                          className="rounded-md"
                        >
                          Database Systems
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="assignment-description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="assignment-description"
                      placeholder="Enter assignment description"
                      value={newAssignment.description}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          description: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg min-h-[120px] resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="assignment-due"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Due Date
                    </Label>
                    <Input
                      id="assignment-due"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          dueDate: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg h-12"
                    />
                  </div>
                  <Button
                    onClick={createAssignment}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Create Assignment
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Active Assignments
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your current assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-5 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900">
                            {assignment.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                          >
                            {assignment.subject}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 font-medium">
                          Due: {assignment.dueDate}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    (assignment.submissions /
                                      assignment.totalStudents) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {assignment.submissions}/
                              {assignment.totalStudents} submitted
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
                          >
                            View Submissions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
              <AttendanceSystem />
            </div>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="live-sessions" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                    Schedule Live Session
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Schedule a live session with your students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <Label
                      htmlFor="session-title"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Session Title
                    </Label>
                    <Input
                      id="session-title"
                      placeholder="Enter session title"
                      value={newSession.title}
                      onChange={(e) =>
                        setNewSession({ ...newSession, title: e.target.value })
                      }
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="session-subject"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Subject
                    </Label>
                    <Select
                      value={newSession.subject}
                      onValueChange={(value) =>
                        setNewSession({ ...newSession, subject: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-12">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-lg rounded-lg">
                        <SelectItem
                          value="data-structures"
                          className="rounded-md"
                        >
                          Data Structures
                        </SelectItem>
                        <SelectItem value="algorithms" className="rounded-md">
                          Algorithms
                        </SelectItem>
                        <SelectItem
                          value="database-systems"
                          className="rounded-md"
                        >
                          Database Systems
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="session-date"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Date
                      </Label>
                      <Input
                        id="session-date"
                        type="date"
                        value={newSession.date}
                        onChange={(e) =>
                          setNewSession({ ...newSession, date: e.target.value })
                        }
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="session-time"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Time
                      </Label>
                      <Input
                        id="session-time"
                        type="time"
                        value={newSession.time}
                        onChange={(e) =>
                          setNewSession({ ...newSession, time: e.target.value })
                        }
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="session-description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="session-description"
                      placeholder="Enter session description"
                      value={newSession.description}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          description: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg min-h-[120px] resize-none"
                    />
                  </div>
                  <Button
                    onClick={scheduleSession}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Schedule Session
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Scheduled Sessions
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your live sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {liveSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-5 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900">
                            {session.title}
                          </h4>
                          <Badge
                            variant={
                              session.status === "live"
                                ? "destructive"
                                : session.status === "upcoming"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              session.status === "live"
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm"
                                : session.status === "upcoming"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {session.subject}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          {session.scheduledTime}
                        </p>
                        <div className="flex gap-3">
                          {session.status === "upcoming" && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-sm"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  Course Materials
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload and manage course materials for your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 px-8">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl mx-auto mb-6 shadow-lg">
                    <Upload className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Upload Course Materials
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Share presentations, documents, and other learning materials
                    with your students.
                  </p>
                  <Button
                    onClick={() => router.push("/lms")}
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Go to LMS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}