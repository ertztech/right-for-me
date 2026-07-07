function initializeCareerVaultController(vaultStore) {
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

  const lists = {
    roles: document.querySelector("#roles-list"),
    skills: document.querySelector("#skills-list"),
    tools: document.querySelector("#tools-list"),
    accomplishments: document.querySelector("#accomplishments-list"),
  };

  const status = document.querySelector("#vault-status");

  function render() {
    const vault = vaultStore.getVault();
    RightForMeCareerVaultView.populateVaultForm(vault, vaultFields);
    RightForMeCareerVaultView.renderVaultLists(vault, lists, removeItem);
  }

  function persist(message = "Professional Experience saved.") {
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
    persist("Professional Experience exported.");

    const vault = vaultStore.getVault();
    const blob = new Blob([JSON.stringify(vault, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "career-vault.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  document.querySelector("#save-vault").addEventListener("click", () => persist());
  document.querySelector("#export-vault").addEventListener("click", exportVault);
  document.querySelector("#add-role").addEventListener("click", addRole);
  document.querySelector("#add-skill").addEventListener("click", () => addSimpleItem("skills", "#skill-input"));
  document.querySelector("#add-tool").addEventListener("click", () => addSimpleItem("tools", "#tool-input"));
  document.querySelector("#add-accomplishment").addEventListener("click", () => addSimpleItem("accomplishments", "#accomplishment-input"));

  render();

  return {
    render,
    syncFromForm,
  };
}

window.RightForMeCareerVaultController = {
  initializeCareerVaultController,
};
