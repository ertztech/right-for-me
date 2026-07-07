(function attachMockAIClient(root) {
  const { validateAIJobAnalysis } = requireJobAnalysis(root);

  async function analyzeJob(jobRecord = {}, userProfile = {}, options = {}) {
    const response = buildMockJobAnalysis(jobRecord, userProfile);
    return {
      rawResponse: JSON.stringify(response),
      parsedResponse: validateAIJobAnalysis(response),
      modelName: "nextmove-mock-ai",
      requestSummary: options.requestSummary || {},
    };
  }

  function buildMockJobAnalysis(jobRecord = {}) {
    const company = stringValue(jobRecord.company) || "Sample Company";
    const roleTitle = stringValue(jobRecord.roleTitle) || inferRoleTitle(jobRecord.sourcePostingText) || "Operations Program Manager";
    const location = stringValue(jobRecord.location) || "Hybrid";
    const salaryRange = stringValue(jobRecord.salaryRange);
    const workArrangement = stringValue(jobRecord.workArrangement) || inferWorkArrangement(jobRecord.sourcePostingText);
    const requiredSkills = existingOrDefault(jobRecord.requiredSkills, [
      "Cross-functional stakeholder management",
      "Process improvement",
      "Metrics and reporting",
      "Clear executive communication",
    ]);
    const technologies = existingOrDefault(jobRecord.technologies, ["Excel", "Power BI", "Jira"]);

    return {
      company,
      roleTitle,
      location,
      salaryRange,
      workArrangement,
      responsibilities: existingOrDefault(jobRecord.responsibilities, [
        "Translate role requirements into a practical delivery plan.",
        "Coordinate stakeholders across operations, product, and leadership.",
        "Use metrics to identify bottlenecks and guide next actions.",
      ]),
      requiredSkills,
      preferredSkills: existingOrDefault(jobRecord.preferredSkills, [
        "AI tooling familiarity",
        "Change management experience",
        "SaaS or operations environment exposure",
      ]),
      technologies,
      leadershipExpectations: existingOrDefault(jobRecord.leadershipExpectations, [
        "Create structure for ambiguous work.",
        "Communicate tradeoffs clearly to senior stakeholders.",
      ]),
      certifications: existingOrDefault(jobRecord.certifications, []),
      yearsExperience: stringValue(jobRecord.yearsExperience) || "5+ years",
      fitAnalysis: {
        fitScore: 78,
        fitRecommendation: "Apply",
        strengths: [
          "The posting emphasizes operations structure, stakeholder coordination, and measurable execution.",
          "The role appears to value practical communication and process improvement more than narrow technical specialization.",
          `Resume language can mirror the posting's focus on ${requiredSkills.slice(0, 2).join(" and ")}.`,
        ],
        gaps: [
          "Confirm the depth expected around any domain-specific tools or AI workflows.",
          "Prepare one concrete example that ties metrics, decision-making, and cross-functional follow-through together.",
        ],
        concerns: [
          "Seniority and ownership scope should be clarified before investing heavily in the application.",
        ],
        suggestedPositioning: "Position yourself as a steady operator who turns ambiguous priorities into organized execution, measurable progress, and usable communication for stakeholders.",
        userApproved: false,
      },
      resumeDraft: {
        tailoredSummary: "Operations and program leader with experience bringing structure to ambiguous work, aligning stakeholders, and using metrics to improve delivery.",
        tailoredSkills: uniqueList([
          ...requiredSkills,
          ...technologies,
          "Change management",
          "Operating cadence design",
        ]).slice(0, 8),
        tailoredExperienceBullets: [
          "Translate complex business needs into clear delivery plans, operating rhythms, and accountable next steps.",
          "Partner across functions to identify risks, remove bottlenecks, and keep progress visible through practical metrics.",
          "Communicate tradeoffs and recommendations in plain language so leaders can make timely decisions.",
        ],
        markdownContent: [
          "# Tailored Resume Notes",
          "",
          "## Summary",
          "Operations and program leader with experience bringing structure to ambiguous work, aligning stakeholders, and using metrics to improve delivery.",
          "",
          "## Emphasis",
          "- Cross-functional execution",
          "- Process improvement and metrics",
          "- Clear stakeholder communication",
        ].join("\n"),
        userApproved: false,
      },
      coverLetterDraft: {
        coverLetterContent: `Dear hiring team,\n\nI am interested in the ${roleTitle} role at ${company} because it calls for practical execution, clear communication, and thoughtful prioritization. My background is strongest where teams need someone to turn ambiguity into a plan, align stakeholders, and keep progress visible through useful metrics.\n\nI would welcome the chance to connect my experience to the outcomes this role needs most.\n\nSincerely,\n`,
        userApproved: false,
      },
      interviewPrep: {
        likelyQuestions: [
          "Tell us about a time you brought structure to an ambiguous initiative.",
          "How do you use metrics without creating unnecessary reporting overhead?",
          "What would you do first if stakeholders disagreed about priorities?",
        ],
        storiesToPrepare: [
          "A cross-functional project where you clarified ownership and improved delivery.",
          "A metrics or reporting example that changed a decision or behavior.",
        ],
        riskAreas: [
          "Depth of domain-specific tooling.",
          "Exact seniority level and decision authority.",
        ],
        salaryNotes: salaryRange
          ? "Use the posted range as the anchor and confirm total compensation details."
          : "No clear salary range was detected; ask for the range before late-stage interviews.",
      },
      nextAction: "Review the mock analysis, edit any saved fields that need your voice, then compare the posting against one or two concrete experience stories before applying.",
    };
  }

  function inferRoleTitle(text) {
    const match = stringValue(text).match(/\b(?:manager|lead|director|specialist|analyst|coordinator|consultant)\b[^\n.]{0,80}/i);
    return match ? titleCase(match[0]) : "";
  }

  function inferWorkArrangement(text) {
    const lower = stringValue(text).toLowerCase();
    if (lower.includes("remote")) {
      return "Remote";
    }
    if (lower.includes("hybrid")) {
      return "Hybrid";
    }
    if (lower.includes("onsite") || lower.includes("on-site")) {
      return "On-site";
    }
    return "";
  }

  function existingOrDefault(value, fallback) {
    return Array.isArray(value) && value.length ? value.map(stringValue).filter(Boolean) : fallback;
  }

  function uniqueList(values) {
    return [...new Set(values.map(stringValue).filter(Boolean))];
  }

  function titleCase(value) {
    return stringValue(value).replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  }

  function stringValue(value) {
    return String(value || "").trim();
  }

  function requireJobAnalysis(rootObject) {
    if (typeof require !== "undefined") {
      return require("../../jobsApplied/aiJobAnalysis");
    }

    return rootObject.RightForMeAIJobAnalysis;
  }

  const api = {
    analyzeJob,
    buildMockJobAnalysis,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeMockAIClient = api;
})(typeof window !== "undefined" ? window : globalThis);
