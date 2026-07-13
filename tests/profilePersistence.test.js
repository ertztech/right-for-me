const assert = require("node:assert/strict");

const elements = new Map();
const storage = new Map();

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

function createElement(selector = "") {
  return {
    selector,
    value: "",
    textContent: "",
    innerHTML: "",
    children: [],
    className: "",
    handlers: {},
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
}

require("../src/careerVault/storage");
require("../src/careerVault/view");
require("../src/careerVault/controller");
require("../src/careerVault/vault");

RightForMeCareerVault.initializeCareerVault();

document.querySelector("#vault-name").value = "Jordan Lee";
document.querySelector("#vault-location").value = "Chicago, IL";
document.querySelector("#profile-summary").value = "Operations leader focused on practical change and measurable delivery.";
document.querySelector("#role-company").value = "Example Co";
document.querySelector("#role-title").value = "Product Operations Manager";
document.querySelector("#role-summary-input").value = "Led planning rituals and delivery reporting.";
document.querySelector("#add-role").click();

document.querySelector("#skill-input").value = "Stakeholder communication";
document.querySelector("#add-skill").click();
document.querySelector("#metric-input").value = "Reduced cycle time by 18%.";
document.querySelector("#add-metric").click();
document.querySelector("#project-input").value = "Launched weekly operating review.";
document.querySelector("#add-project").click();
document.querySelector("#story-input").value = "Aligned leaders around one delivery dashboard.";
document.querySelector("#add-story").click();
document.querySelector("#education-input").value = "B.A. Communications";
document.querySelector("#add-education").click();
document.querySelector("#certification-input").value = "Certified ScrumMaster";
document.querySelector("#add-certification").click();
document.querySelector("#career-preference-input").value = "Hybrid operations roles";
document.querySelector("#add-career-preference").click();
document.querySelector("#save-vault").click();

const reloaded = RightForMeCareerVaultStorage.loadVault();

assert.equal(reloaded.person.name, "Jordan Lee");
assert.equal(reloaded.person.location, "Chicago, IL");
assert.equal(reloaded.professionalSummary, "Operations leader focused on practical change and measurable delivery.");
assert.ok(reloaded.roles[0].id);
assert.equal(reloaded.roles[0].company, "Example Co");
assert.deepEqual(reloaded.skills, ["Stakeholder communication"]);
assert.deepEqual(reloaded.metrics, ["Reduced cycle time by 18%."]);
assert.deepEqual(reloaded.projects, ["Launched weekly operating review."]);
assert.deepEqual(reloaded.stories, ["Aligned leaders around one delivery dashboard."]);
assert.deepEqual(reloaded.education, ["B.A. Communications"]);
assert.deepEqual(reloaded.certifications, ["Certified ScrumMaster"]);
assert.deepEqual(reloaded.careerPreferences, ["Hybrid operations roles"]);
assert.equal(document.querySelector("#vault-status").textContent, "Profile saved.");
