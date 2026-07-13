(function attachLiveAIClient(root) {
  const {
    buildJobAnalysisPrompt,
    parseAIJobAnalysisResponse,
  } = requireJobAnalysis(root);
  const {
    buildStoryCoachPrompt,
    parseStoryCoachResponse,
    responseJsonSchema: storyCoachResponseJsonSchema,
  } = requireStoryCoach(root);

  async function analyzeJob(jobRecord = {}, userProfile = {}, options = {}) {
    if (!options.apiKey) {
      throw new Error("OPENAI_API_KEY is required for live AI mode. Set it in .env or enable VITE_AI_TEST_MODE=true for mock analysis.");
    }

    const prompt = buildJobAnalysisPrompt(jobRecord, userProfile);
    const requestBody = {
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
              text: prompt,
            },
          ],
        },
      ],
      text: {
        format: responseJsonSchema(),
      },
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error?.message || `OpenAI request failed with status ${response.status}.`);
    }

    return {
      rawResponse: payload,
      parsedResponse: parseAIJobAnalysisResponse(payload),
      modelName: requestBody.model,
      requestSummary: options.requestSummary || {},
    };
  }

  async function analyzeStory(initialResponse = "", options = {}) {
    if (!options.apiKey) {
      throw new Error("OPENAI_API_KEY is required for live AI mode. Set it in .env or enable VITE_AI_TEST_MODE=true for mock analysis.");
    }

    const prompt = buildStoryCoachPrompt(initialResponse);
    const requestBody = {
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
              text: prompt,
            },
          ],
        },
      ],
      text: {
        format: storyCoachResponseJsonSchema(),
      },
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error?.message || `OpenAI request failed with status ${response.status}.`);
    }

    return {
      rawResponse: payload,
      parsedResponse: parseStoryCoachResponse(payload),
      modelName: requestBody.model,
      requestSummary: options.requestSummary || {},
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

  function fitAnalysisSchema() {
    return {
      type: "object",
      additionalProperties: false,
      required: ["fitScore", "fitRecommendation", "strengths", "gaps", "concerns", "suggestedPositioning", "userApproved"],
      properties: {
        fitScore: { type: "integer", minimum: 0, maximum: 100 },
        fitRecommendation: { type: "string", enum: ["Apply", "Maybe", "Skip"] },
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

  function requireJobAnalysis(rootObject) {
    if (typeof require !== "undefined") {
      return require("../../jobsApplied/aiJobAnalysis");
    }

    return rootObject.RightForMeAIJobAnalysis;
  }

  function requireStoryCoach(rootObject) {
    if (typeof require !== "undefined") {
      return require("../../jobsApplied/storyCoach");
    }

    return rootObject.RightForMeStoryCoach;
  }

  const api = {
    analyzeJob,
    analyzeStory,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeLiveAIClient = api;
})(typeof window !== "undefined" ? window : globalThis);
