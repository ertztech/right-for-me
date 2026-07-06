const assert = require("node:assert/strict");

const storage = new Map();

global.window = global;
global.structuredClone = global.structuredClone || ((value) => JSON.parse(JSON.stringify(value)));
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, value) => storage.set(key, value),
};

require("../src/jobsApplied/storage");
require("../src/careerVault/storage");

let vaultState = RightForMeCareerVaultStorage.createDefaultVault();
global.RightForMeCareerVault = {
  getVault: () => vaultState,
  replaceVault: (nextVault) => {
    vaultState = nextVault;
    RightForMeCareerVaultStorage.saveVault(nextVault);
  },
};

const {
  clearDemoData,
  createSampleJobs,
  isDemoRecord,
  loadSampleData,
} = require("../src/demoData/seeder");

const sampleJobs = createSampleJobs();
assert.equal(sampleJobs.length, 3);
assert.deepEqual(sampleJobs.map((job) => job.status), ["Apply", "Reviewing", "Applied"]);
assert.equal(sampleJobs.some((job) => /Agile Delivery Transformation/.test(job.roleTitle)), true);
assert.equal(sampleJobs.some((job) => /AI Enablement Product Operations/.test(job.roleTitle)), true);
assert.equal(sampleJobs.some((job) => /Manufacturing Operations Continuous Improvement/.test(job.roleTitle)), true);
sampleJobs.forEach((job) => {
  assert.equal(isDemoRecord(job), true);
  assert.equal(job.demoData.batchId, "nextmove-demo-data-v1");
  assert.equal(job.demoData.source, "demo");
  assert.ok(job.sourcePostingText);
  assert.ok(job.fitAnalysis?.recommendation);
  assert.ok(job.resumeDraft?.markdownContent);
  assert.ok(job.coverLetterDraft?.coverLetterContent);
  assert.ok(job.interviewPrep?.likelyQuestions?.length);
});

RightForMeJobsAppliedStorage.addJobApplication({
  id: "real-job-1",
  company: "Real Co",
  roleTitle: "Real Role",
  status: "Found",
});

const firstLoad = loadSampleData();
let jobs = RightForMeJobsAppliedStorage.getJobApplications();

assert.equal(firstLoad.jobsAdded, 3);
assert.equal(firstLoad.realJobsPreserved, 1);
assert.equal(firstLoad.vaultSeeded, true);
assert.equal(jobs.length, 4);
assert.equal(jobs.filter(isDemoRecord).length, 3);
assert.equal(jobs.some((job) => job.id === "real-job-1"), true);
assert.equal(vaultState.demoData.seededBy, "nextmove-demo-data-seeder");

loadSampleData();
jobs = RightForMeJobsAppliedStorage.getJobApplications();
assert.equal(jobs.length, 4);
assert.equal(jobs.filter(isDemoRecord).length, 3);

const cleared = clearDemoData();
jobs = RightForMeJobsAppliedStorage.getJobApplications();

assert.equal(cleared.jobsRemoved, 3);
assert.equal(cleared.realJobsPreserved, 1);
assert.equal(jobs.length, 1);
assert.equal(jobs[0].id, "real-job-1");
assert.equal(vaultState.roles.length, 0);

vaultState = {
  person: { name: "Real Person", location: "", email: "", phone: "" },
  roles: [],
  skills: ["Real skill"],
  tools: [],
  accomplishments: [],
};

const secondLoad = loadSampleData();
assert.equal(secondLoad.vaultSeeded, false);
assert.equal(vaultState.person.name, "Real Person");
assert.deepEqual(vaultState.skills, ["Real skill"]);
