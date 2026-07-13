function initializeCareerVaultController(vaultStore) {
  let editingRoleId = "";
  let roleEditorMessage = "";
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
  const roleEditor = {
    submit: document.querySelector("#add-role"),
    cancel: document.querySelector("#cancel-role-edit"),
    status: document.querySelector("#role-edit-status"),
  };

  const status = document.querySelector("#vault-status");

  function render() {
    const vault = vaultStore.getVault();
    RightForMeCareerVaultView.populateVaultForm(vault, vaultFields);
    RightForMeCareerVaultView.renderVaultLists(vault, lists, {
      onRemove: removeItem,
      onEditRole: enterRoleEditMode,
      editingRoleId,
    });
    RightForMeCareerVaultView.renderRoleEditorState(roleEditor, editingRoleId, roleEditorMessage);
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

  function readRoleFromForm() {
    return {
      company: roleFields.company.value.trim(),
      title: roleFields.title.value.trim(),
      start: roleFields.start.value.trim(),
      end: roleFields.end.value.trim(),
      summary: roleFields.summary.value.trim(),
    };
  }

  function populateRoleForm(role = {}) {
    roleFields.company.value = role.company || "";
    roleFields.title.value = role.title || "";
    roleFields.start.value = role.start || "";
    roleFields.end.value = role.end || "";
    roleFields.summary.value = role.summary || "";
  }

  function clearRoleForm() {
    populateRoleForm({});
  }

  function validateRole(role) {
    if (!role.company || !role.title) {
      roleEditorMessage = "Enter both a company and title before saving a role.";
      RightForMeCareerVaultView.setVaultStatus(status, "Enter both a company and title before saving a role.");
      return false;
    }

    return true;
  }

  function findRoleIndexById(roleId) {
    return vaultStore.getVault().roles.findIndex((role) => role.id === roleId);
  }

  function exitRoleEditMode() {
    editingRoleId = "";
    roleEditorMessage = "";
    clearRoleForm();
  }

  function enterRoleEditMode(roleId) {
    const role = vaultStore.getVault().roles.find((item) => item.id === roleId);
    if (!role) {
      exitRoleEditMode();
      render();
      return;
    }

    editingRoleId = role.id;
    roleEditorMessage = "";
    populateRoleForm(role);
    render();
  }

  function saveRole() {
    const vault = vaultStore.getVault();
    const roleValues = readRoleFromForm();

    if (!validateRole(roleValues)) {
      render();
      return;
    }

    roleEditorMessage = "";

    if (editingRoleId) {
      const roleIndex = findRoleIndexById(editingRoleId);
      if (roleIndex === -1) {
        exitRoleEditMode();
        RightForMeCareerVaultView.setVaultStatus(status, "That saved role is no longer available to edit.");
        render();
        return;
      }

      vault.roles[roleIndex] = RightForMeCareerVaultStorage.normalizeRole({
        ...vault.roles[roleIndex],
        ...roleValues,
        id: vault.roles[roleIndex].id,
      });
      persist("Role updated.");
      exitRoleEditMode();
      render();
      return;
    }

    vault.roles.push(RightForMeCareerVaultStorage.normalizeRole(roleValues));
    clearRoleForm();
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
    if (type === "roles") {
      const role = vault.roles[index];
      vault.roles.splice(index, 1);
      if (role?.id && role.id === editingRoleId) {
        exitRoleEditMode();
      }
    } else {
      vault[type].splice(index, 1);
    }

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
  document.querySelector("#add-role").addEventListener("click", saveRole);
  document.querySelector("#cancel-role-edit").addEventListener("click", () => {
    exitRoleEditMode();
    render();
  });
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
