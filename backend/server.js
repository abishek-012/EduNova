const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --------- GA PARAMETERS ---------
const subjects = {
  "Digital Circuits": 4,
  "Data Structures": 4,
  "Microprocessors": 3,
  "Mathematics": 3,
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const slotsPerDay = 6;

// ---------- GA HELPERS ----------
function generateInitialTimetable() {
  const allSubjects = [];
  for (const [sub, count] of Object.entries(subjects)) {
    for (let i = 0; i < Number(count); i++) allSubjects.push(sub);
  }

  // Add free periods
  const totalSlots = days.length * slotsPerDay;
  const freeSlots = totalSlots - allSubjects.length;
  for (let i = 0; i < freeSlots; i++) allSubjects.push("");

  // Shuffle and fill timetable
  const timetable = [];
  let tempSubjects = [...allSubjects];
  for (let d = 0; d < days.length; d++) {
    const daySlots = [];
    for (let s = 0; s < slotsPerDay; s++) {
      const idx = Math.floor(Math.random() * tempSubjects.length);
      daySlots.push(tempSubjects.splice(idx, 1)[0]);
    }
    timetable.push(daySlots);
  }
  return timetable;
}

function fitness(timetable) {
  let score = 100;

  // 1. Penalize same subject more than twice in a row
  timetable.forEach(day => {
    for (let i = 0; i < day.length - 2; i++) {
      if (day[i] === day[i + 1] && day[i] === day[i + 2] && day[i] !== "") {
        score -= 10;
      }
    }
  });

  // 2. Penalize exceeding weekly slot count
  const flat = timetable.flat();
  for (const [sub, count] of Object.entries(subjects)) {
    const actual = flat.filter(s => s === sub).length;
    if (actual > Number(count)) score -= (actual - Number(count)) * 5;
    else score += actual; // reward using all slots
  }

  // 3. Penalize 3 consecutive periods for students (non-free)
  timetable.forEach(day => {
    for (let i = 0; i < day.length - 2; i++) {
      if (day[i] !== "" && day[i + 1] !== "" && day[i + 2] !== "") {
        score -= 5;
      }
    }
  });

  return score;
}

function crossover(parent1, parent2) {
  // Day-level crossover
  const point = Math.floor(Math.random() * days.length);
  return parent1.slice(0, point).concat(parent2.slice(point));
}

function mutate(timetable) {
  // Swap two random slots
  const d1 = Math.floor(Math.random() * days.length);
  const s1 = Math.floor(Math.random() * slotsPerDay);
  let d2 = Math.floor(Math.random() * days.length);
  let s2 = Math.floor(Math.random() * slotsPerDay);
  while (d1 === d2 && s1 === s2) {
    d2 = Math.floor(Math.random() * days.length);
    s2 = Math.floor(Math.random() * slotsPerDay);
  }
  [timetable[d1][s1], timetable[d2][s2]] = [timetable[d2][s2], timetable[d1][s1]];
  return timetable;
}

function geneticAlgorithm(generations = 300, popSize = 50) {
  let population = Array.from({ length: popSize }, generateInitialTimetable);

  for (let gen = 0; gen < generations; gen++) {
    population.sort((a, b) => fitness(b) - fitness(a));
    const best = population[0];

    // Early stop if very good
    if (fitness(best) >= 90) return best;

    const newPopulation = population.slice(0, popSize / 2);

    while (newPopulation.length < popSize) {
      const p1 = population[Math.floor(Math.random() * 10)];
      const p2 = population[Math.floor(Math.random() * 10)];
      let child = crossover(p1, p2);
      if (Math.random() < 0.3) child = mutate(child);
      newPopulation.push(child);
    }

    population = newPopulation;
  }

  population.sort((a, b) => fitness(b) - fitness(a));
  return population[0];
}


// ---------- API ROUTES ----------

// Generate timetable
app.get("/api/generate-timetable", (req, res) => {
  const best = geneticAlgorithm();
  const result = {};
  days.forEach((d, i) => {
    result[d] = best[i];
  });
  res.json(result);
});

// Get all subjects
app.get("/api/subjects", (req, res) => {
  // return a plain object of subjects (numbers)
  const normalized = {};
  Object.entries(subjects).forEach(([k, v]) => {
    normalized[k] = Number(v) || 0;
  });
  res.json(normalized);
});

// Add a new subject
app.post("/api/subjects", (req, res) => {
  const { name, count } = req.body;
  const trimmed = typeof name === "string" ? name.trim() : "";

  if (!trimmed) {
    return res.status(400).json({ error: "Course name is required" });
  }

  const numericCount = Number(count);
  if (!numericCount || Number.isNaN(numericCount) || numericCount <= 0) {
    return res.status(400).json({ error: "Count must be a positive number" });
  }

  subjects[trimmed] = numericCount; // add or update subject (ensured numeric)

  // return authoritative full subjects list
  const normalized = {};
  Object.entries(subjects).forEach(([k, v]) => {
    normalized[k] = Number(v) || 0;
  });

  res.json(normalized);
});

// ---------------- CALENDAR ----------------
// Static catalog of holidays and events tailored for Jharkhand
// Fields: { date: 'YYYY-MM-DD', title: string, type: 'national'|'state'|'local'|'event', color?: string }
// Note: Some festivals move each year; below includes curated 2025 dates and fixed-date holidays.
const CALENDAR_EVENTS = [
  // National holidays (India)
  { date: "2025-01-01", title: "New Year's Day", type: "event" },
  { date: "2025-01-26", title: "Republic Day", type: "national" },
  { date: "2025-01-14", title: "Makar Sankranti / Pongal", type: "national" },
  {
    date: "2025-03-08",
    title: "International Women's Day (Observance)",
    type: "event",
  },
  { date: "2025-08-15", title: "Independence Day", type: "national" },
  { date: "2025-10-02", title: "Gandhi Jayanti", type: "national" },
  { date: "2025-12-25", title: "Christmas", type: "national" },
  { date: "2025-04-14", title: "Ambedkar Jayanti", type: "national" },
  { date: "2025-05-01", title: "Labour Day / May Day", type: "national" },
  { date: "2025-09-05", title: "Teachers' Day (India)", type: "event" },
  { date: "2025-11-14", title: "Children's Day (India)", type: "event" },
  { date: "2025-04-18", title: "Good Friday", type: "national" },
  { date: "2025-05-12", title: "Buddha Purnima (approx)", type: "national" },

  // Jharkhand State holidays
  {
    date: "2025-11-15",
    title: "Jharkhand Foundation Day (Birsa Munda Jayanti)",
    type: "state",
  },
  // Many tribal festivals are date-shifted; provide 2025 representative dates
  { date: "2025-04-06", title: "Sarhul (Ranchi region)", type: "state" },
  { date: "2025-09-13", title: "Karma Festival (approx)", type: "state" },
  { date: "2025-09-10", title: "Karma Festival (observed)", type: "state" },
  {
    date: "2025-11-17",
    title: "Chhath Puja (Nahay Khay) (approx)",
    type: "local",
  },
  {
    date: "2025-11-18",
    title: "Chhath Puja (Kharna/Arghya) (approx)",
    type: "local",
  },

  // Local/Regional observances & events (Jharkhand)
  { date: "2025-01-23", title: "Netaji Jayanti (observed)", type: "local" },
  { date: "2025-03-29", title: "Holi (approx, 2025)", type: "national" },
  {
    date: "2025-03-31",
    title: "Holi - Second Day (Dhulandi) (approx)",
    type: "national",
  },
  {
    date: "2025-04-10",
    title: "Eid al-Fitr (approx, subject to moon)",
    type: "local",
  },
  {
    date: "2025-10-01",
    title: "Durga Puja (Saptami-Navami, approx)",
    type: "local",
  },
  {
    date: "2025-10-02",
    title: "Durga Puja (Ashtami, overlaps Gandhi Jayanti)",
    type: "local",
  },
  { date: "2025-10-03", title: "Durga Puja (Navami)", type: "local" },
  { date: "2025-10-04", title: "Vijaya Dashami (Dussehra)", type: "local" },
  { date: "2025-10-20", title: "Diwali (approx)", type: "local" },
  { date: "2025-10-21", title: "Govardhan Puja (approx)", type: "local" },
  { date: "2025-10-22", title: "Bhai Dooj (approx)", type: "local" },
  { date: "2025-08-17", title: "Janmashtami (observed)", type: "local" },
  {
    date: "2025-09-17",
    title: "Janmashtami (regional observance)",
    type: "local",
  },
  { date: "2025-08-09", title: "Raksha Bandhan (approx)", type: "local" },

  // Generic academic events/examples
  {
    date: "2025-02-10",
    title: "University Sports Meet (Ranchi)",
    type: "event",
  },
  { date: "2025-05-05", title: "Semester Exams Begin", type: "event" },
  { date: "2025-05-25", title: "Semester Exams End", type: "event" },

  // International observances (non-holiday) commonly noted
  { date: "2025-06-21", title: "International Day of Yoga", type: "event" },
  { date: "2025-04-22", title: "Earth Day", type: "event" },
  { date: "2025-06-05", title: "World Environment Day", type: "event" },
  { date: "2025-10-05", title: "World Teachers' Day", type: "event" },
];

function isValidYearMonth(year, month) {
  const y = Number(year);
  const m = Number(month);
  return Number.isInteger(y) && Number.isInteger(m) && m >= 1 && m <= 12;
}

// GET /api/calendar?year=2025&month=9
// Returns events for the given month in Jharkhand with type categorization and default colors
app.get("/api/calendar", (req, res) => {
  const { year, month } = req.query;

  if (!isValidYearMonth(year, month)) {
    return res.status(400).json({ error: "Invalid 'year' or 'month' (1-12)" });
  }

  const pad = (n) => String(n).padStart(2, "0");
  const ym = `${year}-${pad(month)}`;

  const DEFAULT_COLORS = {
    national: "#EF4444", // red
    state: "#10B981", // emerald
    local: "#3B82F6", // blue
    event: "#F59E0B", // amber
  };

  const events = CALENDAR_EVENTS.filter((e) => e.date.startsWith(ym)).map(
    (e) => ({ ...e, color: e.color || DEFAULT_COLORS[e.type] })
  );

  return res.json({
    year: Number(year),
    month: Number(month),
    region: "Jharkhand",
    events,
    colors: DEFAULT_COLORS,
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
