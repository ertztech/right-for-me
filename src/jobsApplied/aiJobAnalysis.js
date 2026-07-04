(function attachAIJobAnalysis(root) {
  const FIT_RECOMMENDATIONS = ["Apply", "Maybe", "Skip"];
  const ARRAY_FIELDS = [
    "responsibilities",
    "requiredSkills",
    "preferredSkills",
    "technologies",
    "leadershipExpectations",
    "certifications",
    "strengths",
    "gaps",
    "concerns",
  ];

  function buildJobAnalysisPrompt(jobRecord = {}, userProfile = {}) {
    return [
      "You are NextMove, a calm, honest career coach.",
      "Analyze the job posting and return valid JSON only.",
      "Be practical. Do not exaggerate the user's fit or invent experience.",
      "If information is missing, use empty strings or empty arrays.",
      "Recommendation must be one of: Apply, Maybe, Skip.",
      "fitScore must be an integer from 0 to 100.",
      "",
      "Return JSON with exactly these top-level fields:",
      "company, roleTitle, location, salaryRange, workArrangement, responsibilities, requiredSkills, preferredSkills, technologies, leadershipExpectations, certifications, yearsExperience, fitScore, fitRecommendation, strengths, gaps, concerns, suggestedPositioning, resumeDraft, coverLetterDraft.",
      "",
      "resumeDraft fields: tailoredSummary, tailoredSkills, tailoredExperienceBullets, markdownContent.",
      "coverLetterDraft fields: coverLetterContent.",
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

  function validateAIJobAnalysis(analysis) {
    const normalized = {
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
      fitScore: Number(analysis.fitScore),
      fitRecommendation: stringValue(analysis.fitRecommendation),
      strengths: arrayValue(analysis.strengths),
      gaps: arrayValue(analysis.gaps),
      concerns: arrayValue(analysis.concerns),
      suggestedPositioning: stringValue(analysis.suggestedPositioning),
      resumeDraft: {
        tailoredSummary: stringValue(analysis.resumeDraft?.tailoredSummary),
        tailoredSkills: arrayValue(analysis.resumeDraft?.tailoredSkills),
        tailoredExperienceBullets: arrayValue(analysis.resumeDraft?.tailoredExperienceBullets),
        markdownContent: stringValue(analysis.resumeDraft?.markdownContent),
      },
      coverLetterDraft: {
        coverLetterContent: stringValue(analysis.coverLetterDraft?.coverLetterContent),
      },
    };

    if (!Number.isFinite(normalized.fitScore) || normalized.fitScore < 0 || normalized.fitScore > 100) {
      throw new Error("AI response fitScore must be 0-100.");
    }

    normalized.fitScore = Math.round(normalized.fitScore);

    if (!FIT_RECOMMENDATIONS.includes(normalized.fitRecommendation)) {
      throw new Error("AI response fitRecommendation must be Apply, Maybe, or Skip.");
    }

    return normalized;
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
    ].forEach((field) => {
      addIfBlank(merged, existingJob, field, analysis[field]);
    });

    ARRAY_FIELDS.slice(0, 6).forEach((field) => {
      addIfBlank(merged, existingJob, field, analysis[field]);
    });

    const existingFit = {
      ...(existingJob.fitAnalysis || {}),
      fitScore: existingJob.fitAnalysis?.fitScore ?? existingJob.fitScore,
      recommendation: existingJob.fitAnalysis?.recommendation ?? existingJob.fitRecommendation,
    };
    const fitUpdates = {};
    addIfBlank(fitUpdates, existingFit, "fitScore", analysis.fitScore);
    addIfBlank(fitUpdates, existingFit, "recommendation", analysis.fitRecommendation);
    addIfBlank(fitUpdates, existingFit, "strengths", analysis.strengths);
    addIfBlank(fitUpdates, existingFit, "gaps", analysis.gaps);
    addIfBlank(fitUpdates, existingFit, "concerns", analysis.concerns);
    addIfBlank(fitUpdates, existingFit, "suggestedPositioning", analysis.suggestedPositioning);

    if (Object.keys(fitUpdates).length) {
      merged.fitAnalysis = {
        ...existingFit,
        ...fitUpdates,
        generatedAt: existingFit.generatedAt || new Date().toISOString(),
        promptVersion: existingFit.promptVersion || "live-ai-job-analysis-v1",
        modelName: existingFit.modelName || "openai",
        userApproved: existingFit.userApproved || false,
      };

      if (isBlank(existingJob.fitScore) && !isBlank(merged.fitAnalysis.fitScore)) {
        merged.fitScore = merged.fitAnalysis.fitScore;
      }

      if (isBlank(existingJob.fitRecommendation) && !isBlank(merged.fitAnalysis.recommendation)) {
        merged.fitRecommendation = merged.fitAnalysis.recommendation;
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

    return merged;
  }

  function mergeDraft(existingDraft, incomingDraft, defaults) {
    const updates = {};
    Object.keys(incomingDraft).forEach((field) => {
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
      userApproved: existingDraft.userApproved || false,
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

  function responseJsonSchema() {
    return {
      type: "json_schema",
      name: "nextmove_job_analysis",
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
          "fitScore",
          "fitRecommendation",
          "strengths",
          "gaps",
          "concerns",
          "suggestedPositioning",
          "resumeDraft",
          "coverLetterDraft",
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
          fitScore: { type: "integer", minimum: 0, maximum: 100 },
          fitRecommendation: { type: "string", enum: FIT_RECOMMENDATIONS },
          strengths: arraySchema(),
          gaps: arraySchema(),
          concerns: arraySchema(),
          suggestedPositioning: { type: "string" },
          resumeDraft: {
            type: "object",
            additionalProperties: false,
            required: ["tailoredSummary", "tailoredSkills", "tailoredExperienceBullets", "markdownContent"],
            properties: {
              tailoredSummary: { type: "string" },
              tailoredSkills: arraySchema(),
              tailoredExperienceBullets: arraySchema(),
              markdownContent: { type: "string" },
            },
          },
          coverLetterDraft: {
            type: "object",
            additionalProperties: false,
            required: ["coverLetterContent"],
            properties: {
              coverLetterContent: { type: "string" },
            },
          },
        },
      },
    };
  }

  function arraySchema() {
    return { type: "array", items: { type: "string" } };
  }

  function arrayValue(value) {
    return Array.isArray(value) ? value.map(stringValue).filter(Boolean) : [];
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
