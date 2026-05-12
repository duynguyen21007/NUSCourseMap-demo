// --- APP DATA ---
const allModules = {
  CS1101S: { title: "Programming Methodology", mcs: 4 },
  CS2030S: { title: "Programming Methodology II", mcs: 4 },
  CS2040S: { title: "Data Structures and Algorithms", mcs: 4 },
  CS2109S: { title: "Introduction to AI and ML", mcs: 4 },
  MA1521: { title: "Calculus for Computing", mcs: 4 },
  GEA1000: { title: "Quantitative Reasoning with Data", mcs: 4 },
  MA2001: { title: "Linear Algebra I", mcs: 4 },
  MA2002: { title: "Calculus", mcs: 4 },
  ACC1701: { title: "Accounting", mcs: 4 },
  IS1108: { title: "Digital Ethics", mcs: 4 },
};

const programs = {
  AI_MAJOR: {
    totalMcs: 160,
    cores: ["CS2030S", "CS2040S", "CS2109S", "MA1521", "GEA1000"],
  },
  CS_MAJOR: { totalMcs: 160, cores: ["CS2030S", "CS2040S", "MA1521"] },
  MATH_2ND_MAJOR: {
    totalMcs: 40,
    cores: ["CS2030S", "CS2040S", "MA2001", "MA2002"],
  },
  BIZ_2ND_DEGREE: { totalMcs: 80, cores: ["GEA1000", "ACC1701"] },
};

// --- 1. NAVIGATION LOGIC ---
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".app-view");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all
    navItems.forEach((nav) => nav.classList.remove("active"));
    views.forEach((view) => view.classList.remove("active"));

    // Add active class to clicked
    item.classList.add("active");
    const targetView = document.getElementById(
      item.getAttribute("data-target"),
    );
    targetView.classList.add("active");
  });
});

// --- 2. CURRICULUM BROWSER LOGIC ---
const tableBody = document.getElementById("browser-table-body");
const searchInput = document.getElementById("module-search");

function renderTable(filter = "") {
  tableBody.innerHTML = "";
  Object.keys(allModules).forEach((code) => {
    if (code.toLowerCase().includes(filter.toLowerCase())) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td><strong>${code}</strong></td>
                <td>${allModules[code].title}</td>
                <td>${allModules[code].mcs}</td>
            `;
      tableBody.appendChild(tr);
    }
  });
}
searchInput.addEventListener("input", (e) => renderTable(e.target.value));
renderTable();

// --- 3. COMPARATOR LOGIC (Static Demo) ---
function renderComparator() {
  const aiList = document.getElementById("comp-ai-list");
  const overlapList = document.getElementById("comp-overlap-list");
  const mathList = document.getElementById("comp-math-list");

  aiList.innerHTML = `<div class="mod-tag">CS2109S</div><div class="mod-tag">MA1521</div>`;
  overlapList.innerHTML = `<div class="mod-tag green">CS2030S</div><div class="mod-tag green">CS2040S</div>`;
  mathList.innerHTML = `<div class="mod-tag">MA2001</div><div class="mod-tag">MA2002</div>`;
}
renderComparator();

// --- 4. PLANNER DRAG AND DROP LOGIC ---
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  // Ensure we are dropping into the column container, not inside another card
  if (ev.target.classList.contains("sem-column")) {
    ev.target.appendChild(document.getElementById(data));
  }
}

// --- 5. ENGINE LOGIC ---
const primarySelect = document.getElementById("primary-select");
const secondarySelect = document.getElementById("secondary-select");
const statStandard = document.getElementById("stat-standard");
const statOverlap = document.getElementById("stat-overlap");
const statTotal = document.getElementById("stat-total");
const labelOverlap = document.getElementById("label-overlap");
const barPrimary = document.getElementById("bar-primary");
const barOverlap = document.getElementById("bar-overlap");
const barSecondary = document.getElementById("bar-secondary");

function calculateDegrees() {
  const primaryId = primarySelect.value;
  const secondaryId = secondarySelect.value;

  const primary = programs[primaryId];
  const secondary = programs[secondaryId];

  let overlapMcs = 0;
  primary.cores.forEach((code) => {
    if (secondary.cores.includes(code)) {
      overlapMcs += allModules[code].mcs;
    }
  });

  const standardMcs = primary.totalMcs;
  const secondaryMcs = secondary.totalMcs;
  const newTotal = standardMcs + secondaryMcs - overlapMcs;

  statStandard.innerText = standardMcs;
  statOverlap.innerText = overlapMcs;
  statTotal.innerText = newTotal;
  labelOverlap.innerText = `Overlap (${overlapMcs} MCs)`;

  const primaryPct = ((standardMcs - overlapMcs) / newTotal) * 100;
  const overlapPct = (overlapMcs / newTotal) * 100;
  const secondaryPct = ((secondaryMcs - overlapMcs) / newTotal) * 100;

  barPrimary.style.width = `${primaryPct}%`;
  barOverlap.style.width = `${overlapPct}%`;
  barSecondary.style.width = `${secondaryPct}%`;
}

primarySelect.addEventListener("change", calculateDegrees);
secondarySelect.addEventListener("change", calculateDegrees);
calculateDegrees();
