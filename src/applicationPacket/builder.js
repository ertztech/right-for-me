const packetGenericJobDescription = "The role values clear communication, leadership, operations, technology, collaboration, measurable outcomes, and thoughtful problem solving.";

const gapSignals = [
  "agile",
  "automation",
  "change",
  "communication",
  "customer",
  "data",
  "design",
  "documentation",
  "leadership",
  "metrics",
  "operations",
  "process",
  "product",
  "project management",
  "react",
  "research",
  "software",
  "stakeholder",
  "testing",
  "training",
  "transformation",
];

function buildApplicationPacket(careerVault, jobDescription) {
  const jobText = jobDescription || packetGenericJobDescription;
  const relevanceSignals = RightForMeTailoringMatcher.matchCareerVault(
    jobText,
    careerVault
  );
  const tailoredResume = RightForMeTailoredResume.buildTailoredResume(
    careerVault,
    relevanceSignals
  );
  const coverLetter = RightForMeCoverLetterBuilder.buildCoverLetter(
    careerVault,
    jobText
  );

  return {
    tailoredResume,
    coverLetter,
    applicationNotes: buildPacketApplicationNotes(careerVault, jobText, relevanceSignals),
  };
}

function buildPacketApplicationNotes(careerVault, jobText, relevanceSignals) {
  return {
    strongestSkills: packetStrongestValues(relevanceSignals.skills, 6),
    strongestTools: packetStrongestValues(relevanceSignals.tools, 5),
    resumeEmphasis: buildPacketResumeEmphasis(careerVault, relevanceSignals),
    possibleGaps: buildPacketPossibleGaps(jobText, careerVault, relevanceSignals),
  };
}

function packetStrongestValues(signals = [], limit) {
  const matched = packetPrioritizedSignals(signals).filter((signal) => signal.score > 0);
  const fallback = packetPrioritizedSignals(signals).filter((signal) => signal.score === 0);

  return [...matched, ...fallback]
    .map((signal) => signal.value)
    .filter(Boolean)
    .slice(0, limit);
}

function buildPacketResumeEmphasis(careerVault, relevanceSignals) {
  const accomplishments = packetStrongestValues(relevanceSignals.accomplishments, 3);
  const roles = packetPrioritizedSignals(relevanceSignals.roles)
    .filter((signal) => signal.score > 0)
    .map((signal) => careerVault.roles?.[signal.index])
    .filter(Boolean)
    .map(formatPacketRole)
    .slice(0, 2);

  const emphasis = [];

  accomplishments.forEach((item) => {
    emphasis.push(`Lead with accomplishment evidence: ${item}`);
  });

  roles.forEach((role) => {
    emphasis.push(`Keep ${role} prominent in the experience section.`);
  });

  if (!emphasis.length) {
    emphasis.push("Use the strongest documented Career Vault skills and accomplishments; do not add unsupported claims.");
  }

  return emphasis;
}

function buildPacketPossibleGaps(jobText, careerVault, relevanceSignals) {
  const normalizedJob = RightForMeTailoringMatcher.normalizeJobText(jobText);
  const coveredTerms = new Set(
    [
      ...packetMatchedTerms(relevanceSignals.skills),
      ...packetMatchedTerms(relevanceSignals.tools),
      ...packetMatchedTerms(relevanceSignals.roles),
      ...packetMatchedTerms(relevanceSignals.accomplishments),
      ...packetVaultTerms(careerVault),
    ].map((term) => RightForMeTailoringMatcher.normalizeJobText(term))
  );

  const gaps = gapSignals
    .filter((signal) => normalizedJob.includes(signal))
    .filter((signal) => !coveredTerms.has(signal))
    .slice(0, 5)
    .map((signal) => `Prepare an honest bridge for ${signal} if asked.`);

  if (!gaps.length) {
    gaps.push("No obvious first-pass gaps found from the rule-based match. Still review seniority, domain, and must-have requirements before applying.");
  }

  return gaps;
}

function packetMatchedTerms(signals = []) {
  return signals.flatMap((signal) => signal.matchedTerms || []);
}

function packetVaultTerms(careerVault) {
  return [
    ...(careerVault.skills || []),
    ...(careerVault.tools || []),
    ...(careerVault.roles || []).flatMap((role) => [
      role.title,
      role.company,
      role.summary,
    ]),
    ...(careerVault.accomplishments || []),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean);
}

function packetPrioritizedSignals(signals = []) {
  return [...signals].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.index - b.index;
  });
}

function formatPacketRole(role = {}) {
  const title = String(role.title || "").trim();
  const company = String(role.company || "").trim();

  if (title && company) {
    return `${title} at ${company}`;
  }

  return title || company || "a documented Career Vault role";
}

window.RightForMeApplicationPacketBuilder = {
  buildApplicationPacket,
};
