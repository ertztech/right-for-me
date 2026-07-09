const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

global.window = global;
const { createSampleJobs } = require("../src/demoData/seeder");

const nodes = new Map();
let savedJob = null;
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
    getJobApplications: () => (savedJob ? [savedJob] : []),
    updateJobApplication: (jobId, updates) => {
      savedJob = { ...savedJob, ...updates, id: jobId };
      return savedJob;
    },
  },
};

context.window = context;
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "../src/jobsApplied/controller.js"), "utf8"),
  context
);

const seededJob = createSampleJobs()[0];
savedJob = seededJob;
context.renderApplicationStudio(seededJob);

const studioHtml = nodes.get("#application-studio-content").innerHTML;
assert.ok(studioHtml.includes("Application Studio for Agile Delivery Transformation Lead"));
assert.ok(studioHtml.includes("Packet Readiness"));
assert.ok(studioHtml.includes("11 of 12 complete"));
assert.ok(studioHtml.includes("Agile Delivery Transformation Lead"));
assert.ok(studioHtml.includes("Atlas Components"));
assert.ok(studioHtml.includes("Refresh Fit Review"));
assert.ok(studioHtml.includes("Generate Resume Draft"));
assert.ok(studioHtml.includes("Generate Cover Letter Draft"));
assert.ok(studioHtml.includes("Job Posting Text"));
assert.ok(studioHtml.includes("Atlas Components is hiring"));
assert.ok(studioHtml.includes("Strong match on transformation"));
assert.ok(studioHtml.includes("Alex Morgan"));
assert.ok(studioHtml.includes("Dear Atlas Components team"));
assert.ok(studioHtml.includes("Copy Resume Draft"));
assert.ok(studioHtml.includes("Copy Cover Letter Draft"));
assert.ok(studioHtml.includes("Save Packet Status"));
assert.ok(studioHtml.includes("Resume reviewed"));
assert.ok(studioHtml.includes("Application submitted"));

context.savePacketChecklistToggle({
  checked: true,
  dataset: {
    jobId: seededJob.id,
    packetChecklist: "applicationSubmitted",
  },
});
assert.equal(savedJob.packetChecklist.applicationSubmitted, true);

const emptyJob = {
  id: "empty-job",
  company: "Empty Co",
  roleTitle: "Empty Role",
  status: "Found",
};

savedJob = emptyJob;
context.renderApplicationStudio(emptyJob);
const emptyHtml = nodes.get("#application-studio-content").innerHTML;
assert.ok(emptyHtml.includes("1 of 12 complete"));
assert.ok(emptyHtml.includes("No source posting text is saved yet."));
assert.ok(emptyHtml.includes("No resume draft yet."));
assert.ok(emptyHtml.includes("No cover letter draft yet."));
assert.ok(emptyHtml.includes("No fit strengths saved yet."));

