const assert = require("node:assert/strict");

const {
  buildJobAnalysisPrompt,
  mergeAIJobAnalysis,
  parseAIJobAnalysisResponse,
  validateAIJobAnalysis,
} = require("../src/jobsApplied/aiJobAnalysis");

function baseAnalysis(overrides = {}) {
  return {
    company: "Acme",
    roleTitle: "Transformation Lead",
    location: "Milwaukee, WI",
    salaryRange: "$120,000 - $140,000",
    workArrangement: "Hybrid",
    responsibilities: ["Lead change roadmap"],
    requiredSkills: ["Change management"],
    preferredSkills: ["Manufacturing"],
    technologies: ["Power BI"],
    leadershipExpectations: ["Lead stakeholders"],
    certifications: [],
    yearsExperience: "7+ years",
    fitScore: 82,
    fitRecommendation: "Apply",
    strengths: ["Strong operations transformation match"],
    gaps: ["Confirm industry depth"],
    concerns: [],
    suggestedPositioning: "Lead with transformation and measurable delivery.",
    resumeDraft: {
      tailoredSummary: "Transformation leader focused on practical operating improvements.",
      tailoredSkills: ["Change management", "Power BI"],
      tailoredExperienceBullets: ["Led cross-functional transformation work."],
      markdownContent: "# Resume\n\nTailored content.",
    },
    coverLetterDraft: {
      coverLetterContent: "Dear team,\n\nI am excited to apply.",
    },
    ...overrides,
  };
}

function run() {
  const prompt = buildJobAnalysisPrompt(
    { sourcePostingText: "Responsibilities: Lead transformation." },
    { skills: ["Operations", "Change management"] }
  );

  assert.ok(prompt.includes("NextMove"));
  assert.ok(prompt.includes("valid JSON only"));
  assert.ok(prompt.includes("Apply, Maybe, Skip"));
  assert.ok(prompt.includes("Lead transformation"));

  assert.throws(() => parseAIJobAnalysisResponse("not json"), /valid JSON/);
  assert.throws(() => validateAIJobAnalysis(baseAnalysis({ fitRecommendation: "Definitely" })), /Apply, Maybe, or Skip/);
  assert.throws(() => validateAIJobAnalysis(baseAnalysis({ fitScore: 120 })), /0-100/);

  const parsed = parseAIJobAnalysisResponse({ output_text: JSON.stringify(baseAnalysis()) });
  assert.equal(parsed.fitScore, 82);
  assert.equal(parsed.fitRecommendation, "Apply");

  const merged = mergeAIJobAnalysis(
    {
      company: "User Company",
      roleTitle: "",
      requiredSkills: ["User-entered skill"],
      fitScore: "",
      fitRecommendation: "",
      fitAnalysis: {
        strengths: ["User-entered strength"],
      },
      resumeDraft: {
        markdownContent: "User resume draft",
      },
    },
    baseAnalysis()
  );

  assert.equal(merged.company, undefined);
  assert.equal(merged.roleTitle, "Transformation Lead");
  assert.equal(merged.requiredSkills, undefined);
  assert.equal(merged.fitAnalysis.strengths[0], "User-entered strength");
  assert.equal(merged.fitAnalysis.recommendation, "Apply");
  assert.equal(merged.fitScore, 82);
  assert.equal(merged.resumeDraft.markdownContent, "User resume draft");
  assert.deepEqual(merged.resumeDraft.tailoredSkills, ["Change management", "Power BI"]);

  const topLevelFitPreserved = mergeAIJobAnalysis(
    {
      fitScore: 74,
      fitRecommendation: "Maybe",
      fitAnalysis: null,
    },
    baseAnalysis()
  );

  assert.equal(topLevelFitPreserved.fitAnalysis.fitScore, 74);
  assert.equal(topLevelFitPreserved.fitAnalysis.recommendation, "Maybe");
  assert.equal(topLevelFitPreserved.fitScore, undefined);
  assert.equal(topLevelFitPreserved.fitRecommendation, undefined);
}

run();
