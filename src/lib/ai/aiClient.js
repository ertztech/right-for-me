(function attachAIClient(root) {
  const liveAiClient = requireClient(root, "./liveAiClient", "RightForMeLiveAIClient");
  const mockAiClient = requireClient(root, "./mockAiClient", "RightForMeMockAIClient");
  const aiDebugStore = requireClient(root, "./aiDebugStore", "RightForMeAIDebugStore");
  const { buildJobAnalysisPrompt } = requireJobAnalysis(root);

  async function analyzeJob(jobRecord = {}, userProfile = {}, options = {}) {
    const mode = getAIMode(options.env || process.env || {});
    const testModeEnabled = mode === "test";
    const startedAt = Date.now();
    const inputSummary = buildInputSummary(jobRecord, userProfile);
    const client = testModeEnabled ? mockAiClient : liveAiClient;

    try {
      const result = await client.analyzeJob(jobRecord, userProfile, {
        apiKey: options.apiKey,
        model: options.model,
        requestSummary: inputSummary,
      });
      const durationMs = Date.now() - startedAt;

      aiDebugStore.setLatestAIRequest({
        mode,
        testModeEnabled,
        timestamp: new Date(startedAt).toISOString(),
        flowName: "job-analysis",
        inputSummary,
        rawResponse: result.rawResponse,
        parsedResponse: result.parsedResponse,
        durationMs,
      });

      return result.parsedResponse;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      aiDebugStore.setLatestAIRequest({
        mode,
        testModeEnabled,
        timestamp: new Date(startedAt).toISOString(),
        flowName: "job-analysis",
        inputSummary,
        errorMessage: error.message || "AI request failed.",
        durationMs,
      });

      throw error;
    }
  }

  async function analyzeStory(initialResponse = "", options = {}) {
    const mode = getAIMode(options.env || process.env || {});
    const testModeEnabled = mode === "test";
    const startedAt = Date.now();
    const inputSummary = {
      initialResponseCharacters: stringValue(initialResponse).length,
      promptPreview: stringValue(initialResponse).slice(0, 280),
    };
    const client = testModeEnabled ? mockAiClient : liveAiClient;

    try {
      const result = await client.analyzeStory(initialResponse, {
        apiKey: options.apiKey,
        model: options.model,
        requestSummary: inputSummary,
      });
      const durationMs = Date.now() - startedAt;

      aiDebugStore.setLatestAIRequest({
        mode,
        testModeEnabled,
        timestamp: new Date(startedAt).toISOString(),
        flowName: "story-coach",
        inputSummary,
        rawResponse: result.rawResponse,
        parsedResponse: result.parsedResponse,
        durationMs,
      });

      return result.parsedResponse;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      aiDebugStore.setLatestAIRequest({
        mode,
        testModeEnabled,
        timestamp: new Date(startedAt).toISOString(),
        flowName: "story-coach",
        inputSummary,
        errorMessage: error.message || "AI request failed.",
        durationMs,
      });

      throw error;
    }
  }

  function getAIMode(env = {}) {
    return isTruthy(env.VITE_AI_TEST_MODE || env.AI_TEST_MODE) ? "test" : "live";
  }

  function isAITestModeEnabled(env = {}) {
    return getAIMode(env) === "test";
  }

  function buildInputSummary(jobRecord = {}, userProfile = {}) {
    const prompt = buildJobAnalysisPrompt(jobRecord, userProfile);
    return {
      company: stringValue(jobRecord.company),
      roleTitle: stringValue(jobRecord.roleTitle),
      postingCharacters: stringValue(jobRecord.sourcePostingText).length,
      profileSections: Object.keys(userProfile || {}).filter((key) => !isBlank(userProfile[key])),
      promptPreview: prompt.slice(0, 700),
    };
  }

  function isTruthy(value) {
    return ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
  }

  function isBlank(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (value && typeof value === "object") {
      return Object.keys(value).length === 0;
    }

    return !String(value ?? "").trim();
  }

  function stringValue(value) {
    return String(value || "").trim();
  }

  function requireClient(rootObject, path, globalName) {
    if (typeof require !== "undefined") {
      return require(path);
    }

    return rootObject[globalName];
  }

  function requireJobAnalysis(rootObject) {
    if (typeof require !== "undefined") {
      return require("../../jobsApplied/aiJobAnalysis");
    }

    return rootObject.RightForMeAIJobAnalysis;
  }

  const api = {
    analyzeJob,
    analyzeStory,
    buildInputSummary,
    getAIMode,
    isAITestModeEnabled,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeAIClient = api;
})(typeof window !== "undefined" ? window : globalThis);
