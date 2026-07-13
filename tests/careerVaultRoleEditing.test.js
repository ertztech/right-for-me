const assert = require("node:assert/strict");

function setupHarness({ initialStorageValue } = {}) {
  const elements = new Map();
  const storage = new Map();
  if (initialStorageValue) {
    storage.set("rightforme-career-vault", initialStorageValue);
  }

  function createElement(selector = "") {
    let innerHTML = "";
    const node = {
      selector,
      value: "",
      textContent: "",
      children: [],
      className: "",
      handlers: {},
      dataset: {},
      style: {},
      hidden: false,
      disabled: false,
      type: "",
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      click() {
        this.handlers.click?.({ target: this });
      },
    };

    Object.defineProperty(node, "innerHTML", {
      get() {
        return innerHTML;
      },
      set(value) {
        innerHTML = value;
        this.children = [];
      },
    });

    return node;
  }

  global.window = global;
  global.structuredClone = global.structuredClone || ((value) => JSON.parse(JSON.stringify(value)));
  global.localStorage = {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
  };
  global.document = {
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, createElement(selector));
      }

      return elements.get(selector);
    },
    createElement,
  };
  global.setTimeout = () => 0;

  [
    "../src/careerVault/storage",
    "../src/careerVault/view",
    "../src/careerVault/controller",
    "../src/careerVault/vault",
  ].forEach((modulePath) => {
    delete require.cache[require.resolve(modulePath)];
  });

  require("../src/careerVault/storage");
  require("../src/careerVault/view");
  require("../src/careerVault/controller");
  require("../src/careerVault/vault");

  RightForMeCareerVault.initializeCareerVault();

  return {
    elements,
    storage,
    getVault() {
      return RightForMeCareerVault.getVault();
    },
    loadVault() {
      return RightForMeCareerVaultStorage.loadVault();
    },
    click(selector) {
      document.querySelector(selector).click();
    },
    setRoleForm(values = {}) {
      document.querySelector("#role-company").value = values.company ?? "";
      document.querySelector("#role-title").value = values.title ?? "";
      document.querySelector("#role-start").value = values.start ?? "";
      document.querySelector("#role-end").value = values.end ?? "";
      document.querySelector("#role-summary-input").value = values.summary ?? "";
    },
    roleListItems() {
      return document.querySelector("#roles-list").children;
    },
    clickEdit(index) {
      this.roleListItems()[index].children[1].children[0].click();
    },
    clickRemove(index) {
      this.roleListItems()[index].children[1].children[1].click();
    },
  };
}

function savedStorage(storage) {
  return JSON.parse(storage.get("rightforme-career-vault"));
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "", title: "Missing Company", summary: "Should fail" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 0);
  assert.equal(document.querySelector("#role-company").value, "");
  assert.equal(document.querySelector("#role-title").value, "Missing Company");
  assert.equal(document.querySelector("#role-edit-status").textContent, "Enter both a company and title before saving a role.");
  assert.equal(document.querySelector("#vault-status").textContent, "Enter both a company and title before saving a role.");

  harness.setRoleForm({ company: "Recovered Co", title: "Recovered Title", summary: "Recovered" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 1);
  assert.equal(document.querySelector("#role-edit-status").textContent, "");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Missing Title Co", title: "", summary: "Should fail" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 0);
  assert.equal(document.querySelector("#role-company").value, "Missing Title Co");
  assert.equal(document.querySelector("#role-title").value, "");
  assert.equal(document.querySelector("#role-edit-status").textContent, "Enter both a company and title before saving a role.");
  assert.equal(document.querySelector("#vault-status").textContent, "Enter both a company and title before saving a role.");

  harness.setRoleForm({ company: "Recovered Co", title: "Recovered Title", summary: "Recovered" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 1);
  assert.equal(document.querySelector("#role-edit-status").textContent, "");
}

{
  const harness = setupHarness();
  harness.setRoleForm({
    company: "Example Co",
    title: "Operations Lead",
    start: "2021",
    end: "Present",
    summary: "Led delivery improvements.",
  });
  harness.click("#add-role");

  const [role] = harness.getVault().roles;
  assert.ok(role.id);
  assert.equal(role.company, "Example Co");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "One", title: "Role One" });
  harness.click("#add-role");
  harness.setRoleForm({ company: "Two", title: "Role Two" });
  harness.click("#add-role");

  const [first, second] = harness.getVault().roles;
  assert.ok(first.id);
  assert.ok(second.id);
  assert.notEqual(first.id, second.id);
}

