"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  GraduationCap,
  BookOpen,
  FileText,
  Video,
  MessageCircle,
  Upload,
  Download,
  Send,
  LogOut,
  Play,
  Clock,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
  id: string
  name: string
  code: string
  teacher: string
  description: string
  students: number
}

interface Material {
  id: string
  title: string
  type: "document" | "video" | "link"
  courseId: string
  uploadedBy: string
  uploadDate: string
  size?: string
  duration?: string
  url: string
}

interface ChatMessage {
  id: string
  courseId: string
  sender: string
  senderRole: "teacher" | "student"
  message: string
  timestamp: string
  canEdit: boolean
}

interface Quiz {
  id: string
  title: string
  courseId: string
  questions: number
  duration: number
  attempts: number
  maxAttempts: number
  score?: number
}

export default function LMSPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Mock data
  const [courses] = useState<Course[]>([
    {
      id: "1",
      name: "Data Structures",
      code: "CS201",
      teacher: "Dr. Sarah Johnson",
      description: "Learn fundamental data structures and their applications",
      students: 45,
    },
    {
      id: "2",
      name: "Algorithms",
      code: "CS202",
      teacher: "Prof. Michael Chen",
      description: "Study algorithm design and analysis techniques",
      students: 42,
    },
    {
      id: "3",
      name: "Database Systems",
      code: "CS301",
      teacher: "Dr. Emily Davis",
      description: "Comprehensive database design and management",
      students: 38,
    },
  ])

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      title: "Introduction to Arrays",
      type: "document",
      courseId: "1",
      uploadedBy: "Dr. Sarah Johnson",
      uploadDate: "2024-01-10",
      size: "2.5 MB",
      url: "#",
    },
    {
      id: "2",
      title: "Linked Lists Explained",
      type: "video",
      courseId: "1",
      uploadedBy: "Dr. Sarah Johnson",
      uploadDate: "2024-01-12",
      duration: "45 min",
      url: "#",
    },
    {
      id: "3",
      title: "Sorting Algorithms Demo",
      type: "video",
      courseId: "2",
      uploadedBy: "Prof. Michael Chen",
      uploadDate: "2024-01-11",
      duration: "32 min",
      url: "#",
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      courseId: "1",
      sender: "Alice Smith",
      senderRole: "student",
      message: "Can someone explain the difference between arrays and linked lists?",
      timestamp: "2024-01-12 10:30",
      canEdit: true,
    },
    {
      id: "2",
      courseId: "1",
      sender: "Dr. Sarah Johnson",
      senderRole: "teacher",
      message:
        "Great question! Arrays store elements in contiguous memory locations, while linked lists use pointers to connect elements. This affects access time and memory usage.",
      timestamp: "2024-01-12 10:45",
      canEdit: false,
    },
    {
      id: "3",
      courseId: "1",
      sender: "Bob Wilson",
      senderRole: "student",
      message: "Thanks for the explanation! That makes it much clearer.",
      timestamp: "2024-01-12 11:00",
      canEdit: true,
    },
  ])

  const [quizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Arrays and Pointers Quiz",
      courseId: "1",
      questions: 10,
      duration: 30,
      attempts: 1,
      maxAttempts: 3,
      score: 85,
    },
    {
      id: "2",
      title: "Sorting Algorithms Test",
      courseId: "2",
      questions: 15,
      duration: 45,
      attempts: 0,
      maxAttempts: 2,
    },
  ])

  const [selectedCourse, setSelectedCourse] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "document" as const,
    file: null as File | null,
  })

  if (!user) {
    router.push("/")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        courseId: selectedCourse,
        sender: user.name,
        senderRole: user.role as "teacher" | "student",
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        canEdit: true,
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  const uploadMaterial = () => {
    if (newMaterial.title && user.role === "teacher") {
      const material: Material = {
        id: Date.now().toString(),
        title: newMaterial.title,
        type: newMaterial.type,
        courseId: selectedCourse,
        uploadedBy: user.name,
        uploadDate: new Date().toISOString().split("T")[0],
        size: newMaterial.file ? `${(newMaterial.file.size / 1024 / 1024).toFixed(1)} MB` : undefined,
        url: "#",
      }
      setMaterials([...materials, material])
      setNewMaterial({ title: "", type: "document", file: null })
      alert("Material uploaded successfully!")
    }
  }

  const selectedCourseData = courses.find((c) => c.id === selectedCourse)
  const courseMaterials = materials.filter((m) => m.courseId === selectedCourse)
  const courseMessages = chatMessages.filter((m) => m.courseId === selectedCourse)
  const courseQuizzes = quizzes.filter((q) => q.courseId === selectedCourse)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">EduNova LMS</h1>
              </div>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/${user.role}`)}>
                Back to Dashboard
              </Button>
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courses.map((course) => (
                    <Button
                      key={course.id}
                      variant={selectedCourse === course.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{course.code}</div>
                        <div className="text-xs text-muted-foreground">{course.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCourseData && (
              <div className="space-y-6">
                {/* Course Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedCourseData.name}</CardTitle>
                        <CardDescription className="text-base mt-2">{selectedCourseData.description}</CardDescription>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="outline">{selectedCourseData.code}</Badge>
                          <span className="text-sm text-muted-foreground">
                            <Users className="h-4 w-4 inline mr-1" />
                            {selectedCourseData.students} students
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Instructor: {selectedCourseData.teacher}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Course Content Tabs */}
                <Tabs defaultValue="materials" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="recordings">Recordings</TabsTrigger>
                  </TabsList>

                  {/* Materials Tab */}
                  <TabsContent value="materials" className="space-y-6">
                    {user.role === "teacher" && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload Material
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="material-title">Title</Label>
                              <Input
                                id="material-title"
                                placeholder="Enter material title"
                                value={newMaterial.title}
                                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="material-type">Type</Label>
                              <select
                                id="material-type"
                                className="w-full p-2 border rounded-md"
                                value={newMaterial.type}
                                onChange={(e) =>
                                  setNewMaterial({
                                    ...newMaterial,
                                    type: e.target.value as "document" | "video" | "link",
                                  })
                                }
                              >
                                <option value="document">Document</option>
                                <option value="video">Video</option>
                                <option value="link">Link</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="material-file">File</Label>
                            <Input
                              id="material-file"
                              type="file"
                              onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files?.[0] || null })}
                            />
                          </div>
                          <Button onClick={uploadMaterial} className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Material
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Course Materials</CardTitle>
                        <CardDescription>Access all learning materials for this course</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {courseMaterials.map((material) => (
                            <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {material.type === "document" && <FileText className="h-8 w-8 text-primary" />}
                                {material.type === "video" && <Video className="h-8 w-8 text-primary" />}
                                {material.type === "link" && <BookOpen className="h-8 w-8 text-primary" />}
                                <div>
                                  <h4 className="font-semibold">{material.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Uploaded by {material.uploadedBy} on {material.uploadDate}
                                  </p>
                                  {material.size && (
                                    <p className="text-xs text-muted-foreground">Size: {material.size}</p>
                                  )}
                                  {material.duration && (
                                    <p className="text-xs text-muted-foreground">Duration: {material.duration}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {material.type === "video" && (
                                  <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4 mr-2" />
                                    Watch
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Quizzes Tab */}
                  <TabsContent value="quizzes" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Quizzes</CardTitle>
                        <CardDescription>Test your knowledge with interactive quizzes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {courseQuizzes.map((quiz) => (
                            <div key={quiz.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">{quiz.title}</h4>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span>{quiz.questions} questions</span>
                                    <span>
                                      <Clock className="h-4 w-4 inline mr-1" />
                                      {quiz.duration} minutes
                                    </span>
                                    <span>
                                      Attempts: {quiz.attempts}/{quiz.maxAttempts}
                                    </span>
                                  </div>
                                </div>
                                {quiz.score && (
                                  <Badge variant="default" className="text-lg px-3 py-1">
                                    {quiz.score}%
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {quiz.attempts < quiz.maxAttempts && (
                                  <Button size="sm">{quiz.attempts === 0 ? "Start Quiz" : "Retake Quiz"}</Button>
                                )}
                                {quiz.score && (
                                  <Button variant="outline" size="sm">
                                    View Results
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Discussions Tab */}
                  <TabsContent value="discussions" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-5 w-5" />
                          Course Discussion
                        </CardTitle>
                        <CardDescription>Ask questions and participate in course discussions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ScrollArea className="h-96 w-full border rounded-lg p-4">
                            <div className="space-y-4">
                              {courseMessages.map((message) => (
                                <div key={message.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {message.sender
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm">{message.sender}</span>
                                      <Badge variant={message.senderRole === "teacher" ? "default" : "secondary"}>
                                        {message.senderRole}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{message.message}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Recordings Tab */}
                  <TabsContent value="recordings" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Recorded Lectures
                        </CardTitle>
                        <CardDescription>Access recorded live sessions and lectures</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Video className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-semibold">Introduction to Data Structures</h4>
                                <p className="text-sm text-muted-foreground">Recorded on Jan 10, 2024 • 1h 15m</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Watch
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Video className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-semibold">Arrays and Memory Management</h4>
                                <p className="text-sm text-muted-foreground">Recorded on Jan 12, 2024 • 58m</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Watch
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Video className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-semibold">Linked Lists Deep Dive</h4>
                                <p className="text-sm text-muted-foreground">Recorded on Jan 15, 2024 • 1h 22m</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Watch
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
