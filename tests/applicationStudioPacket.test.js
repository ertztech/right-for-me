const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

global.window = global;
const { createSampleJobs } = require("../src/demoData/seeder");

const nodes = new Map();
const documentStub = {
  addEventListener() {},
  querySelector(selector) {
    if (!nodes.has(selector)) {
      nodes.set(selector, {
        innerHTML: "",
        textContent: "",
        dataset: {},
        classList: { toggle() {} },
      });
    }

    return nodes.get(selector);
  },
  querySelectorAll() {
    return [];
  },
};

const context = {
  console,
  document: documentStub,
  window: {},
  RightForMeJobsAppliedStorage: {
    getJobApplications: () => [],
    updateJobApplication: () => ({}),
  },
};

context.window = context;
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "../src/jobsApplied/controller.js"), "utf8"),
  context
);

const seededJob = createSampleJobs()[0];
context.renderApplicationStudio(seededJob);

const studioHtml = nodes.get("#application-studio-content").innerHTML;
assert.ok(studioHtml.includes("Agile Delivery Transformation Lead"));
assert.ok(studioHtml.includes("Atlas Components"));
assert.ok(studioHtml.includes("Job Posting Text"));
assert.ok(studioHtml.includes("Atlas Components is hiring"));
assert.ok(studioHtml.includes("Strong match on transformation"));
assert.ok(studioHtml.includes("Mike Thompson"));
assert.ok(studioHtml.includes("Dear Atlas Components team"));
assert.ok(studioHtml.includes("Copy Resume Draft"));
assert.ok(studioHtml.includes("Copy Cover Letter Draft"));
assert.ok(studioHtml.includes("Update Status and Notes"));

const emptyJob = {
  id: "empty-job",
  company: "Empty Co",
  roleTitle: "Empty Role",
  status: "Found",
};

context.renderApplicationStudio(emptyJob);
const emptyHtml = nodes.get("#application-studio-content").innerHTML;
assert.ok(emptyHtml.includes("No source posting text is saved yet."));
assert.ok(emptyHtml.includes("No resume draft yet."));
assert.ok(emptyHtml.includes("No cover letter draft yet."));
assert.ok(emptyHtml.includes("No fit strengths saved yet."));

