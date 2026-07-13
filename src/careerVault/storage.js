const VAULT_STORAGE_KEY = "rightforme-career-vault";
let roleIdCounter = 0;

const defaultVault = {
  person: {
    name: "",
    location: "",
    email: "",
    phone: "",
  },
  professionalSummary: "",
  roles: [],
  skills: [],
  tools: [],
  accomplishments: [],
  metrics: [],
  projects: [],
  stories: [],
  education: [],
  certifications: [],
  careerPreferences: [],
};

function createDefaultVault() {
  return structuredClone(defaultVault);
}

function loadVault() {
  const saved = localStorage.getItem(VAULT_STORAGE_KEY);

  if (!saved) {
    return createDefaultVault();
  }

  try {
    const parsed = JSON.parse(saved);
    const normalized = normalizeVault(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      saveVault(normalized);
    }
    return normalized;
  } catch {
    return createDefaultVault();
  }
}

function saveVault(vault) {
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(normalizeVault(vault), null, 2));
}

function normalizeVault(vault = {}) {
  const base = createDefaultVault();

  return {
    ...base,
    ...vault,
    person: {
      ...base.person,
      ...(vault.person || {}),
    },
    roles: normalizeRoles(vault.roles),
    skills: normalizeArray(vault.skills),
    tools: normalizeArray(vault.tools),
    accomplishments: normalizeArray(vault.accomplishments),
    metrics: normalizeArray(vault.metrics),
    projects: normalizeArray(vault.projects),
    stories: normalizeArray(vault.stories),
    education: normalizeArray(vault.education),
    certifications: normalizeArray(vault.certifications),
    careerPreferences: normalizeArray(vault.careerPreferences),
    professionalSummary: String(vault.professionalSummary || ""),
  };
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeRoles(value) {
  return normalizeArray(value).map((role) => normalizeRole(role));
}

function normalizeRole(role = {}) {
  const normalized = {
    id: normalizeRoleId(role.id),
    company: String(role.company || ""),
    title: String(role.title || ""),
    start: String(role.start || ""),
    end: String(role.end || ""),
    summary: String(role.summary || ""),
  };

  Object.keys(role || {}).forEach((key) => {
    if (!(key in normalized)) {
      normalized[key] = role[key];
    }
  });

  return normalized;
}

function normalizeRoleId(value) {
  const id = String(value || "").trim();
  return id || generateRoleId();
}

function generateRoleId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  roleIdCounter += 1;
  return `role_${Date.now().toString(36)}_${roleIdCounter.toString(36)}`;
}

window.RightForMeCareerVaultStorage = {
  loadVault,
  saveVault,
  createDefaultVault,
  normalizeVault,
  normalizeRole,
  generateRoleId,
};
