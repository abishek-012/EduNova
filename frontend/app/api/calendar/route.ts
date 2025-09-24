import { NextResponse } from "next/server";

const DEFAULT_BACKEND = process.env.BACKEND_URL || "https://edunova-osoo.onrender.com/api";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  const url = `${DEFAULT_BACKEND}/api/calendar${search}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { error: "calendar-backend-unavailable" },
      { status: 502 }
    );
  }
}