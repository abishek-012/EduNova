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

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
