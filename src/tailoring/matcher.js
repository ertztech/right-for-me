const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "their",
  "this",
  "to",
  "we",
  "with",
  "you",
  "your",
]);

const termAliases = {
  agile: ["scrum", "kanban"],
  automation: ["automate", "automated"],
  build: ["builder", "building", "built"],
  change: ["change management", "transformation", "transform"],
  customer: ["client", "stakeholder"],
  data: ["analytics", "metrics", "reporting"],
  improvement: ["continuous improvement", "process improvement", "optimize"],
  leadership: ["lead", "coach", "mentor"],
  metric: ["metrics", "kpi", "okr", "measurement"],
  operation: ["operations", "operational", "process"],
  software: ["application", "developer", "technical", "technology"],
  transformation: ["transform", "change", "modernization"],
};

function normalizeJobText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchCareerVault(jobDescription, careerVault) {
  const normalizedJob = normalizeJobText(jobDescription);
  const jobTokens = tokenize(normalizedJob);

  return {
    jobText: normalizedJob,
    skills: scoreList(careerVault.skills, normalizedJob, jobTokens),
    tools: scoreList(careerVault.tools, normalizedJob, jobTokens),
    roles: scoreRoles(careerVault.roles, normalizedJob, jobTokens),
    accomplishments: scoreList(profileEvidence(careerVault), normalizedJob, jobTokens),
  };
}

function profileEvidence(careerVault = {}) {
  return [
    ...(careerVault.accomplishments || []),
    ...(careerVault.metrics || []),
    ...(careerVault.projects || []),
    ...(careerVault.stories || []),
  ];
}

function scoreList(items = [], jobText, jobTokens) {
  return items.map((item, index) => scoreItem(item, index, jobText, jobTokens));
}

function scoreRoles(roles = [], jobText, jobTokens) {
  return roles.map((role, index) => {
    const roleText = [
      role.title,
      role.company,
      role.summary,
      ...(role.skills || []),
      ...(role.tools || []),
      ...(role.accomplishments || []),
      ...(role.projects || []),
    ].join(" ");

    return {
      ...scoreItem(roleText, index, jobText, jobTokens),
      role,
    };
  });
}

function scoreItem(value, index, jobText, jobTokens) {
  const text = normalizeJobText(value);
  const tokens = tokenize(text);
  const aliases = aliasTokens(tokens);
  const phraseMatch = text && jobText.includes(text);
  const matchedTokens = [...tokens].filter((token) => jobTokens.has(token) || aliasesFor(token).some((alias) => jobText.includes(alias)));
  const aliasMatches = [...aliases].filter((alias) => jobText.includes(alias));
  const score = (phraseMatch ? 10 : 0) + matchedTokens.length * 3 + aliasMatches.length;

  return {
    value,
    index,
    score,
    matchedTerms: [...new Set([...matchedTokens, ...aliasMatches])],
  };
}

function tokenize(text) {
  return new Set(
    normalizeJobText(text)
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !stopWords.has(token))
      .map(stemToken)
  );
}

function aliasTokens(tokens) {
  const aliases = new Set();

  tokens.forEach((token) => {
    aliasesFor(token).forEach((alias) => aliases.add(alias));
  });

  return aliases;
}

function aliasesFor(token) {
  return termAliases[token] || [];
}

function stemToken(token) {
  return token
    .replace(/ies$/, "y")
    .replace(/ments$/, "ment")
    .replace(/ing$/, "")
    .replace(/ed$/, "")
    .replace(/s$/, "");
}

window.RightForMeTailoringMatcher = {
  normalizeJobText,
  matchCareerVault,
};