{
  const initial = JSON.stringify({
    person: {},
    professionalSummary: "",
    roles: [{ id: "role_existing", company: "Saved Co", title: "Saved Role", start: "", end: "", summary: "" }],
  });
  const harness = setupHarness({ initialStorageValue: initial });
  assert.equal(harness.getVault().roles[0].id, "role_existing");
}

{
  const initial = JSON.stringify({
    person: {},
    professionalSummary: "",
    roles: [{ company: "Legacy Co", title: "Legacy Role", start: "", end: "", summary: "Legacy summary" }],
  });
  const harness = setupHarness({ initialStorageValue: initial });
  const role = harness.getVault().roles[0];
  assert.ok(role.id);
  assert.equal(savedStorage(harness.storage).roles[0].id, role.id);
  assert.equal(harness.loadVault().roles[0].id, role.id);
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Solo Co", title: "Only Role", summary: "Initial summary" });
  harness.click("#add-role");
  const originalId = harness.getVault().roles[0].id;

  harness.clickEdit(0);
  assert.equal(document.querySelector("#add-role").textContent, "Save Changes");
  assert.equal(document.querySelector("#cancel-role-edit").hidden, false);
  assert.equal(document.querySelector("#role-edit-status").textContent, "Editing saved role");
  assert.equal(document.querySelector("#role-company").value, "Solo Co");

  harness.setRoleForm({ company: "Solo Co", title: "Only Role Updated", summary: "Updated summary" });
  harness.click("#add-role");

  const [updatedRole] = harness.getVault().roles;
  assert.equal(updatedRole.id, originalId);
  assert.equal(updatedRole.title, "Only Role Updated");
  assert.equal(updatedRole.summary, "Updated summary");
  assert.equal(harness.getVault().roles.length, 1);
  assert.equal(document.querySelector("#add-role").textContent, "Add Role");
  assert.equal(document.querySelector("#cancel-role-edit").hidden, true);
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "First Co", title: "First Role", summary: "Keep me" });
  harness.click("#add-role");
  harness.setRoleForm({ company: "Second Co", title: "Second Role", summary: "Keep me too" });
  harness.click("#add-role");
  const ids = harness.getVault().roles.map((role) => role.id);

  harness.clickEdit(0);
  harness.setRoleForm({ company: "First Co Updated", title: "First Role Updated", summary: "" });
  harness.click("#add-role");

  assert.deepEqual(harness.getVault().roles.map((role) => role.id), ids);
  assert.equal(harness.getVault().roles[0].company, "First Co Updated");
  assert.equal(harness.getVault().roles[0].summary, "");
  assert.equal(harness.getVault().roles[1].company, "Second Co");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Cancel Co", title: "Cancel Role", summary: "Saved summary" });
  harness.click("#add-role");

  harness.clickEdit(0);
  harness.setRoleForm({ company: "Changed Co", title: "Changed Role", summary: "Changed summary" });
  harness.click("#cancel-role-edit");

  assert.equal(harness.getVault().roles[0].company, "Cancel Co");
  assert.equal(document.querySelector("#role-company").value, "");
  assert.equal(document.querySelector("#add-role").textContent, "Add Role");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Validate Co", title: "Validate Role" });
  harness.click("#add-role");
  const savedRole = structuredClone(harness.getVault().roles[0]);

  harness.clickEdit(0);
  harness.setRoleForm({ company: "", title: "Validate Role", summary: "Should not save" });
  harness.click("#add-role");

  assert.deepEqual(harness.getVault().roles[0], savedRole);
  assert.equal(document.querySelector("#add-role").textContent, "Save Changes");
  assert.equal(document.querySelector("#cancel-role-edit").hidden, false);
  assert.equal(document.querySelector("#role-company").value, "");
  assert.equal(document.querySelector("#role-title").value, "Validate Role");
  assert.equal(document.querySelector("#role-edit-status").textContent, "Enter both a company and title before saving a role.");
  assert.equal(document.querySelector("#vault-status").textContent, "Enter both a company and title before saving a role.");
  assert.equal(harness.getVault().roles.length, 1);

  harness.setRoleForm({ company: "Validate Co", title: "Recovered Role", summary: "Recovered summary" });
  harness.click("#add-role");
  assert.equal(harness.getVault().roles[0].title, "Recovered Role");
  assert.equal(document.querySelector("#role-edit-status").textContent, "");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Validate Co", title: "Validate Role" });
  harness.click("#add-role");
  const savedRole = structuredClone(harness.getVault().roles[0]);
  const savedId = savedRole.id;

  harness.clickEdit(0);
  harness.setRoleForm({ company: "Validate Co", title: "", summary: "Should not save" });
  harness.click("#add-role");

  assert.deepEqual(harness.getVault().roles[0], savedRole);
  assert.equal(document.querySelector("#add-role").textContent, "Save Changes");
  assert.equal(document.querySelector("#cancel-role-edit").hidden, false);
  assert.equal(document.querySelector("#role-company").value, "Validate Co");
  assert.equal(document.querySelector("#role-title").value, "");
  assert.equal(document.querySelector("#role-edit-status").textContent, "Enter both a company and title before saving a role.");
  assert.equal(harness.getVault().roles.length, 1);

  harness.setRoleForm({ company: "Validate Co", title: "Corrected Title", summary: "Corrected summary" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 1);
  assert.equal(harness.getVault().roles[0].id, savedId);
  assert.equal(harness.getVault().roles[0].title, "Corrected Title");
  assert.equal(document.querySelector("#role-edit-status").textContent, "");
  assert.equal(document.querySelector("#add-role").textContent, "Add Role");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Alpha", title: "Role A" });
  harness.click("#add-role");
  harness.setRoleForm({ company: "Beta", title: "Role B" });
  harness.click("#add-role");

  harness.clickEdit(0);
  assert.equal(document.querySelector("#role-company").value, "Alpha");
  harness.clickEdit(1);
  assert.equal(document.querySelector("#role-company").value, "Beta");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Remove Co", title: "Remove Me" });
  harness.click("#add-role");
  harness.setRoleForm({ company: "Keep Co", title: "Keep Me" });
  harness.click("#add-role");
  const remainingId = harness.getVault().roles[1].id;

  harness.clickEdit(0);
  harness.clickRemove(0);

  assert.equal(document.querySelector("#add-role").textContent, "Add Role");
  assert.equal(harness.getVault().roles.length, 1);
  assert.equal(harness.getVault().roles[0].id, remainingId);
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Edit First", title: "Original" });
  harness.click("#add-role");
  harness.clickEdit(0);
  harness.setRoleForm({ company: "Edit First", title: "Edited" });
  harness.click("#add-role");
  const editedId = harness.getVault().roles[0].id;

  harness.setRoleForm({ company: "New Co", title: "New Role" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 2);
  assert.equal(harness.getVault().roles[0].id, editedId);
  assert.notEqual(harness.getVault().roles[1].id, editedId);
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Cancel Then Add", title: "Original" });
  harness.click("#add-role");
  harness.clickEdit(0);
  harness.setRoleForm({ company: "Unsaved", title: "Unsaved" });
  harness.click("#cancel-role-edit");
  harness.setRoleForm({ company: "Fresh Co", title: "Fresh Role" });
  harness.click("#add-role");

  assert.equal(harness.getVault().roles.length, 2);
  assert.equal(harness.getVault().roles[0].company, "Cancel Then Add");
  assert.equal(harness.getVault().roles[1].company, "Fresh Co");
}

{
  const harness = setupHarness();
  harness.setRoleForm({ company: "Reload Co", title: "Before Reload", summary: "Before" });
  harness.click("#add-role");
  const roleId = harness.getVault().roles[0].id;
  harness.clickEdit(0);
  harness.setRoleForm({ company: "Reload Co", title: "After Reload", summary: "After" });
  harness.click("#add-role");

  const reloaded = harness.loadVault().roles[0];
  assert.equal(reloaded.id, roleId);
  assert.equal(reloaded.title, "After Reload");
  assert.equal(reloaded.summary, "After");
}
