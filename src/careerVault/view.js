function populateVaultForm(vault, vaultFields) {
  vaultFields.name.value = vault.person.name || "";
  vaultFields.location.value = vault.person.location || "";
  vaultFields.email.value = vault.person.email || "";
  vaultFields.phone.value = vault.person.phone || "";
  vaultFields.professionalSummary.value = vault.professionalSummary || "";
}

function renderVaultLists(vault, lists, actions) {
  renderRoles(vault.roles, lists.roles, actions);
  renderSimpleList(vault.skills, lists.skills, "skills", actions.onRemove);
  renderSimpleList(vault.tools, lists.tools, "tools", actions.onRemove);
  renderSimpleList(vault.accomplishments, lists.accomplishments, "accomplishments", actions.onRemove);
  renderSimpleList(vault.metrics, lists.metrics, "metrics", actions.onRemove);
  renderSimpleList(vault.projects, lists.projects, "projects", actions.onRemove);
  renderSimpleList(vault.stories, lists.stories, "stories", actions.onRemove);
  renderSimpleList(vault.education, lists.education, "education", actions.onRemove);
  renderSimpleList(vault.certifications, lists.certifications, "certifications", actions.onRemove);
  renderSimpleList(vault.careerPreferences, lists.careerPreferences, "careerPreferences", actions.onRemove);
}

function renderRoles(roles, node, actions) {
  node.innerHTML = "";

  roles.forEach((role, index) => {
    const dates = [role.start, role.end].filter(Boolean).join(" - ");
    const label = `${role.title || "Untitled Role"} at ${role.company || "Unknown Company"}${dates ? ` (${dates})` : ""}`;
    const isEditing = role.id && role.id === actions.editingRoleId;
    node.appendChild(createRoleListItem(label, role.id, index, isEditing, actions));
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

function createRoleListItem(label, roleId, index, isEditing, actions) {
  const li = document.createElement("li");
  li.className = "vault-list-item";
  li.dataset = li.dataset || {};
  li.dataset.roleId = roleId || "";

  const content = document.createElement("span");
  content.textContent = `${label}${isEditing ? " (Editing)" : ""}`;

  const actionRow = document.createElement("div");
  actionRow.className = "button-row";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "small-button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => actions.onEditRole(roleId));

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "small-button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => actions.onRemove("roles", index));

  actionRow.appendChild(editButton);
  actionRow.appendChild(removeButton);
  li.appendChild(content);
  li.appendChild(actionRow);

  return li;
}

function renderRoleEditorState(roleEditor, editingRoleId, message = "") {
  roleEditor.submit.textContent = editingRoleId ? "Save Changes" : "Add Role";
  roleEditor.cancel.hidden = !editingRoleId;
  roleEditor.status.textContent = message || (editingRoleId ? "Editing saved role" : "");
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
  renderRoleEditorState,
  setVaultStatus,
};
