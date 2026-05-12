// 1. Mock Data Dictionary
const allModules = {
  CS2030S: { mcs: 4 },
  CS2040S: { mcs: 4 },
  CS2109S: { mcs: 4 },
  MA1521: { mcs: 4 },
  GEA1000: { mcs: 4 },
  MA2001: { mcs: 4 },
  MA2002: { mcs: 4 },
  ACC1701: { mcs: 4 },
  CS2102: { mcs: 4 },
};

const programs = {
  AI_MAJOR: {
    totalMcs: 160,
    cores: ["CS2030S", "CS2040S", "CS2109S", "MA1521", "GEA1000"],
  },
  CS_MAJOR: {
    totalMcs: 160,
    cores: ["CS2030S", "CS2040S", "MA1521", "CS2102"],
  },
  MATH_2ND_MAJOR: {
    totalMcs: 40,
    cores: ["CS2030S", "CS2040S", "MA2001", "MA2002"],
  },
  BIZ_2ND_DEGREE: { totalMcs: 80, cores: ["GEA1000", "ACC1701"] },
  DATA_MINOR: { totalMcs: 20, cores: ["CS2040S", "CS2102"] },
};

// 2. DOM Elements
const primarySelect = document.getElementById("primary-select");
const secondarySelect = document.getElementById("secondary-select");

const statStandard = document.getElementById("stat-standard");
const statOverlap = document.getElementById("stat-overlap");
const statTotal = document.getElementById("stat-total");
const labelOverlap = document.getElementById("label-overlap");

const barPrimary = document.getElementById("bar-primary");
const barOverlap = document.getElementById("bar-overlap");
const barSecondary = document.getElementById("bar-secondary");

// 3. Calculation Logic
function calculateDegrees() {
  const primaryId = primarySelect.value;
  const secondaryId = secondarySelect.value;

  const primary = programs[primaryId];
  const secondary = programs[secondaryId];

  // Find overlapping modules
  let overlapMcs = 0;
  primary.cores.forEach((code) => {
    if (secondary.cores.includes(code)) {
      overlapMcs += allModules[code].mcs;
    }
  });

  const standardMcs = primary.totalMcs;
  const secondaryMcs = secondary.totalMcs;
  const newTotal = standardMcs + secondaryMcs - overlapMcs;

  // Update Text
  statStandard.innerText = standardMcs;
  statOverlap.innerText = overlapMcs;
  statTotal.innerText = newTotal;
  labelOverlap.innerText = `Overlap (${overlapMcs} MCs)`;

  // Update Progress Bar Widths
  const primaryPct = ((standardMcs - overlapMcs) / newTotal) * 100;
  const overlapPct = (overlapMcs / newTotal) * 100;
  const secondaryPct = ((secondaryMcs - overlapMcs) / newTotal) * 100;

  barPrimary.style.width = `${primaryPct}%`;
  barOverlap.style.width = `${overlapPct}%`;
  barSecondary.style.width = `${secondaryPct}%`;
}

// 4. Event Listeners
primarySelect.addEventListener("change", calculateDegrees);
secondarySelect.addEventListener("change", calculateDegrees);

// Run once on load to set initial state
calculateDegrees();
