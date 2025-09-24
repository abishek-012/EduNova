"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import * as faceapi from 'face-api.js';

interface Student {
  id: string
  name: string
  rollNumber: string
  status: "present" | "absent" | "late" | "pending"
  timestamp?: string
  confidence?: number
}

interface AttendanceSession {
  id: string
  courseCode: string
  courseName: string
  date: string
  startTime: string
  endTime: string
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
}

export default function AttendanceSystem() {
  const [isRecording, setIsRecording] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Alice Johnson", rollNumber: "CS001", status: "pending" },
    { id: "2", name: "Bob Smith", rollNumber: "CS002", status: "pending" },
    { id: "3", name: "Carol Davis", rollNumber: "CS003", status: "pending" },
    { id: "4", name: "David Wilson", rollNumber: "CS004", status: "pending" },
    { id: "5", name: "Harisankar", rollNumber: "CS005", status: "pending" },
    { id: "6", name: "Deepankar Sharma", rollNumber: "CS006", status: "pending" },
    { id: "7", name: "Deepan Bomb", rollNumber: "CS007", status: "pending" },
    { id: "8", name: "Alwin", rollNumber: "CS008", status: "pending" },
    { id: "9", name: "Abishek Kandan", rollNumber: "CS009", status: "pending" },
    { id: "10", name: "Harini Narayanasamay", rollNumber: "CS010", status: "pending" },
  ])
  const [sessions, setSessions] = useState<AttendanceSession[]>([
    {
      id: "1",
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "10:30",
      totalStudents: 25,
      presentCount: 23,
      absentCount: 2,
      lateCount: 0,
    },
    {
      id: "2",
      courseCode: "CS201",
      courseName: "Data Structures",
      date: "2024-01-14",
      startTime: "11:00",
      endTime: "12:30",
      totalStudents: 28,
      presentCount: 26,
      absentCount: 1,
      lateCount: 1,
    },
  ])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<number | null>(null)

  // Load face-api.js models when the component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models'; // Ensure models are in a 'public/models' folder
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("Models loaded successfully.");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const startFacialRecognition = async () => {
    // Only start if models are loaded
    if (!modelsLoaded) {
      console.warn("Models not yet loaded. Please wait.");
      return;
    }

    setIsRecording(true)
    try {
      // Request access to the user's webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Start the face detection interval after a brief delay
      videoRef.current?.addEventListener('play', () => {
        // Match video dimensions to the canvas
        if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
        }
        intervalRef.current = window.setInterval(detectFaces, 1500);
      });

    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsRecording(false)
    }
  }

  const stopFacialRecognition = () => {
    setIsRecording(false)
    // Clear the face detection interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Stop the video stream tracks
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    // Hide the canvas
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      canvasRef.current.style.display = 'none';
    }
  }
  
  const detectFaces = async () => {
    if (videoRef.current && canvasRef.current) {
      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      // Detect all faces in the video stream using the tiny face detector
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      
      // Draw the detection boxes on the canvas
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvasRef.current.getContext('2d');
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (context) {
        // Draw the red box for each detected face, with a slight vertical offset
        const yOffset = -5; // Adjust this value to move the box up or down
        resizedDetections.forEach(detection => {
          const box = detection.box;
          context.beginPath();
          context.rect(box.x, box.y + yOffset, box.width, box.height);
          context.lineWidth = 3;
          context.strokeStyle = 'red';
          context.stroke();
        });
      }
      // Check if at least one face is detected
      if (detections.length > 0) {
        console.log(`Face detected! Number of faces: ${detections.length}`);
        // Simulate attendance marking for a random pending student
        setStudents((prev) => {
          const pendingStudents = prev.filter((s) => s.status === "pending");
          if (pendingStudents.length === 0) {
            // All students have been marked, stop the detection interval
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return prev;
          }

          const randomStudent = pendingStudents[Math.floor(Math.random() * pendingStudents.length)];
          const statuses: ("present" | "late")[] = ["present", "present", "present", "late"]; // 75% present, 25% late
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

          return prev.map((student) =>
            student.id === randomStudent.id
              ? {
                  ...student,
                  status: newStatus,
                  timestamp: new Date().toLocaleTimeString(),
                  confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
                }
              : student,
          );
        });
        
        // Show the canvas with the red box
        canvasRef.current.style.display = 'block';

      } else {
        console.log("No face detected, not marking attendance.");
        // Hide the canvas if no face is detected
        canvasRef.current.style.display = 'none';
      }
    }
  };

  const markManualAttendance = (studentId: string, status: "present" | "absent" | "late") => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status,
              timestamp: new Date().toLocaleTimeString(),
            }
          : student,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "late":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "absent":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4" />
      case "late":
        return <AlertCircle className="w-4 h-4" />
      case "absent":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const presentCount = students.filter((s) => s.status === "present").length
  const lateCount = students.filter((s) => s.status === "late").length
  const absentCount = students.filter((s) => s.status === "absent").length
  const pendingCount = students.filter((s) => s.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Smart Attendance System</h2>
          <p className="text-gray-400">Automated facial recognition attendance tracking</p>
        </div>
        <div className="flex gap-2">
          {!isRecording ? (
            <Button onClick={startFacialRecognition} className="bg-blue-600 hover:bg-blue-700" disabled={!modelsLoaded}>
              <Camera className="w-4 h-4 mr-2" />
              {modelsLoaded ? "Start Recognition" : "Loading Models..."}
            </Button>
          ) : (
            <Button onClick={stopFacialRecognition} variant="destructive">
              <Camera className="w-4 h-4 mr-2" />
              Stop Recognition
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="live" className="text-white data-[state=active]:bg-gray-700">
            Live Tracking
          </TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-gray-700">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Feed */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Camera Feed
                </CardTitle>
                <CardDescription>Live facial recognition detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-64 object-contain"
                    style={{ display: isRecording ? "block" : "none" }}
                  />
                  {!isRecording && (
                    <div className="w-full h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Camera not active</p>
                      </div>
                    </div>
                  )}
                  {/* The canvas is now layered on top of the video */}
                  <canvas ref={canvasRef} className="absolute top-0 left-0" style={{ display: isRecording ? "block" : "none" }} />
                </div>
                {isRecording && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Facial recognition active</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Current session statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{presentCount}</div>
                    <div className="text-sm text-green-300">Present</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{lateCount}</div>
                    <div className="text-sm text-yellow-300">Late</div>
                  </div>
                  <div className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{absentCount}</div>
                    <div className="text-sm text-red-300">Absent</div>
                  </div>
                  <div className="text-center p-4 bg-gray-500/20 border border-gray-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-gray-400">{pendingCount}</div>
                    <div className="text-sm text-gray-300">Pending</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <div className="text-sm text-blue-300">
                    Attendance Rate:{" "}
                    {students.length > 0 ? Math.round(((presentCount + lateCount) / students.length) * 100) : 0}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Student Attendance</CardTitle>
              <CardDescription>Real-time attendance tracking with manual override</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-300">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{student.name}</div>
                        <div className="text-sm text-gray-400">{student.rollNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {student.timestamp && (
                        <div className="text-xs text-gray-500">
                          {student.timestamp}
                          {student.confidence && <span className="ml-1">({student.confidence}%)</span>}
                        </div>
                      )}
                      <Badge className={`${getStatusColor(student.status)} flex items-center gap-1`}>
                        {getStatusIcon(student.status)}
                        {student.status}
                      </Badge>
                      {student.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs border-green-500/30 text-green-400 hover:bg-green-500/20 bg-transparent"
                            onClick={() => markManualAttendance(student.id, "present")}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs border-red-500/30 text-red-400 hover:bg-red-500/20 bg-transparent"
                            onClick={() => markManualAttendance(student.id, "absent")}
                          >
                            Absent
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Attendance History</CardTitle>
              <CardDescription>Previous attendance sessions and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white">{session.courseName}</h3>
                        <p className="text-sm text-gray-400">
                          {session.courseCode} • {session.date}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">{session.totalStudents}</div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">{session.presentCount}</div>
                        <div className="text-xs text-gray-400">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-400">{session.lateCount}</div>
                        <div className="text-xs text-gray-400">Late</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-400">{session.absentCount}</div>
                        <div className="text-xs text-gray-400">Absent</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-sm text-gray-400">
                        Attendance Rate:{" "}
                        {Math.round(((session.presentCount + session.lateCount) / session.totalStudents) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
