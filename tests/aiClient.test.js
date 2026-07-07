const assert = require("node:assert/strict");

const {
  analyzeJob,
  getAIMode,
  isAITestModeEnabled,
} = require("../src/lib/ai/aiClient");
const {
  getLatestAIRequest,
  resetAIDebugStore,
} = require("../src/lib/ai/aiDebugStore");

async function run() {
  assert.equal(getAIMode({}), "live");
  assert.equal(getAIMode({ VITE_AI_TEST_MODE: "true" }), "test");
  assert.equal(getAIMode({ AI_TEST_MODE: "1" }), "test");
  assert.equal(isAITestModeEnabled({ VITE_AI_TEST_MODE: "yes" }), true);

  const originalFetch = global.fetch;
  let first;
  let second;
  try {
    global.fetch = async () => {
      throw new Error("Live fetch should not be called in AI test mode.");
    };

    resetAIDebugStore();
    first = await analyzeJob(
      {
        company: "BrightForge AI",
        roleTitle: "AI Enablement Product Operations Manager",
        sourcePostingText: "Hybrid role focused on AI product operations, release readiness, Jira, Power BI, and stakeholder adoption.",
        requiredSkills: ["Product operations", "Stakeholder management"],
        technologies: ["Jira", "Power BI"],
      },
      { person: { name: "Sample Candidate" }, skills: ["Operations", "Metrics"] },
      { env: { VITE_AI_TEST_MODE: "true" } }
    );
    second = await analyzeJob(
      {
        company: "BrightForge AI",
        roleTitle: "AI Enablement Product Operations Manager",
        sourcePostingText: "Hybrid role focused on AI product operations, release readiness, Jira, Power BI, and stakeholder adoption.",
        requiredSkills: ["Product operations", "Stakeholder management"],
        technologies: ["Jira", "Power BI"],
      },
      { person: { name: "Sample Candidate" }, skills: ["Operations", "Metrics"] },
      { env: { VITE_AI_TEST_MODE: "true" } }
    );
  } finally {
    global.fetch = originalFetch;
  }

  assert.deepEqual(first, second);
  assert.equal(first.fitAnalysis.fitScore, 78);
  assert.equal(first.fitAnalysis.fitRecommendation, "Apply");
  assert.ok(first.resumeDraft.tailoredSummary.includes("Operations"));
  assert.ok(first.coverLetterDraft.coverLetterContent.includes("BrightForge AI"));

  const debug = getLatestAIRequest();
  assert.equal(debug.mode, "test");
  assert.equal(debug.testModeEnabled, true);
  assert.equal(debug.flowName, "job-analysis");
  assert.equal(debug.inputSummary.company, "BrightForge AI");
  assert.equal(debug.parsedResponse.fitScore, 78);
  assert.equal(debug.errorMessage, "");
  assert.equal(typeof debug.durationMs, "number");

  resetAIDebugStore();
  await assert.rejects(
    () => analyzeJob({ sourcePostingText: "Posting" }, {}, { env: {} }),
    /OPENAI_API_KEY/
  );
  const failureDebug = getLatestAIRequest();
  assert.equal(failureDebug.mode, "live");
  assert.match(failureDebug.errorMessage, /OPENAI_API_KEY/);
}

run();
