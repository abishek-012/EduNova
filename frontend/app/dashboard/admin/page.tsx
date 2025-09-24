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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Building2,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import TimetableGenerator from "@/components/timetable-generator";
import BatchManagement from "@/components/batch-management";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  batch: string;
  class: string;
  department: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock data
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Computer Science Engineering", code: "CSE" },
    { id: "2", name: "Electrical and Electronics Engineering", code: "EEE" },
    { id: "3", name: "Mechanical Engineering", code: "ME" },
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@edunova.com",
      department: "CSE",
      courses: ["Data Structures", "Algorithms"],
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      email: "michael.chen@edunova.com",
      department: "EEE",
      courses: ["Circuit Analysis", "Digital Electronics"],
    },
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Smith",
      email: "alice.smith@student.edunova.com",
      rollNumber: "CSE001",
      batch: "2024-2028",
      class: "CSE-A",
      department: "CSE",
    },
    {
      id: "2",
      name: "Bob Wilson",
      email: "bob.wilson@student.edunova.com",
      rollNumber: "EEE001",
      batch: "2024-2028",
      class: "EEE-A",
      department: "EEE",
    },
  ]);

  const [newDepartment, setNewDepartment] = useState({ name: "", code: "" });
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    dob: "",
  });
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    rollNumber: "",
    batch: "",
    class: "",
    department: "",
    dob: "",
  });

  if (!user || user.role !== "admin") {
    router.push("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const addDepartment = () => {
    if (newDepartment.name && newDepartment.code) {
      setDepartments([
        ...departments,
        {
          id: Date.now().toString(),
          name: newDepartment.name,
          code: newDepartment.code,
        },
      ]);
      setNewDepartment({ name: "", code: "" });
    }
  };

  const addTeacher = () => {
    if (newTeacher.name && newTeacher.email && newTeacher.department) {
      setTeachers([
        ...teachers,
        {
          id: Date.now().toString(),
          name: newTeacher.name,
          email: newTeacher.email,
          department: newTeacher.department,
          courses: [],
        },
      ]);
      setNewTeacher({ name: "", email: "", department: "", dob: "" });
    }
  };

  const addStudent = () => {
    if (
      newStudent.name &&
      newStudent.email &&
      newStudent.rollNumber &&
      newStudent.batch &&
      newStudent.class &&
      newStudent.department
    ) {
      setStudents([
        ...students,
        {
          id: Date.now().toString(),
          name: newStudent.name,
          email: newStudent.email,
          rollNumber: newStudent.rollNumber,
          batch: newStudent.batch,
          class: newStudent.class,
          department: newStudent.department,
        },
      ]);
      setNewStudent({
        name: "",
        email: "",
        rollNumber: "",
        batch: "",
        class: "",
        department: "",
        dob: "",
      });
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
                Administrator
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Departments
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {departments.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Active departments</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Teachers
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {teachers.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Faculty members</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Students
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {students.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Active Courses
              </CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {teachers.reduce(
                  (acc, teacher) => acc + teacher.courses.length,
                  0
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Course offerings</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="batch-management" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm rounded-xl p-1">
            <TabsTrigger
              value="batch-management"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Batch Management
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Departments
            </TabsTrigger>
            <TabsTrigger
              value="teachers"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Teachers
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="timetable"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium rounded-lg transition-all duration-200"
            >
              Timetable
            </TabsTrigger>
          </TabsList>

          {/* Batch Management Tab - New enhanced tab */}
          <TabsContent value="batch-management" className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
              <BatchManagement />
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    Add New Department
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Create a new department for your institution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="dept-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Department Name
                    </Label>
                    <Input
                      id="dept-name"
                      placeholder="e.g., Computer Science Engineering"
                      value={newDepartment.name}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          name: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="dept-code"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Department Code
                    </Label>
                    <Input
                      id="dept-code"
                      placeholder="e.g., CSE"
                      value={newDepartment.code}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          code: e.target.value,
                        })
                      }
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg h-12"
                    />
                  </div>
                  <Button
                    onClick={addDepartment}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Add Department
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Existing Departments
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your institution's departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between p-4 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900">
                            {dept.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Code:{" "}
                            <span className="font-medium text-gray-700">
                              {dept.code}
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    Add New Teacher
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Create a new teacher account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <Label
                      htmlFor="teacher-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="teacher-name"
                      placeholder="Enter teacher's full name"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="teacher-email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="Enter teacher's email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="teacher-dept"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Department
                    </Label>
                    <Select
                      value={newTeacher.department}
                      onValueChange={(value) =>
                        setNewTeacher({ ...newTeacher, department: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 rounded-lg h-12">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-lg rounded-lg">
                        {departments.map((dept) => (
                          <SelectItem
                            key={dept.id}
                            value={dept.code}
                            className="rounded-md"
                          >
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="teacher-dob"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="teacher-dob"
                      type="date"
                      value={newTeacher.dob}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, dob: e.target.value })
                      }
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 rounded-lg h-12"
                    />
                  </div>
                  <Button
                    onClick={addTeacher}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Add Teacher
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Existing Teachers
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage teacher accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-4 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">
                            {teacher.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {teacher.email}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors"
                            >
                              {teacher.department}
                            </Badge>
                            {teacher.courses.map((course) => (
                              <Badge
                                key={course}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    Add New Student
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Create a new student account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="student-name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="student-name"
                        placeholder="Enter student's name"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="student-roll"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Roll Number
                      </Label>
                      <Input
                        id="student-roll"
                        placeholder="e.g., CSE001"
                        value={newStudent.rollNumber}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            rollNumber: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="student-email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="Enter student's email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="student-batch"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Batch
                      </Label>
                      <Input
                        id="student-batch"
                        placeholder="e.g., 2024-2028"
                        value={newStudent.batch}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            batch: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="student-class"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Class
                      </Label>
                      <Input
                        id="student-class"
                        placeholder="e.g., CSE-A"
                        value={newStudent.class}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            class: e.target.value,
                          })
                        }
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="student-dept"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Department
                    </Label>
                    <Select
                      value={newStudent.department}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, department: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-lg rounded-lg">
                        {departments.map((dept) => (
                          <SelectItem
                            key={dept.id}
                            value={dept.code}
                            className="rounded-md"
                          >
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="student-dob"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="student-dob"
                      type="date"
                      value={newStudent.dob}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, dob: e.target.value })
                      }
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-200 rounded-lg h-11"
                    />
                  </div>
                  <Button
                    onClick={addStudent}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Add Student
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Existing Students
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage student accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                              {student.rollNumber}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              {student.class}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              {student.batch}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timetable Tab */}
          <TabsContent value="timetable" className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Timetable Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate and manage automated class timetables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimetableGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}