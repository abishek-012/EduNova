"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Home,
} from "lucide-react";

type CalendarEvent = {
  date: string;
  title: string;
  type: "national" | "state" | "local" | "event";
  color?: string;
};

type ApiResponse = {
  year: number;
  month: number;
  region: string;
  events: CalendarEvent[];
  colors: Record<string, string>;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          year: String(year),
          month: String(month),
        });
        const res = await fetch(`/api/calendar?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load calendar: ${res.status}`);
        const json = (await res.json()) as ApiResponse;
        setData(json);
      } catch (e: any) {
        if (e.name !== "AbortError")
          setError(e.message || "Failed to load calendar");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [year, month]);

  const grid = useMemo(() => {
    const first = new Date(year, month - 1, 1);
    const firstDay = first.getDay(); // 0 Sun - 6 Sat
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    // Previous month padding
    for (let i = 0; i < firstDay; i++) {
      const d = new Date(year, month - 1, 1 - (firstDay - i));
      cells.push({ date: d, inMonth: false });
    }
    // This month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month - 1, d), inMonth: true });
    }
    // Next month padding to complete 6 weeks (42 cells)
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      cells.push({
        date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
        inMonth: false,
      });
    }
    while (cells.length < 42) {
      const last = cells[cells.length - 1].date;
      cells.push({
        date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
        inMonth: false,
      });
    }
    return cells;
  }, [year, month]);

  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    data?.events.forEach((ev) => {
      map.set(ev.date, [...(map.get(ev.date) || []), ev]);
    });
    return map;
  }, [data]);

  const goPrev = () => {
    const m = month - 1;
    if (m < 1) {
      setMonth(12);
      setYear(year - 1);
    } else setMonth(m);
  };
  const goNext = () => {
    const m = month + 1;
    if (m > 12) {
      setMonth(1);
      setYear(year + 1);
    } else setMonth(m);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Calendar — Jharkhand
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/lms")}
              >
                LMS
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-bold">
                {new Date(year, month - 1).toLocaleString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                className="bg-red-100 text-red-700 border-red-200"
                variant="outline"
              >
                National
              </Badge>
              <Badge
                className="bg-emerald-100 text-emerald-700 border-emerald-200"
                variant="outline"
              >
                State
              </Badge>
              <Badge
                className="bg-blue-100 text-blue-700 border-blue-200"
                variant="outline"
              >
                Local
              </Badge>
              <Badge
                className="bg-amber-100 text-amber-700 border-amber-200"
                variant="outline"
              >
                Event
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {loading && (
              <div className="p-6 text-sm text-gray-600">Loading calendar…</div>
            )}

            {!loading && (
              <div className="grid grid-cols-7 gap-3">
                {WEEKDAY_LABELS.map((d) => (
                  <div
                    key={d}
                    className="text-xs font-semibold text-gray-600 text-center py-2"
                  >
                    {d}
                  </div>
                ))}
                {grid.map((cell, idx) => {
                  const y = cell.date.getFullYear();
                  const m = String(cell.date.getMonth() + 1).padStart(2, "0");
                  const d = String(cell.date.getDate()).padStart(2, "0");
                  const key = `${y}-${m}-${d}`;
                  const evs = eventMap.get(key) || [];
                  const isToday =
                    cell.date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={idx}
                      className={`min-h-28 p-2 rounded-xl border transition-all ${
                        cell.inMonth
                          ? "bg-white"
                          : "bg-gray-50 border-gray-100 text-gray-400"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {cell.date.getDate()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {evs.map((e, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span
                              className="mt-1 inline-block size-2 rounded-full"
                              style={{ background: e.color || "#9CA3AF" }}
                            />
                            <span
                              className="text-[12px] leading-snug font-medium"
                              style={{ color: e.color || "#374151" }}
                            >
                              {e.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}