const form = document.querySelector("#analysis-form");
const jobInput = document.querySelector("#job-description");
const backgroundInput = document.querySelector("#candidate-background");
const emptyState = document.querySelector("#empty-state");
const results = document.querySelector("#results");

const fitScore = document.querySelector("#fit-score");
const stretchScore = document.querySelector("#stretch-score");
const recommendation = document.querySelector("#recommendation");
const roleSummary = document.querySelector("#role-summary");
const evidenceList = document.querySelector("#evidence-list");
const stretchList = document.querySelector("#stretch-list");
const strategy = document.querySelector("#strategy");

const skillSignals = [
  "javascript",
  "typescript",
  "react",
  "node",
  "python",
  "sql",
  "excel",
  "salesforce",
  "crm",
  "customer",
  "support",
  "analytics",
  "data",
  "project management",
  "communication",
  "leadership",
  "training",
  "documentation",
  "operations",
  "automation",
  "api",
  "testing",
  "security",
  "cloud",
  "aws",
  "azure",
  "product",
  "design",
  "research",
  "stakeholder",
];

const senioritySignals = [
  "senior",
  "lead",
  "manager",
  "director",
  "principal",
  "architect",
  "5+ years",
  "7+ years",
  "10+ years",
];

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function findSignals(text, signals) {
  const normalized = normalize(text);
  return signals.filter((signal) => normalized.includes(signal));
}

function unique(items) {
  return [...new Set(items)];
}

function percent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function renderList(node, items) {
  node.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
}

function analyze(jobText, backgroundText) {
  const jobSignals = unique(findSignals(jobText, skillSignals));
  const candidateSignals = unique(findSignals(backgroundText, skillSignals));
  const matchingSignals = jobSignals.filter((signal) => candidateSignals.includes(signal));
  const missingSignals = jobSignals.filter((signal) => !candidateSignals.includes(signal));
  const seniorityMatches = findSignals(jobText, senioritySignals);

  const hasBackground = normalize(backgroundText).length > 80;
  const baseFit = jobSignals.length === 0 ? 42 : (matchingSignals.length / jobSignals.length) * 78;
  const backgroundBonus = hasBackground ? 10 : 0;
  const fit = percent(baseFit + backgroundBonus);
  const stretch = percent(100 - fit + seniorityMatches.length * 8 + Math.min(missingSignals.length * 3, 18));

  let nextMove = "Maybe";
  if (fit >= 68 && stretch <= 58) nextMove = "Apply";
  if (fit >= 48 && stretch > 58) nextMove = "Healthy stretch";
  if (fit < 36 && stretch > 72) nextMove = "Save for later";

  const evidence = matchingSignals.length
    ? matchingSignals.map((signal) => `Emphasize your ${signal} experience because it appears directly relevant to this role.`)
    : [
        hasBackground
          ? "Use specific projects, outcomes, and responsibilities from your background to prove adjacent experience."
          : "Add your background to identify evidence that maps to this role.",
      ];

  const stretchAreas = missingSignals.length
    ? missingSignals.slice(0, 7).map((signal) => `The role appears to value ${signal}; prepare an honest bridge if your experience is adjacent.`)
    : ["No obvious keyword gaps found in this first-pass analysis. Look closely at seniority, domain, and scope expectations."];

  if (seniorityMatches.length) {
    stretchAreas.push("The posting includes seniority signals. Be ready to show ownership, judgment, and outcomes.");
  }

  return {
    fit,
    stretch,
    nextMove,
    summary: `This role appears to emphasize ${jobSignals.slice(0, 6).join(", ") || "a mix of responsibilities that need closer review"}. The first-pass read is ${fit >= 60 ? "promising" : "still developing"}, with ${stretch >= 60 ? "meaningful stretch areas" : "manageable stretch areas"}.`,
    evidence,
    stretchAreas,
    strategy:
      nextMove === "Apply"
        ? "Apply with a direct evidence-first story. Lead with the strongest matching responsibilities, then use concise examples that show results."
        : nextMove === "Healthy stretch"
          ? "Treat this as a stretch application. Be transparent about gaps, but frame adjacent experience as proof that you can learn the missing pieces quickly."
          : nextMove === "Save for later"
            ? "This may be a future-fit role. Save it, identify the repeated gaps, and build one small project or learning proof around the most important missing area."
            : "Do one more pass before deciding. Add more background detail, compare the must-haves against real evidence, and apply if the stretch feels energizing rather than random.",
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const analysis = analyze(jobInput.value, backgroundInput.value);

  fitScore.textContent = `${analysis.fit}%`;
  stretchScore.textContent = `${analysis.stretch}%`;
  recommendation.textContent = analysis.nextMove;
  roleSummary.textContent = analysis.summary;
  strategy.textContent = analysis.strategy;
  renderList(evidenceList, analysis.evidence);
  renderList(stretchList, analysis.stretchAreas);

  emptyState.classList.add("hidden");
  results.classList.remove("hidden");
});
