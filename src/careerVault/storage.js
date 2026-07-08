const VAULT_STORAGE_KEY = "rightforme-career-vault";

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
    return normalizeVault(JSON.parse(saved));
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
    roles: normalizeArray(vault.roles),
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

window.RightForMeCareerVaultStorage = {
  loadVault,
  saveVault,
  createDefaultVault,
  normalizeVault,
};
