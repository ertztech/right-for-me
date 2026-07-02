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

function createDefaultVault() {
  return structuredClone(defaultVault);
}

function loadVault() {
  const saved = localStorage.getItem(VAULT_STORAGE_KEY);

  if (!saved) {
    return createDefaultVault();
  }

  try {
    return {
      ...createDefaultVault(),
      ...JSON.parse(saved),
    };
  } catch {
    return createDefaultVault();
  }
}

function saveVault(vault) {
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault, null, 2));
}

window.RightForMeCareerVaultStorage = {
  loadVault,
  saveVault,
  createDefaultVault,
};