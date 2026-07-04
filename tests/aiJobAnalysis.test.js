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
    fitAnalysis: {
      fitScore: 82,
      fitRecommendation: "Apply",
      strengths: ["Strong operations transformation match"],
      gaps: ["Confirm industry depth"],
      concerns: [],
      suggestedPositioning: "Lead with transformation and measurable delivery.",
      userApproved: false,
    },
    resumeDraft: {
      tailoredSummary: "Transformation leader focused on practical operating improvements.",
      tailoredSkills: ["Change management", "Power BI"],
      tailoredExperienceBullets: ["Led cross-functional transformation work."],
      markdownContent: "# Resume\n\nTailored content.",
      userApproved: false,
    },
    coverLetterDraft: {
      coverLetterContent: "Dear team,\n\nI am excited to apply.",
      userApproved: false,
    },
    interviewPrep: {
      likelyQuestions: ["Tell us about a transformation you led."],
      storiesToPrepare: ["Operations metrics improvement"],
      riskAreas: ["Confirm manufacturing domain depth"],
      salaryNotes: "Posting lists a clear salary range.",
    },
    nextAction: "Review the generated application packet.",
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
  assert.ok(prompt.includes("interviewPrep"));
  assert.ok(prompt.includes("Lead transformation"));

  assert.throws(() => parseAIJobAnalysisResponse("not json"), /valid JSON/);
  assert.throws(
    () => validateAIJobAnalysis(baseAnalysis({ fitAnalysis: { ...baseAnalysis().fitAnalysis, fitRecommendation: "Definitely" } })),
    /Apply, Maybe, or Skip/
  );
  assert.throws(
    () => validateAIJobAnalysis(baseAnalysis({ fitAnalysis: { ...baseAnalysis().fitAnalysis, fitScore: 120 } })),
    /0-100/
  );

  const parsed = parseAIJobAnalysisResponse({ output_text: JSON.stringify(baseAnalysis()) });
  assert.equal(parsed.fitAnalysis.fitScore, 82);
  assert.equal(parsed.fitAnalysis.fitRecommendation, "Apply");
  assert.deepEqual(parsed.missingArrayField, undefined);

  const normalized = validateAIJobAnalysis({
    fitAnalysis: {
      fitScore: 50,
      fitRecommendation: "Maybe",
    },
  });
  assert.deepEqual(normalized.responsibilities, []);
  assert.deepEqual(normalized.resumeDraft.tailoredSkills, []);
  assert.deepEqual(normalized.interviewPrep.likelyQuestions, []);
  assert.equal(normalized.company, "");

  const merged = mergeAIJobAnalysis(
    {
      company: "User Company",
      roleTitle: "",
      requiredSkills: ["User-entered skill"],
      fitScore: "",
      fitRecommendation: "",
      fitAnalysis: {
        strengths: ["User-entered strength"],
        userApproved: true,
      },
      resumeDraft: {
        markdownContent: "User resume draft",
        userApproved: true,
      },
      coverLetterDraft: {
        userApproved: true,
      },
    },
    baseAnalysis()
  );

  assert.equal(merged.company, undefined);
  assert.equal(merged.roleTitle, "Transformation Lead");
  assert.equal(merged.requiredSkills, undefined);
  assert.equal(merged.fitAnalysis.strengths[0], "User-entered strength");
  assert.equal(merged.fitAnalysis.fitRecommendation, "Apply");
  assert.equal(merged.fitAnalysis.recommendation, "Apply");
  assert.equal(merged.fitAnalysis.userApproved, true);
  assert.equal(merged.fitScore, 82);
  assert.equal(merged.resumeDraft.markdownContent, "User resume draft");
  assert.equal(merged.resumeDraft.userApproved, true);
  assert.deepEqual(merged.resumeDraft.tailoredSkills, ["Change management", "Power BI"]);
  assert.equal(merged.coverLetterDraft.userApproved, true);
  assert.deepEqual(merged.interviewPrep.likelyQuestions, ["Tell us about a transformation you led."]);

  const topLevelFitPreserved = mergeAIJobAnalysis(
    {
      fitScore: 74,
      fitRecommendation: "Maybe",
      fitAnalysis: null,
    },
    baseAnalysis()
  );

  assert.equal(topLevelFitPreserved.fitAnalysis.fitScore, 74);
  assert.equal(topLevelFitPreserved.fitAnalysis.fitRecommendation, "Maybe");
  assert.equal(topLevelFitPreserved.fitAnalysis.recommendation, "Maybe");
  assert.equal(topLevelFitPreserved.fitScore, undefined);
  assert.equal(topLevelFitPreserved.fitRecommendation, undefined);
}

run();
