function populateVaultForm(vault, vaultFields) {
  vaultFields.name.value = vault.person.name || "";
  vaultFields.location.value = vault.person.location || "";
  vaultFields.email.value = vault.person.email || "";
  vaultFields.phone.value = vault.person.phone || "";
}

function renderVaultLists(vault, lists, onRemove) {
  renderRoles(vault.roles, lists.roles, onRemove);
  renderSimpleList(vault.skills, lists.skills, "skills", onRemove);
  renderSimpleList(vault.tools, lists.tools, "tools", onRemove);
  renderSimpleList(vault.accomplishments, lists.accomplishments, "accomplishments", onRemove);
}

function renderRoles(roles, node, onRemove) {
  node.innerHTML = "";

  roles.forEach((role, index) => {
    const dates = [role.start, role.end].filter(Boolean).join(" - ");
    const label = `${role.title || "Untitled Role"} at ${role.company || "Unknown Company"}${dates ? ` (${dates})` : ""}`;

    node.appendChild(createListItem(label, () => onRemove("roles", index)));
  });
}

function renderSimpleList(items, node, type, onRemove) {
  node.innerHTML = "";

  items.forEach((item, index) => {
    node.appendChild(createListItem(item, () => onRemove(type, index)));
  });
}

function createListItem(label, onRemove) {
  const li = document.createElement("li");
  li.className = "vault-list-item";

  const content = document.createElement("span");
  content.textContent = label;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "small-button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", onRemove);

  li.appendChild(content);
  li.appendChild(removeButton);

  return li;
}

function setVaultStatus(node, message) {
  node.textContent = message;

  window.setTimeout(() => {
    if (node.textContent === message) {
      node.textContent = "";
    }
  }, 3000);
}

window.RightForMeCareerVaultView = {
  populateVaultForm,
  renderVaultLists,
  setVaultStatus,
};