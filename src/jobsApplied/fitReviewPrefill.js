(function attachFitReviewPrefill(root) {
  const POSITIVE_KEYWORDS = [
    "agile",
    "automation",
    "change management",
    "continuous improvement",
    "cross-functional",
    "data",
    "leadership",
    "metrics",
    "operations",
    "process improvement",
    "stakeholder",
    "transformation",
  ];

  const TECHNICAL_KEYWORDS = [
    "ai",
    "analytics",
    "api",
    "cloud",
    "data",
    "developer",
    "engineering",
    "python",
    "sql",
    "software",
    "technical",
  ];

  const CONCERN_KEYWORDS = [
    "certification required",
    "degree required",
    "license required",
    "must be certified",
    "required certification",
    "travel required",
  ];

  function generateFitReviewPrefill(job = {}) {
    const text = combinedJobText(job);
    const strengths = buildStrengths(job, text);
    const gaps = buildGaps(job, text);
    const concerns = buildConcerns(job, text);
    const score = clampScore(50 + scoreSignals(job, text, strengths, gaps, concerns));
    const recommendation = recommendationFor(score, concerns);

    return {
      fitScore: score,
      recommendation,
      strengths,
      gaps,
      concerns,
      suggestedPositioning: suggestedPositioning(job, strengths, gaps, recommendation),
      generatedAt: "",
      promptVersion: "fit-prefill-rules-v1",
      modelName: "local-rules",
      userApproved: false,
    };
  }

  function mergeFitReviewPrefill(existing = {}, prefill = {}) {
    return Object.keys(prefill).reduce((merged, field) => {
      if (isBlank(existing[field]) && !isBlank(prefill[field])) {
        merged[field] = prefill[field];
      }

      return merged;
    }, {});
  }

  function buildStrengths(job, text) {
    const strengths = [];

    if (containsAny(text, ["transformation", "change management", "continuous improvement"])) {
      strengths.push("Role emphasizes transformation, change, or continuous improvement.");
    }

    if (containsAny(text, ["operations", "process improvement", "metrics", "kpi"])) {
      strengths.push("Operational metrics and process improvement appear central to the role.");
    }

    if (containsAny(text, ["leadership", "stakeholder", "cross-functional", "manage"])) {
      strengths.push("Leadership and cross-functional influence are visible expectations.");
    }

    if (containsAny(text, TECHNICAL_KEYWORDS)) {
      strengths.push("Technical, data, or builder-oriented language appears in the posting.");
    }

    if (Array.isArray(job.technologies) && job.technologies.length) {
      strengths.push(`Named tools to compare against the Story Bank: ${job.technologies.slice(0, 4).join(", ")}.`);
    }

    return unique(strengths);
  }

  function buildGaps(job, text) {
    const gaps = [];
    const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];

    if (requiredSkills.length >= 6) {
      gaps.push("Many required skills are listed; review each one against real Story Bank evidence.");
    }

    if (job.yearsExperience) {
      gaps.push(`Confirm years-of-experience fit: ${job.yearsExperience}.`);
    }

    if (containsAny(text, ["budget", "p&l", "profit and loss"])) {
      gaps.push("Prepare concrete examples for budget, ownership, or business accountability.");
    }

    if (!requiredSkills.length && !job.sourcePostingText) {
      gaps.push("Add or extract Job Intelligence before trusting the recommendation.");
    }

    return unique(gaps);
  }

  function buildConcerns(job, text) {
    const concerns = [];
    const certifications = Array.isArray(job.certifications) ? job.certifications : [];

    if (certifications.length || containsAny(text, CONCERN_KEYWORDS)) {
      concerns.push("Certification, license, or credential requirements may need confirmation.");
    }

    if (containsAny(text, ["travel required", "50% travel", "75% travel"])) {
      concerns.push("Travel expectations may affect fit and sustainability.");
    }

    if (containsAny(text, ["senior executive", "vp ", "vice president", "c-level"])) {
      concerns.push("Seniority expectations may require careful positioning.");
    }

    if (containsAny(text, ["must have", "required"]) && containsAny(text, ["10+ years", "12+ years", "15+ years"])) {
      concerns.push("Experience bar appears high; verify before committing application time.");
    }

    return unique(concerns);
  }

  function scoreSignals(job, text, strengths, gaps, concerns) {
    let score = 0;
    const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
    const preferredSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];

    score += strengths.length * 8;
    score += preferredSkills.length ? 4 : 0;
    score += Array.isArray(job.technologies) && job.technologies.length ? 4 : 0;
    score += containsAny(text, POSITIVE_KEYWORDS) ? 8 : 0;
    score += containsAny(text, ["strong match", "good match", "great fit"]) ? 12 : 0;

    score -= Math.max(0, requiredSkills.length - 4) * 6;
    score -= gaps.length * 4;
    score -= concerns.length * 8;
    score -= containsAny(text, ["no experience", "missing experience", "not a fit"]) ? 18 : 0;
    score -= containsAny(text, ["needs review", "needs confirmation", "needs validation"]) ? 10 : 0;

    return score;
  }

  function recommendationFor(score, concerns) {
    const seriousConcernCount = concerns.filter((concern) => /certification|experience bar|seniority/i.test(concern)).length;

    if (score >= 72 && seriousConcernCount < 2) {
      return "Apply";
    }

    if (score >= 48 && seriousConcernCount < 3) {
      return "Maybe";
    }

    return "Skip";
  }

  function suggestedPositioning(job, strengths, gaps, recommendation) {
    const role = [job.company, job.roleTitle].filter(Boolean).join(" - ") || "this role";
    const lead = strengths[0] || "Lead with verified Story Bank evidence, not generic claims.";
    const caution = gaps[0] ? ` Prepare for this gap: ${gaps[0]}` : "";

    if (recommendation === "Apply") {
      return `For ${role}, lead with the strongest matching evidence. ${lead}${caution}`;
    }

    if (recommendation === "Maybe") {
      return `For ${role}, review the gaps before applying. ${lead}${caution}`;
    }

    return `For ${role}, pause before applying unless the gaps can be answered with real evidence. ${caution}`.trim();
  }

  function combinedJobText(job) {
    return [
      job.roleTitle,
      job.company,
      job.location,
      job.salaryRange,
      job.workArrangement,
      job.yearsExperience,
      job.notes,
      job.sourcePostingText,
      ...(job.responsibilities || []),
      ...(job.requiredSkills || []),
      ...(job.preferredSkills || []),
      ...(job.technologies || []),
      ...(job.leadershipExpectations || []),
      ...(job.certifications || []),
    ].join(" ").toLowerCase();
  }

  function containsAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  }

  function clampScore(score) {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function unique(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function isBlank(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return !String(value || "").trim();
  }

  const api = {
    generateFitReviewPrefill,
    mergeFitReviewPrefill,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeFitReviewPrefill = api;
})(typeof window !== "undefined" ? window : globalThis);
