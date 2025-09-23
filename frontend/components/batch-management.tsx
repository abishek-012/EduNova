"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  BarChart3,
  Calendar,
  GraduationCap,
  UserCheck,
  AlertTriangle,
} from "lucide-react"

interface Batch {
  id: string
  name: string
  year: string
  department: string
  totalStudents: number
  activeStudents: number
  startDate: string
  endDate: string
  coordinator: string
  status: "active" | "completed" | "upcoming"
}

interface Student {
  id: string
  name: string
  email: string
  rollNumber: string
  batch: string
  class: string
  department: string
  status: "active" | "inactive" | "graduated"
  attendance: number
  gpa: number
}

export default function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "1",
      name: "CSE Batch 2024",
      year: "2024-2028",
      department: "CSE",
      totalStudents: 120,
      activeStudents: 118,
      startDate: "2024-08-01",
      endDate: "2028-05-31",
      coordinator: "Dr. Sarah Johnson",
      status: "active",
    },
    {
      id: "2",
      name: "EEE Batch 2024",
      year: "2024-2028",
      department: "EEE",
      totalStudents: 80,
      activeStudents: 78,
      startDate: "2024-08-01",
      endDate: "2028-05-31",
      coordinator: "Prof. Michael Chen",
      status: "active",
    },
    {
      id: "3",
      name: "CSE Batch 2023",
      year: "2023-2027",
      department: "CSE",
      totalStudents: 115,
      activeStudents: 112,
      startDate: "2023-08-01",
      endDate: "2027-05-31",
      coordinator: "Dr. Emily Davis",
      status: "active",
    },
  ])

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Smith",
      email: "alice.smith@student.edunova.com",
      rollNumber: "CSE001",
      batch: "2024-2028",
      class: "CSE-A",
      department: "CSE",
      status: "active",
      attendance: 92,
      gpa: 8.5,
    },
    {
      id: "2",
      name: "Bob Wilson",
      email: "bob.wilson@student.edunova.com",
      rollNumber: "CSE002",
      batch: "2024-2028",
      class: "CSE-A",
      department: "CSE",
      status: "active",
      attendance: 88,
      gpa: 7.8,
    },
    {
      id: "3",
      name: "Carol Johnson",
      email: "carol.johnson@student.edunova.com",
      rollNumber: "EEE001",
      batch: "2024-2028",
      class: "EEE-A",
      department: "EEE",
      status: "active",
      attendance: 95,
      gpa: 9.1,
    },
  ])

  const [newBatch, setNewBatch] = useState({
    name: "",
    year: "",
    department: "",
    coordinator: "",
    startDate: "",
    endDate: "",
  })

  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const departments = ["CSE", "EEE", "ME", "CE"]

  const addBatch = () => {
    if (newBatch.name && newBatch.year && newBatch.department) {
      setBatches([
        ...batches,
        {
          id: Date.now().toString(),
          ...newBatch,
          totalStudents: 0,
          activeStudents: 0,
          status: "upcoming" as const,
        },
      ])
      setNewBatch({
        name: "",
        year: "",
        department: "",
        coordinator: "",
        startDate: "",
        endDate: "",
      })
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment
    const matchesStatus = filterStatus === "all" || student.status === filterStatus
    const matchesBatch = selectedBatch === "all" || student.batch === selectedBatch

    return matchesSearch && matchesDepartment && matchesStatus && matchesBatch
  })

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id))
    }
  }

  const bulkUpdateStatus = (status: "active" | "inactive" | "graduated") => {
    setStudents((prev) =>
      prev.map((student) => (selectedStudents.includes(student.id) ? { ...student, status } : student)),
    )
    setSelectedStudents([])
  }

  const getBatchStats = (batchYear: string) => {
    const batchStudents = students.filter((s) => s.batch === batchYear)
    const avgAttendance = batchStudents.reduce((acc, s) => acc + s.attendance, 0) / batchStudents.length || 0
    const avgGPA = batchStudents.reduce((acc, s) => acc + s.gpa, 0) / batchStudents.length || 0
    const activeCount = batchStudents.filter((s) => s.status === "active").length

    return {
      totalStudents: batchStudents.length,
      activeStudents: activeCount,
      avgAttendance: Math.round(avgAttendance),
      avgGPA: Math.round(avgGPA * 10) / 10,
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "inactive":
        return "text-red-600"
      case "graduated":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="batches">Manage Batches</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{batches.length}</div>
                <p className="text-xs text-muted-foreground">
                  {batches.filter((b) => b.status === "active").length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{batches.reduce((acc, batch) => acc + batch.totalStudents, 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {batches.reduce((acc, batch) => acc + batch.activeStudents, 0)} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departments.length}</div>
                <p className="text-xs text-muted-foreground">Across all batches</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Overview of current and upcoming batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.slice(0, 3).map((batch) => {
                  const stats = getBatchStats(batch.year)
                  return (
                    <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(batch.status)}`} />
                        <div>
                          <h4 className="font-semibold">{batch.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {batch.department} • {batch.year} • {batch.coordinator}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {stats.activeStudents}/{stats.totalStudents}
                        </p>
                        <p className="text-sm text-muted-foreground">Active Students</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Batches Tab */}
        <TabsContent value="batches" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Batch
                </CardTitle>
                <CardDescription>Add a new batch to your institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-name">Batch Name</Label>
                  <Input
                    id="batch-name"
                    placeholder="e.g., CSE Batch 2024"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-year">Academic Year</Label>
                    <Input
                      id="batch-year"
                      placeholder="e.g., 2024-2028"
                      value={newBatch.year}
                      onChange={(e) => setNewBatch({ ...newBatch, year: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-dept">Department</Label>
                    <Select
                      value={newBatch.department}
                      onValueChange={(value) => setNewBatch({ ...newBatch, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch-coordinator">Batch Coordinator</Label>
                  <Input
                    id="batch-coordinator"
                    placeholder="Enter coordinator name"
                    value={newBatch.coordinator}
                    onChange={(e) => setNewBatch({ ...newBatch, coordinator: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-start">Start Date</Label>
                    <Input
                      id="batch-start"
                      type="date"
                      value={newBatch.startDate}
                      onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-end">End Date</Label>
                    <Input
                      id="batch-end"
                      type="date"
                      value={newBatch.endDate}
                      onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addBatch} className="w-full">
                  Create Batch
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Batches</CardTitle>
                <CardDescription>Manage your institution's batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {batches.map((batch) => {
                    const stats = getBatchStats(batch.year)
                    return (
                      <div key={batch.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{batch.name}</h4>
                              <Badge variant={batch.status === "active" ? "default" : "secondary"}>
                                {batch.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {batch.department} • {batch.year}
                            </p>
                            <p className="text-sm text-muted-foreground">Coordinator: {batch.coordinator}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Students</p>
                            <p className="font-semibold">
                              {stats.activeStudents}/{stats.totalStudents}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg. Attendance</p>
                            <p className="font-semibold">{stats.avgAttendance}%</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Student Management Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>Manage students across all batches</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.year}>
                        {batch.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{selectedStudents.length} student(s) selected</span>
                  <div className="flex gap-2 ml-auto">
                    <Button size="sm" onClick={() => bulkUpdateStatus("active")}>
                      Mark Active
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("inactive")}>
                      Mark Inactive
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("graduated")}>
                      Mark Graduated
                    </Button>
                  </div>
                </div>
              )}

              {/* Student List */}
              <div className="space-y-2">
                <div className="flex items-center gap-4 p-2 border-b">
                  <Checkbox
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentSelect(student.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{student.name}</h4>
                        <Badge variant="outline">{student.rollNumber}</Badge>
                        <Badge variant="secondary">{student.class}</Badge>
                        <span className={`text-sm font-medium ${getStudentStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span>Batch: {student.batch}</span>
                        <span>Attendance: {student.attendance}%</span>
                        <span>GPA: {student.gpa}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Batch Performance
                </CardTitle>
                <CardDescription>Academic performance across batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches.map((batch) => {
                    const stats = getBatchStats(batch.year)
                    return (
                      <div key={batch.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{batch.name}</span>
                          <span className="text-sm text-muted-foreground">GPA: {stats.avgGPA}</span>
                        </div>
                        <Progress value={stats.avgGPA * 10} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Attendance rates across batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches.map((batch) => {
                    const stats = getBatchStats(batch.year)
                    return (
                      <div key={batch.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{batch.name}</span>
                          <span className="text-sm text-muted-foreground">{stats.avgAttendance}%</span>
                        </div>
                        <Progress value={stats.avgAttendance} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alerts & Notifications
              </CardTitle>
              <CardDescription>Important batch-related alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Low Attendance Alert</p>
                    <p className="text-sm text-muted-foreground">
                      5 students in CSE Batch 2024 have attendance below 75%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Upcoming Batch Start</p>
                    <p className="text-sm text-muted-foreground">New batch ME 2025 starts in 2 weeks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
