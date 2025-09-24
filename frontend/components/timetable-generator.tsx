"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, Download} from "lucide-react";

export default function TimetableGenerator() {
  const [subjects, setSubjects] = useState<{ [key: string]: number }>({});
  const [timetable, setTimetable] = useState<any>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCount, setNewCourseCount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const API_BASE = "https://edunova-osoo.onrender.com/api";

  // Fetch subjects from backend on load
  useEffect(() => {
    fetchSubjects();
  }, []);

    const handleExportPDF = () => {
    if (!timetable || Object.keys(timetable).length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Generated Timetable", 14, 20);

    // Prepare header row (slot numbers with times)
    const headers = ["Day"].concat(
      Array.from({ length: timetable[Object.keys(timetable)[0]].length }).map(
        (_, slotIdx) =>
          ["I","II","III","IV","V","VI","VII","VIII","IX","X"][slotIdx] || ""
      )
    );

    // Prepare body rows
    const body = Object.keys(timetable).map((day) => {
      const row = [day];
      timetable[day].forEach((courseName: string, slotIdx: number) => {
        if (slotIdx === 3) {
          row.push("Lunch");
        }
        row.push(courseName || "-");
      });
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 30,
      styles: { halign: "center", valign: "middle" },
      headStyles: { fillColor: [100, 100, 255] },
    });

    doc.save("timetable.pdf");
  };


  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/subjects`);
      if (!res.ok) {
        console.error("Failed to fetch subjects:", res.statusText);
        return;
      }
      const data = await res.json();
      // ensure numeric values
      const normalized: { [key: string]: number } = {};
      Object.entries(data).forEach(([k, v]) => {
        normalized[k] = Number(v) || 0;
      });
      setSubjects(normalized);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const addCourse = async () => {
    const name = newCourseName.trim();
    const count = Number(newCourseCount);

    if (!name) return;
    if (!count || Number.isNaN(count) || count <= 0) return;

    try {
      const res = await fetch(`${API_BASE}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, count }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("Failed to add course:", res.status, errBody);
        return;
      }

      // re-fetch authoritative subjects from backend to stay in sync
      await fetchSubjects();

      setNewCourseName("");
      setNewCourseCount(0);
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  const generateTimetable = async () => {
    try {
      setIsGenerating(true);
      // ensure frontend sees latest subjects (optional but safe)
      await fetchSubjects();

      const res = await fetch(`${API_BASE}/generate-timetable`);
      if (!res.ok) {
        console.error("Failed to generate timetable:", res.statusText);
        setIsGenerating(false);
        return;
      }
      const data = await res.json();
      setTimetable(data);
    } catch (err) {
      console.error("Error generating timetable:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Auto Timetable Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="generate">Generate Timetable</TabsTrigger>
            <TabsTrigger value="view">View Timetable</TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="mt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Add Course</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="border rounded px-3 py-2 w-1/2"
                />
                <input
                  type="number"
                  placeholder="Hours per week"
                  value={newCourseCount === 0 ? "" : newCourseCount}
                  max={5}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (isNaN(val)) {
                      setNewCourseCount(0);
                    } else {
                      setNewCourseCount(val > 5 ? 5 : val);
                    }
                  }}
                  className="border rounded px-3 py-2 w-1/3"
                />


                <Button onClick={addCourse}>Add</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Available Courses</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(subjects).map(([name, slots]) => (
                  <div
                    key={name}
                    className="p-3 border rounded-lg shadow-sm bg-muted"
                  >
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-600">{slots} slots/week</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-4">
              <Button
                onClick={generateTimetable}
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isGenerating ? "Generating..." : "Generate Timetable"}
              </Button>
            </div>
          </TabsContent>

          {/* View Tab */}
          <TabsContent value="view" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Generated Timetable
                    </CardTitle>
                    <CardDescription>Timetable for students</CardDescription>
                  </div>
                  {Object.keys(timetable || {}).length > 0 && (
                    <Button variant="outline" onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!timetable || Object.keys(timetable).length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Timetable Generated</h3>
                    <p className="text-muted-foreground mb-4">Generate a timetable to view the schedule here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-center">
                      <thead>
                        <tr>
                          <th className="border border-border p-3 bg-muted font-semibold">Slot</th>
                          {Array.from({ length: timetable[Object.keys(timetable)[0]].length }).map((_, slotIdx) => (
                            <th key={slotIdx} className="border border-border p-3 bg-muted font-semibold">
                              {/* Roman numerals */}
                              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][slotIdx]}
                              <div className="text-xs text-gray-500 mt-1">
                                {/* Example times */}
                                {["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00"][slotIdx] || ""}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(timetable).map((day) => (
                          <tr key={day}>
                            <td className="border border-border p-3 font-semibold bg-muted/50">{day}</td>
                            {timetable[day].map((courseName: string, slotIdx: number) => {
                              // Insert Lunch after 3rd slot
                              if (slotIdx === 3) {
                                return (
                                  <td key={`${day}-lunch`} className="border border-border p-2 bg-yellow-100 font-semibold">
                                    Lunch
                                  </td>
                                );
                              }
                              return (
                                <td key={`${day}-${slotIdx}`} className="border border-border p-2">
                                  {courseName ? <div className="font-medium">{courseName}</div> : <div className="text-muted-foreground">-</div>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
        </TabsContent>



        </Tabs>
      </CardContent>
    </Card>
  );
}
