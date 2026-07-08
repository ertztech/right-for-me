function buildResume(careerVault) {
  const person = careerVault.person || {};

  return {
    person: {
      name: person.name || "",
      location: person.location || "",
      email: person.email || "",
      phone: person.phone || "",
    },
    summary: buildSummary(careerVault),
    skills: careerVault.skills || [],
    tools: careerVault.tools || [],
    experience: careerVault.roles || [],
    accomplishments: [
      ...(careerVault.accomplishments || []),
      ...(careerVault.metrics || []),
      ...(careerVault.projects || []),
    ],
  };
}

function buildSummary(careerVault) {
  if (String(careerVault.professionalSummary || "").trim()) {
    return careerVault.professionalSummary.trim();
  }

  const roles = careerVault.roles || [];
  const skills = uniqueCleanList(careerVault.skills);
  const tools = uniqueCleanList(careerVault.tools);
  const accomplishments = uniqueCleanList([
    ...(careerVault.accomplishments || []),
    ...(careerVault.metrics || []),
    ...(careerVault.projects || []),
  ]);
  const sentences = [];

  if (!roles.length && !skills.length && !tools.length && !accomplishments.length) {
    return "Professional summary will become more specific as roles, skills, tools, and accomplishments are added to Profile.";
  }

  if (roles.length) {
    sentences.push(roleSummarySentence(roles));
  } else {
    sentences.push("Professional with experience documented in Profile.");
  }

  const domainAreas = representedDomains(careerVault);
  const strengths = skills.slice(0, 5);
  if (strengths.length || tools.length || domainAreas.length) {
    sentences.push(strengthSummarySentence(strengths, tools, domainAreas));
  }

  if (hasLeadershipExperience(careerVault)) {
    sentences.push("Profile includes leadership experience through documented roles, skills, or accomplishments.");
  }

  if (accomplishments.length) {
    sentences.push(`Selected accomplishment includes ${sentenceCase(accomplishments[0])}`);
  }

  return sentences.slice(0, 4).join(" ");
}

function roleSummarySentence(roles) {
  const roleCount = roles.length;
  const latestRole = roles[0] || {};
  const title = latestRole.title || "";
  const company = latestRole.company || "";
  const roleDetails = [title, company].filter(Boolean).join(" at ");

  if (roleDetails) {
    return `Professional with experience across ${roleCount} role${roleCount === 1 ? "" : "s"}, including ${roleDetails}.`;
  }

  return `Professional with experience across ${roleCount} documented role${roleCount === 1 ? "" : "s"}.`;
}

function strengthSummarySentence(skills, tools, domainAreas) {
  const parts = [];

  if (skills.length) {
    parts.push(`strengths in ${formatList(skills)}`);
  }

  if (tools.length) {
    parts.push(`hands-on work with ${formatList(tools.slice(0, 4))}`);
  }

  if (domainAreas.length) {
    parts.push(`experience connected to ${formatList(domainAreas)}`);
  }

  return `Brings ${parts.join("; ")}.`;
}

function representedDomains(careerVault) {
  const text = [
    ...(careerVault.roles || []).flatMap((role) => [
      role.title,
      role.company,
      role.summary,
    ]),
    ...(careerVault.skills || []),
    ...(careerVault.tools || []),
    ...(careerVault.accomplishments || []),
    ...(careerVault.metrics || []),
    ...(careerVault.projects || []),
    ...(careerVault.stories || []),
  ].join(" ").toLowerCase();

  const domains = [
    ["Agile", ["agile", "scrum", "kanban"]],
    ["Lean", ["lean", "kaizen", "continuous improvement", "value stream"]],
    ["AI", ["ai", "artificial intelligence", "machine learning", "llm"]],
    ["manufacturing", ["manufacturing", "plant", "production", "factory"]],
    ["technology", ["technology", "software", "platform", "systems", "automation"]],
  ];

  return domains
    .filter(([, terms]) => terms.some((term) => includesTerm(text, term)))
    .map(([label]) => label);
}

function hasLeadershipExperience(careerVault) {
  const leadershipTerms = [
    "lead",
    "leader",
    "leadership",
    "manager",
    "director",
    "coach",
    "mentor",
    "supervisor",
  ];
  const text = [
    ...(careerVault.roles || []).flatMap((role) => [
      role.title,
      role.summary,
    ]),
    ...(careerVault.skills || []),
    ...(careerVault.accomplishments || []),
    ...(careerVault.metrics || []),
    ...(careerVault.projects || []),
    ...(careerVault.stories || []),
  ].join(" ").toLowerCase();

  return leadershipTerms.some((term) => text.includes(term));
}

function uniqueCleanList(items = []) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function formatList(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function sentenceCase(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  const withPeriod = /[.!?]$/.test(text) ? text : `${text}.`;
  return `${withPeriod.charAt(0).toLowerCase()}${withPeriod.slice(1)}`;
}

function includesTerm(text, term) {
  if (term === "ai") {
    return /\bai\b/.test(text);
  }

  return text.includes(term);
}

window.RightForMeResumeBuilder = {
  buildResume,
};
