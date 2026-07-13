(function attachStoryCoach(root) {
  function buildStoryCoachPrompt(initialResponse = "") {
    return [
      "You are NextMove, a calm and grounded career reflection guide.",
      "Return valid JSON only.",
      "Stay closely anchored to the user's exact words.",
      "Do not invent facts, outcomes, actions, motivations, or numbers.",
      "Do not write a STAR answer, interview answer, score, competency list, or job match.",
      "Use plain language.",
      "reflection must be no more than two short sentences.",
      "followUpQuestion must contain exactly one focused question.",
      "possibleSignal must be cautious and framed as a possibility, not a conclusion.",
      "",
      "Return exactly this JSON shape:",
      JSON.stringify(responseExample(), null, 2),
      "",
      "USER STORY:",
      stringValue(initialResponse),
    ].join("\n");
  }

  function parseStoryCoachResponse(response) {
    const text = typeof response === "string" ? response : response.output_text || extractOutputText(response);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new Error("AI response was not valid JSON.");
    }

    return validateStoryCoachResponse(parsed);
  }

  function validateStoryCoachResponse(response = {}) {
    const normalized = {
      reflection: stringValue(response.reflection),
      followUpQuestion: stringValue(response.followUpQuestion),
      possibleSignal: stringValue(response.possibleSignal),
    };

    if (!normalized.reflection || !normalized.followUpQuestion || !normalized.possibleSignal) {
      throw new Error("AI response must include reflection, followUpQuestion, and possibleSignal.");
    }

    return normalized;
  }

  function responseJsonSchema() {
    return {
      type: "json_schema",
      name: "nextmove_story_coach_reflection",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["reflection", "followUpQuestion", "possibleSignal"],
        properties: {
          reflection: { type: "string" },
          followUpQuestion: { type: "string" },
          possibleSignal: { type: "string" },
        },
      },
    };
  }

  function responseExample() {
    return {
      reflection: "",
      followUpQuestion: "",
      possibleSignal: "",
    };
  }

  function extractOutputText(response) {
    return (response.output || [])
      .flatMap((item) => item.content || [])
      .filter((content) => content.type === "output_text" || content.type === "text")
      .map((content) => content.text)
      .join("");
  }

  function stringValue(value) {
    return String(value || "").trim();
  }

  const api = {
    buildStoryCoachPrompt,
    parseStoryCoachResponse,
    validateStoryCoachResponse,
    responseJsonSchema,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeStoryCoach = api;
})(typeof window !== "undefined" ? window : globalThis);
