(function attachAIJobAnalysis(root) {
  const FIT_RECOMMENDATIONS = ["Apply", "Maybe", "Skip"];
  const JOB_ARRAY_FIELDS = [
    "responsibilities",
    "requiredSkills",
    "preferredSkills",
    "technologies",
    "leadershipExpectations",
    "certifications",
  ];

  function buildJobAnalysisPrompt(jobRecord = {}, userProfile = {}) {
    return [
      "You are NextMove, a calm, honest, practical AI career coach.",
      "Analyze the job posting and return valid JSON only.",
      "Do not exaggerate the user's fit or invent experience.",
      "If information is missing, return empty strings or empty arrays.",
      "fitScore must be a number from 0 to 100.",
      "fitRecommendation must be one of: Apply, Maybe, Skip.",
      "",
      "Return exactly this JSON shape:",
      JSON.stringify(responseExample(), null, 2),
      "",
      "Use the job posting as the primary source for job details.",
      "Use the user profile only for fit, positioning, and draft application content.",
      "",
      "JOB RECORD:",
      JSON.stringify(jobRecord, null, 2),
      "",
      "USER PROFILE / STORY BANK:",
      JSON.stringify(userProfile, null, 2),
    ].join("\n");
  }

  async function analyzeJobWithAI(jobRecord, userProfile, options = {}) {
    if (!options.apiKey) {
      throw new Error("OPENAI_API_KEY is required.");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || "gpt-5.5",
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text: "Return valid JSON only. Follow the requested schema and do not include markdown.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildJobAnalysisPrompt(jobRecord, userProfile),
              },
            ],
          },
        ],
        text: {
          format: responseJsonSchema(),
        },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error?.message || `OpenAI request failed with status ${response.status}.`);
    }

    return parseAIJobAnalysisResponse(payload);
  }

  function parseAIJobAnalysisResponse(response) {
    const text = typeof response === "string" ? response : response.output_text || extractOutputText(response);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new Error("AI response was not valid JSON.");
    }

    return validateAIJobAnalysis(parsed);
  }

  function validateAIJobAnalysis(analysis = {}) {
    const fitAnalysis = normalizeFitAnalysis(analysis.fitAnalysis || analysis);

    if (!Number.isFinite(fitAnalysis.fitScore) || fitAnalysis.fitScore < 0 || fitAnalysis.fitScore > 100) {
      throw new Error("AI response fitScore must be 0-100.");
    }

    fitAnalysis.fitScore = Math.round(fitAnalysis.fitScore);

    if (!FIT_RECOMMENDATIONS.includes(fitAnalysis.fitRecommendation)) {
      throw new Error("AI response fitRecommendation must be Apply, Maybe, or Skip.");
    }

    return {
      company: stringValue(analysis.company),
      roleTitle: stringValue(analysis.roleTitle),
      location: stringValue(analysis.location),
      salaryRange: stringValue(analysis.salaryRange),
      workArrangement: stringValue(analysis.workArrangement),
      responsibilities: arrayValue(analysis.responsibilities),
      requiredSkills: arrayValue(analysis.requiredSkills),
      preferredSkills: arrayValue(analysis.preferredSkills),
      technologies: arrayValue(analysis.technologies),
      leadershipExpectations: arrayValue(analysis.leadershipExpectations),
      certifications: arrayValue(analysis.certifications),
      yearsExperience: stringValue(analysis.yearsExperience),
      fitAnalysis,
      fitScore: fitAnalysis.fitScore,
      fitRecommendation: fitAnalysis.fitRecommendation,
      strengths: fitAnalysis.strengths,
      gaps: fitAnalysis.gaps,
      concerns: fitAnalysis.concerns,
      suggestedPositioning: fitAnalysis.suggestedPositioning,
      resumeDraft: {
        tailoredSummary: stringValue(analysis.resumeDraft?.tailoredSummary),
        tailoredSkills: arrayValue(analysis.resumeDraft?.tailoredSkills),
        tailoredExperienceBullets: arrayValue(analysis.resumeDraft?.tailoredExperienceBullets),
        markdownContent: stringValue(analysis.resumeDraft?.markdownContent),
        userApproved: booleanValue(analysis.resumeDraft?.userApproved),
      },
      coverLetterDraft: {
        coverLetterContent: stringValue(analysis.coverLetterDraft?.coverLetterContent),
        userApproved: booleanValue(analysis.coverLetterDraft?.userApproved),
      },
      interviewPrep: {
        likelyQuestions: arrayValue(analysis.interviewPrep?.likelyQuestions),
        storiesToPrepare: arrayValue(analysis.interviewPrep?.storiesToPrepare),
        riskAreas: arrayValue(analysis.interviewPrep?.riskAreas),
        salaryNotes: stringValue(analysis.interviewPrep?.salaryNotes),
      },
      nextAction: stringValue(analysis.nextAction),
    };
  }

  function mergeAIJobAnalysis(existingJob = {}, analysis = {}) {
    const merged = {};

    [
      "company",
      "roleTitle",
      "location",
      "salaryRange",
      "workArrangement",
      "yearsExperience",
      "nextAction",
    ].forEach((field) => {
      addIfBlank(merged, existingJob, field, analysis[field]);
    });

    JOB_ARRAY_FIELDS.forEach((field) => {
      addIfBlank(merged, existingJob, field, analysis[field]);
    });

    const fitAnalysis = mergeFitAnalysis(existingJob, analysis.fitAnalysis || analysis);
    if (fitAnalysis) {
      merged.fitAnalysis = fitAnalysis;

      if (isBlank(existingJob.fitScore) && !isBlank(fitAnalysis.fitScore)) {
        merged.fitScore = fitAnalysis.fitScore;
      }

      if (isBlank(existingJob.fitRecommendation) && !isBlank(fitAnalysis.fitRecommendation)) {
        merged.fitRecommendation = fitAnalysis.fitRecommendation;
      }
    }

    const resumeDraft = mergeDraft(existingJob.resumeDraft || {}, analysis.resumeDraft || {}, {
      promptVersion: "tailored-resume-live-ai-v1",
    });
    if (resumeDraft) {
      merged.resumeDraft = resumeDraft;
    }

    const coverLetterDraft = mergeDraft(existingJob.coverLetterDraft || {}, analysis.coverLetterDraft || {}, {
      promptVersion: "cover-letter-live-ai-v1",
    });
    if (coverLetterDraft) {
      merged.coverLetterDraft = coverLetterDraft;
    }

    const interviewPrep = mergeDraft(existingJob.interviewPrep || {}, analysis.interviewPrep || {}, {
      promptVersion: "interview-prep-live-ai-v1",
    });
    if (interviewPrep) {
      merged.interviewPrep = interviewPrep;
    }

    return merged;
  }

  function mergeFitAnalysis(existingJob, incomingFitAnalysis) {
    const existingFit = {
      ...(existingJob.fitAnalysis || {}),
      fitScore: existingJob.fitAnalysis?.fitScore ?? existingJob.fitScore,
      fitRecommendation: existingJob.fitAnalysis?.fitRecommendation ?? existingJob.fitRecommendation,
      recommendation: existingJob.fitAnalysis?.recommendation ?? existingJob.fitRecommendation,
    };
    const updates = {};

    addIfBlank(updates, existingFit, "fitScore", incomingFitAnalysis.fitScore);
    addIfBlank(updates, existingFit, "fitRecommendation", incomingFitAnalysis.fitRecommendation);
    addIfBlank(updates, existingFit, "strengths", incomingFitAnalysis.strengths);
    addIfBlank(updates, existingFit, "gaps", incomingFitAnalysis.gaps);
    addIfBlank(updates, existingFit, "concerns", incomingFitAnalysis.concerns);
    addIfBlank(updates, existingFit, "suggestedPositioning", incomingFitAnalysis.suggestedPositioning);

    if (!Object.keys(updates).length) {
      return null;
    }

    const mergedFit = {
      ...existingFit,
      ...updates,
      generatedAt: existingFit.generatedAt || new Date().toISOString(),
      promptVersion: existingFit.promptVersion || "opportunity-review-live-ai-v1",
      modelName: existingFit.modelName || "openai",
      userApproved: existingFit.userApproved || booleanValue(incomingFitAnalysis.userApproved),
    };

    mergedFit.recommendation = mergedFit.recommendation || mergedFit.fitRecommendation;
    mergedFit.fitRecommendation = mergedFit.fitRecommendation || mergedFit.recommendation;

    return mergedFit;
  }

  function mergeDraft(existingDraft, incomingDraft, defaults) {
    const updates = {};
    Object.keys(incomingDraft).forEach((field) => {
      if (field === "userApproved") {
        return;
      }

      addIfBlank(updates, existingDraft, field, incomingDraft[field]);
    });

    if (!Object.keys(updates).length) {
      return null;
    }

    const mergedDraft = {
      ...existingDraft,
      ...updates,
      generatedAt: existingDraft.generatedAt || new Date().toISOString(),
      promptVersion: existingDraft.promptVersion || defaults.promptVersion,
      modelName: existingDraft.modelName || "openai",
      userApproved: existingDraft.userApproved || booleanValue(incomingDraft.userApproved),
    };

    if (mergedDraft.markdownContent && !mergedDraft.markdownPreview) {
      mergedDraft.markdownPreview = mergedDraft.markdownContent;
    }

    if (mergedDraft.coverLetterContent && !mergedDraft.draftText) {
      mergedDraft.draftText = mergedDraft.coverLetterContent;
    }

    return mergedDraft;
  }

  function addIfBlank(target, existing, field, value) {
    if (isBlank(existing[field]) && !isBlank(value)) {
      target[field] = value;
    }
  }

  function extractOutputText(response) {
    return (response.output || [])
      .flatMap((item) => item.content || [])
      .filter((content) => content.type === "output_text" || content.type === "text")
      .map((content) => content.text)
      .join("");
  }

  function normalizeFitAnalysis(fitAnalysis = {}) {
    return {
      fitScore: Number(fitAnalysis.fitScore),
      fitRecommendation: stringValue(fitAnalysis.fitRecommendation || fitAnalysis.recommendation),
      strengths: arrayValue(fitAnalysis.strengths),
      gaps: arrayValue(fitAnalysis.gaps),
      concerns: arrayValue(fitAnalysis.concerns),
      suggestedPositioning: stringValue(fitAnalysis.suggestedPositioning),
      userApproved: booleanValue(fitAnalysis.userApproved),
    };
  }

  function responseJsonSchema() {
    return {
      type: "json_schema",
      name: "nextmove_opportunity_review",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        required: [
          "company",
          "roleTitle",
          "location",
          "salaryRange",
          "workArrangement",
          "responsibilities",
          "requiredSkills",
          "preferredSkills",
          "technologies",
          "leadershipExpectations",
          "certifications",
          "yearsExperience",
          "fitAnalysis",
          "resumeDraft",
          "coverLetterDraft",
          "interviewPrep",
          "nextAction",
        ],
        properties: {
          company: { type: "string" },
          roleTitle: { type: "string" },
          location: { type: "string" },
          salaryRange: { type: "string" },
          workArrangement: { type: "string" },
          responsibilities: arraySchema(),
          requiredSkills: arraySchema(),
          preferredSkills: arraySchema(),
          technologies: arraySchema(),
          leadershipExpectations: arraySchema(),
          certifications: arraySchema(),
          yearsExperience: { type: "string" },
          fitAnalysis: fitAnalysisSchema(),
          resumeDraft: resumeDraftSchema(),
          coverLetterDraft: coverLetterDraftSchema(),
          interviewPrep: interviewPrepSchema(),
          nextAction: { type: "string" },
        },
      },
    };
  }

  function responseExample() {
    return {
      company: "",
      roleTitle: "",
      location: "",
      salaryRange: "",
      workArrangement: "",
      responsibilities: [],
      requiredSkills: [],
      preferredSkills: [],
      technologies: [],
      leadershipExpectations: [],
      certifications: [],
      yearsExperience: "",
      fitAnalysis: {
        fitScore: 0,
        fitRecommendation: "Maybe",
        strengths: [],
        gaps: [],
        concerns: [],
        suggestedPositioning: "",
        userApproved: false,
      },
      resumeDraft: {
        tailoredSummary: "",
        tailoredSkills: [],
        tailoredExperienceBullets: [],
        markdownContent: "",
        userApproved: false,
      },
      coverLetterDraft: {
        coverLetterContent: "",
        userApproved: false,
      },
      interviewPrep: {
        likelyQuestions: [],
        storiesToPrepare: [],
        riskAreas: [],
        salaryNotes: "",
      },
      nextAction: "",
    };
  }

  function fitAnalysisSchema() {
    return {
      type: "object",
      additionalProperties: false,
      required: ["fitScore", "fitRecommendation", "strengths", "gaps", "concerns", "suggestedPositioning", "userApproved"],
      properties: {
        fitScore: { type: "integer", minimum: 0, maximum: 100 },
        fitRecommendation: { type: "string", enum: FIT_RECOMMENDATIONS },
        strengths: arraySchema(),
        gaps: arraySchema(),
        concerns: arraySchema(),
        suggestedPositioning: { type: "string" },
        userApproved: { type: "boolean" },
      },
    };
  }

  function resumeDraftSchema() {
    return {
      type: "object",
      additionalProperties: false,
      required: ["tailoredSummary", "tailoredSkills", "tailoredExperienceBullets", "markdownContent", "userApproved"],
      properties: {
        tailoredSummary: { type: "string" },
        tailoredSkills: arraySchema(),
        tailoredExperienceBullets: arraySchema(),
        markdownContent: { type: "string" },
        userApproved: { type: "boolean" },
      },
    };
  }

  function coverLetterDraftSchema() {
    return {
      type: "object",
      additionalProperties: false,
      required: ["coverLetterContent", "userApproved"],
      properties: {
        coverLetterContent: { type: "string" },
        userApproved: { type: "boolean" },
      },
    };
  }

  function interviewPrepSchema() {
    return {
      type: "object",
      additionalProperties: false,
      required: ["likelyQuestions", "storiesToPrepare", "riskAreas", "salaryNotes"],
      properties: {
        likelyQuestions: arraySchema(),
        storiesToPrepare: arraySchema(),
        riskAreas: arraySchema(),
        salaryNotes: { type: "string" },
      },
    };
  }

  function arraySchema() {
    return { type: "array", items: { type: "string" } };
  }

  function arrayValue(value) {
    return Array.isArray(value) ? value.map(stringValue).filter(Boolean) : [];
  }

  function booleanValue(value) {
    return value === true;
  }

  function stringValue(value) {
    return String(value || "").trim();
  }

  function isBlank(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return !String(value ?? "").trim();
  }

  const api = {
    analyzeJobWithAI,
    buildJobAnalysisPrompt,
    mergeAIJobAnalysis,
    parseAIJobAnalysisResponse,
    validateAIJobAnalysis,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeAIJobAnalysis = api;
})(typeof window !== "undefined" ? window : globalThis);
