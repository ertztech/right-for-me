function initializeCareerVaultController(vaultStore) {
  const vaultFields = {
    name: document.querySelector("#vault-name"),
    location: document.querySelector("#vault-location"),
    email: document.querySelector("#vault-email"),
    phone: document.querySelector("#vault-phone"),
    professionalSummary: document.querySelector("#profile-summary"),
  };

  const roleFields = {
    company: document.querySelector("#role-company"),
    title: document.querySelector("#role-title"),
    start: document.querySelector("#role-start"),
    end: document.querySelector("#role-end"),
    summary: document.querySelector("#role-summary-input"),
  };

  const lists = {
    roles: document.querySelector("#roles-list"),
    skills: document.querySelector("#skills-list"),
    tools: document.querySelector("#tools-list"),
    accomplishments: document.querySelector("#accomplishments-list"),
    metrics: document.querySelector("#metrics-list"),
    projects: document.querySelector("#projects-list"),
    stories: document.querySelector("#stories-list"),
    education: document.querySelector("#education-list"),
    certifications: document.querySelector("#certifications-list"),
    careerPreferences: document.querySelector("#career-preferences-list"),
  };

  const status = document.querySelector("#vault-status");

  function render() {
    const vault = vaultStore.getVault();
    RightForMeCareerVaultView.populateVaultForm(vault, vaultFields);
    RightForMeCareerVaultView.renderVaultLists(vault, lists, removeItem);
  }

  function persist(message = "Profile saved.") {
    updatePersonFromForm();
    vaultStore.saveVault();
    RightForMeCareerVaultView.setVaultStatus(status, message);
  }

  function updatePersonFromForm() {
    const vault = vaultStore.getVault();

    vault.person = {
      name: vaultFields.name.value.trim(),
      location: vaultFields.location.value.trim(),
      email: vaultFields.email.value.trim(),
      phone: vaultFields.phone.value.trim(),
    };
    vault.professionalSummary = vaultFields.professionalSummary.value.trim();
  }

  function syncFromForm() {
    updatePersonFromForm();
  }

  function addRole() {
    const vault = vaultStore.getVault();

    const role = {
      company: roleFields.company.value.trim(),
      title: roleFields.title.value.trim(),
      start: roleFields.start.value.trim(),
      end: roleFields.end.value.trim(),
      summary: roleFields.summary.value.trim(),
    };

    if (!role.company && !role.title) {
      RightForMeCareerVaultView.setVaultStatus(status, "Add at least a company or title before saving a role.");
      return;
    }

    vault.roles.push(role);

    roleFields.company.value = "";
    roleFields.title.value = "";
    roleFields.start.value = "";
    roleFields.end.value = "";
    roleFields.summary.value = "";

    persist();
    render();
  }

  function addSimpleItem(type, inputSelector) {
    const input = document.querySelector(inputSelector);
    const value = input.value.trim();

    if (!value) {
      RightForMeCareerVaultView.setVaultStatus(status, "Enter a value before adding it.");
      return;
    }

    const vault = vaultStore.getVault();
    vault[type].push(value);
    input.value = "";

    persist();
    render();
  }

  function removeItem(type, index) {
    const vault = vaultStore.getVault();
    vault[type].splice(index, 1);

    persist();
    render();
  }

  function exportVault() {
    persist("Profile exported.");

    const vault = vaultStore.getVault();
    const blob = new Blob([JSON.stringify(vault, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nextmove-profile.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  document.querySelector("#save-vault").addEventListener("click", () => persist());
  document.querySelector("#export-vault").addEventListener("click", exportVault);
  document.querySelector("#add-role").addEventListener("click", addRole);
  document.querySelector("#add-skill").addEventListener("click", () => addSimpleItem("skills", "#skill-input"));
  document.querySelector("#add-tool").addEventListener("click", () => addSimpleItem("tools", "#tool-input"));
  document.querySelector("#add-accomplishment").addEventListener("click", () => addSimpleItem("accomplishments", "#accomplishment-input"));
  document.querySelector("#add-metric").addEventListener("click", () => addSimpleItem("metrics", "#metric-input"));
  document.querySelector("#add-project").addEventListener("click", () => addSimpleItem("projects", "#project-input"));
  document.querySelector("#add-story").addEventListener("click", () => addSimpleItem("stories", "#story-input"));
  document.querySelector("#add-education").addEventListener("click", () => addSimpleItem("education", "#education-input"));
  document.querySelector("#add-certification").addEventListener("click", () => addSimpleItem("certifications", "#certification-input"));
  document.querySelector("#add-career-preference").addEventListener("click", () => addSimpleItem("careerPreferences", "#career-preference-input"));

  render();

  return {
    render,
    syncFromForm,
  };
}

window.RightForMeCareerVaultController = {
  initializeCareerVaultController,
};
