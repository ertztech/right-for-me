const assert = require("node:assert/strict");

const storage = new Map();

global.window = global;
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, value) => storage.set(key, value),
};

require("../src/jobsApplied/storage");

RightForMeJobsAppliedStorage.addJobApplication({
  id: "manual-job-1",
  company: "Example Co",
  roleTitle: "Operations Manager",
  status: "Found",
  sourcePostingText: "Lead operations, improve metrics, and coordinate stakeholders.",
});

let saved = RightForMeJobsAppliedStorage.getJobApplications()[0];
assert.equal(saved.company, "Example Co");
assert.ok(saved.updatedAt);

RightForMeJobsAppliedStorage.updateJobApplication(saved.id, {
  resumeDraft: {
    tailoredSummary: "Operations leader focused on metrics and stakeholder clarity.",
    tailoredSkills: ["Operations", "Metrics"],
    tailoredExperienceBullets: ["Improved operating rhythm."],
    markdownContent: "# Resume\n\nSaved draft.",
    userApproved: true,
  },
});

saved = RightForMeJobsAppliedStorage.getJobApplications()[0];
assert.equal(saved.resumeDraft.markdownContent, "# Resume\n\nSaved draft.");
assert.equal(saved.resumeDraft.userApproved, true);
assert.ok(saved.updatedAt);
