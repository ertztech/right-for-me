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
    style: {},
    dataset: {},
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
require("../src/shared/actionFeedback");
require("../src/careerVault/view");
require("../src/careerVault/controller");
require("../src/careerVault/vault");
require("../src/resume/builder");
require("../src/resume/markdown");
require("../src/resume/controller");

RightForMeCareerVault.initializeCareerVault();
RightForMeResumeController.initializeResumeController();

document.querySelector("#vault-name").value = "Unsaved Person";
document.querySelector("#vault-location").value = "Milwaukee, WI";
document.querySelector("#generate-resume").click();

const preview = document.querySelector("#resume-preview").value;

assert.ok(preview.includes("# Unsaved Person"));
assert.ok(preview.includes("Milwaukee, WI"));
assert.equal(document.querySelector("#resume-status").textContent, "Resume generated.");
