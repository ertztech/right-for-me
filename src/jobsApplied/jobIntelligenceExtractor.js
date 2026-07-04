(function attachJobIntelligenceExtractor(root) {
  const FIELD_HEADINGS = {
    responsibilities: [
      "responsibilities",
      "what you will do",
      "what you'll do",
      "role responsibilities",
      "key responsibilities",
      "duties",
    ],
    requiredSkills: [
      "requirements",
      "required qualifications",
      "qualifications",
      "minimum qualifications",
      "required skills",
      "must have",
    ],
    preferredSkills: [
      "preferred qualifications",
      "preferred skills",
      "nice to have",
      "bonus points",
      "preferred",
    ],
    technologies: [
      "tools",
      "tools and technologies",
      "technologies",
      "technology",
      "tech stack",
      "systems",
      "platforms",
    ],
    leadershipExpectations: [
      "leadership",
      "leadership expectations",
      "management",
      "stakeholder",
      "collaboration",
    ],
    certifications: [
      "certifications",
      "licenses",
      "credentials",
    ],
  };

  const KNOWN_TECHNOLOGIES = [
    "AWS",
    "Azure",
    "Excel",
    "Git",
    "Google Analytics",
    "Jira",
    "Power BI",
    "Python",
    "React",
    "Salesforce",
    "SAP",
    "ServiceNow",
    "SQL",
    "Tableau",
    "Workday",
  ];

  function extractJobIntelligence(sourceText = "") {
    const text = String(sourceText || "");
    const sections = parseSections(text);

    return {
      responsibilities: uniqueLines(sectionItems(sections, "responsibilities")),
      requiredSkills: uniqueLines([
        ...sectionItems(sections, "requiredSkills"),
        ...keywordLines(text, ["required", "requirements", "must have", "experience with"]),
      ]),
      preferredSkills: uniqueLines([
        ...sectionItems(sections, "preferredSkills"),
        ...keywordLines(text, ["preferred", "nice to have", "bonus"]),
      ]),
      technologies: uniqueLines([
        ...sectionItems(sections, "technologies"),
        ...knownTechnologyMatches(text),
      ]),
      leadershipExpectations: uniqueLines([
        ...sectionItems(sections, "leadershipExpectations"),
        ...keywordLines(text, ["lead", "leadership", "stakeholder", "cross-functional", "manage"]),
      ]),
      certifications: uniqueLines([
        ...sectionItems(sections, "certifications"),
        ...certificationMatches(text),
      ]),
      yearsExperience: firstMatch(text, /\b(\d+\+?\s*(?:years|yrs)(?:\s+of)?\s+experience)\b/i),
      salaryRange: firstMatch(text, /\$\s?\d{2,3}(?:,\d{3})?(?:\s?(?:-|to|–)\s?\$?\s?\d{2,3}(?:,\d{3})?)?/i),
      location: detectLocation(text),
      workArrangement: detectWorkArrangement(text),
    };
  }

  function mergeExtractedJobIntelligence(existing = {}, extracted = {}) {
    return Object.keys(extracted).reduce((merged, field) => {
      if (isBlank(existing[field]) && !isBlank(extracted[field])) {
        merged[field] = extracted[field];
      }

      return merged;
    }, {});
  }

  function parseSections(text) {
    const sections = {};
    let activeField = "";

    splitLines(text).forEach((line) => {
      const headingField = fieldForHeading(line);
      if (headingField) {
        activeField = headingField;
        return;
      }

      const item = cleanListItem(line);
      if (activeField && item) {
        sections[activeField] = [...(sections[activeField] || []), item];
      }
    });

    return sections;
  }

  function fieldForHeading(line) {
    const normalized = normalizeHeading(line);
    return Object.entries(FIELD_HEADINGS).find(([, headings]) => headings.includes(normalized))?.[0] || "";
  }

  function sectionItems(sections, field) {
    return sections[field] || [];
  }

  function keywordLines(text, keywords) {
    const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
    return splitLines(text)
      .map(cleanListItem)
      .filter((line) => normalizedKeywords.some((keyword) => line.toLowerCase().includes(keyword)));
  }

  function knownTechnologyMatches(text) {
    const lowerText = text.toLowerCase();
    return KNOWN_TECHNOLOGIES.filter((technology) => lowerText.includes(technology.toLowerCase()));
  }

  function certificationMatches(text) {
    return splitLines(text)
      .map(cleanListItem)
      .filter((line) => /\b(certification|certified|PMP|CPA|Scrum|Six Sigma|license)\b/i.test(line));
  }

  function detectWorkArrangement(text) {
    if (/\bhybrid\b/i.test(text)) return "Hybrid";
    if (/\bremote\b/i.test(text)) return "Remote";
    if (/\b(on-site|onsite|in office|in-office)\b/i.test(text)) return "On-site";
    return "";
  }

  function detectLocation(text) {
    const explicit = firstMatch(text, /\b(?:location|based in):\s*([^\n]+)/i, 1);
    if (explicit) {
      return explicit;
    }

    const remoteLocation = firstMatch(text, /\b(remote\s*(?:-|,)?\s*(?:US|United States|USA))\b/i);
    return remoteLocation || "";
  }

  function firstMatch(text, pattern, group = 0) {
    const match = String(text || "").match(pattern);
    return match ? cleanValue(match[group]) : "";
  }

  function splitLines(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function cleanListItem(line) {
    return cleanValue(line.replace(/^[-*•]\s+/, "").replace(/^\d+[.)]\s+/, ""));
  }

  function normalizeHeading(line) {
    return cleanValue(line)
      .replace(/:$/, "")
      .toLowerCase();
  }

  function cleanValue(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function uniqueLines(items) {
    const seen = new Set();
    return items
      .map(cleanValue)
      .filter(Boolean)
      .filter((item) => {
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
    extractJobIntelligence,
    mergeExtractedJobIntelligence,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.RightForMeJobIntelligenceExtractor = api;
})(typeof window !== "undefined" ? window : globalThis);
