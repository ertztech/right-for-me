const VAULT_STORAGE_KEY = "rightforme-career-vault";

const defaultVault = {
  person: {
    name: "",
    location: "",
    email: "",
    phone: "",
  },
  roles: [],
  skills: [],
  tools: [],
  accomplishments: [],
};

let careerVault = loadVault();

const vaultFields = {
  name: document.querySelector("#vault-name"),
  location: document.querySelector("#vault-location"),
  email: document.querySelector("#vault-email"),
  phone: document.querySelector("#vault-phone"),
};

const roleFields = {
  company: document.querySelector("#role-company"),
  title: document.querySelector("#role-title"),
  start: document.querySelector("#role-start"),
  end: document.querySelector("#role-end"),
  summary: document.querySelector("#role-summary-input"),
};

const saveVaultButton = document.querySelector("#save-vault");
const exportVaultButton = document.querySelector("#export-vault");
const addRoleButton = document.querySelector("#add-role");
const addSkillButton = document.querySelector("#add-skill");
const addToolButton = document.querySelector("#add-tool");
const addAccomplishmentButton = document.querySelector("#add-accomplishment");

const skillInput = document.querySelector("#skill-input");
const toolInput = document.querySelector("#tool-input");
const accomplishmentInput = document.querySelector("#accomplishment-input");

const rolesList = document.querySelector("#roles-list");
const skillsList = document.querySelector("#skills-list");
const toolsList = document.querySelector("#tools-list");
const accomplishmentsList = document.querySelector("#accomplishments-list");
const vaultStatus = document.querySelector("#vault-status");

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

function loadVault() {
  const saved = localStorage.getItem(VAULT_STORAGE_KEY);

  if (!saved) {
    return structuredClone(defaultVault);
  }

  try {
    return {
      ...structuredClone(defaultVault),
      ...JSON.parse(saved),
    };
  } catch {
    return structuredClone(defaultVault);
  }
}

function saveVault() {
  careerVault.person = {
    name: vaultFields.name.value.trim(),
    location: vaultFields.location.value.trim(),
    email: vaultFields.email.value.trim(),
    phone: vaultFields.phone.value.trim(),
  };

  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(careerVault, null, 2));
  setStatus("Career Vault saved.");
}

function populateVaultForm() {
  vaultFields.name.value = careerVault.person.name || "";
  vaultFields.location.value = careerVault.person.location || "";
  vaultFields.email.value = careerVault.person.email || "";
  vaultFields.phone.value = careerVault.person.phone || "";

  renderVaultLists();
}

function addRole() {
  const role = {
    company: roleFields.company.value.trim(),
    title: roleFields.title.value.trim(),
    start: roleFields.start.value.trim(),
    end: roleFields.end.value.trim(),
    summary: roleFields.summary.value.trim(),
  };

  if (!role.company && !role.title) {
    setStatus("Add at least a company or title before saving a role.");
    return;
  }

  careerVault.roles.push(role);

  roleFields.company.value = "";
  roleFields.title.value = "";
  roleFields.start.value = "";
  roleFields.end.value = "";
  roleFields.summary.value = "";

  saveVault();
  renderVaultLists();
}

function addListItem(type, input) {
  const value = input.value.trim();

  if (!value) {
    setStatus(`Enter a ${type.slice(0, -1)} before adding it.`);
    return;
  }

  careerVault[type].push(value);
  input.value = "";

  saveVault();
  renderVaultLists();
}

function removeListItem(type, index) {
  careerVault[type].splice(index, 1);
  saveVault();
  renderVaultLists();
}

function renderVaultLists() {
  renderRoles();
  renderSimpleList(skillsList, "skills", careerVault.skills);
  renderSimpleList(toolsList, "tools", careerVault.tools);
  renderSimpleList(accomplishmentsList, "accomplishments", careerVault.accomplishments);
}

function renderRoles() {
  rolesList.innerHTML = "";

  careerVault.roles.forEach((role, index) => {
    const li = document.createElement("li");
    li.className = "vault-list-item";

    const content = document.createElement("span");
    const dates = [role.start, role.end].filter(Boolean).join(" - ");
    content.textContent = `${role.title || "Untitled Role"} at ${role.company || "Unknown Company"}${dates ? ` (${dates})` : ""}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeListItem("roles", index));

    li.appendChild(content);
    li.appendChild(removeButton);
    rolesList.appendChild(li);
  });
}

function renderSimpleList(node, type, items) {
  node.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "vault-list-item";

    const content = document.createElement("span");
    content.textContent = item;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeListItem(type, index));

    li.appendChild(content);
    li.appendChild(removeButton);
    node.appendChild(li);
  });
}

function exportVault() {
  saveVault();

  const blob = new Blob([JSON.stringify(careerVault, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "career-vault.json";
  link.click();

  URL.revokeObjectURL(url);
  setStatus("Career Vault exported.");
}

function setStatus(message) {
  vaultStatus.textContent = message;

  window.setTimeout(() => {
    if (vaultStatus.textContent === message) {
      vaultStatus.textContent = "";
    }
  }, 3000);
}

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

saveVaultButton.addEventListener("click", saveVault);
exportVaultButton.addEventListener("click", exportVault);
addRoleButton.addEventListener("click", addRole);
addSkillButton.addEventListener("click", () => addListItem("skills", skillInput));
addToolButton.addEventListener("click", () => addListItem("tools", toolInput));
addAccomplishmentButton.addEventListener("click", () => addListItem("accomplishments", accomplishmentInput));

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

populateVaultForm();