(function attachAIDebugStore(root) {
  let latestEntry = null;

  function setLatestAIRequest(entry = {}) {
    latestEntry = {
      mode: entry.mode || "live",
      testModeEnabled: entry.testModeEnabled === true,
      timestamp: entry.timestamp || new Date().toISOString(),
      flowName: entry.flowName || "unknown",
      inputSummary: sanitizeInputSummary(entry.inputSummary || {}),
      rawResponse: sanitizePayload(entry.rawResponse),
      parsedResponse: sanitizePayload(entry.parsedResponse),
      errorMessage: stringValue(entry.errorMessage),
      durationMs: Number.isFinite(entry.durationMs) ? Math.round(entry.durationMs) : null,
    };

    return latestEntry;
  }

  function getLatestAIRequest() {
    return latestEntry;
  }

  function resetAIDebugStore() {
    latestEntry = null;
  }

  function sanitizeInputSummary(summary = {}) {
    return {
      company: stringValue(summary.company),
      roleTitle: stringValue(summary.roleTitle),
      postingCharacters: numberValue(summary.postingCharacters),
      profileSections: Array.isArray(summary.profileSections) ? summary.profileSections.map(stringValue).filter(Boolean) : [],
      promptPreview: truncate(stringValue(summary.promptPreview), 700),
    };
  }

  function sanitizePayload(payload) {
    if (payload === undefined) {
      return null;
    }

    if (typeof payload === "string") {
      return truncate(payload, 6000);
    }

    if (payload === null || typeof payload !== "object") {
      return payload;
    }

    return JSON.parse(JSON.stringify(payload, (key, value) => {
      if (/api[_-]?key|authorization|token|secret|password/i.test(key)) {
        return "[redacted]";
      }

      if (typeof value === "string") {
        return truncate(value, 6000);
      }

      return value;
    }));
  }

  function truncate(value, maxLength) {
    if (!value || value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength)}...`;
  }

  function numberValue(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function stringValue(value) {
    return String(value || "").trim();
  }

  const api = {
    getLatestAIRequest,
    resetAIDebugStore,
    setLatestAIRequest,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeAIDebugStore = api;
})(typeof window !== "undefined" ? window : globalThis);
