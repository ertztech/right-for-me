function buildCoverLetter(careerVault, jobDescription) {
  const relevanceSignals = RightForMeTailoringMatcher.matchCareerVault(
    jobDescription || genericJobDescription(),
    careerVault
  );
  const evidence = buildEvidence(careerVault, relevanceSignals);

  return {
    person: careerVault.person || {},
    greeting: "Dear Hiring Team,",
    opening: buildOpening(evidence),
    body: buildBody(evidence),
    closing: buildClosing(careerVault.person),
  };
}

function buildEvidence(careerVault, relevanceSignals) {
  return {
    skills: prioritizeValues(relevanceSignals.skills).slice(0, 3),
    tools: prioritizeValues(relevanceSignals.tools).slice(0, 2),
    roles: prioritizeRoles(careerVault.roles, relevanceSignals.roles).slice(0, 2),
    accomplishments: prioritizeValues(relevanceSignals.accomplishments).slice(0, 3),
  };
}

function buildOpening(evidence) {
  const strengths = formatList([...evidence.skills, ...evidence.tools].slice(0, 4));

  if (strengths) {
    return `I am excited to apply for this opportunity. The role connects well with Career Vault evidence around ${strengths}, and I would welcome the chance to bring that experience to your team.`;
  }

  return "I am excited to apply for this opportunity. I would welcome the chance to bring my documented experience, curiosity, and steady follow-through to your team.";
}

function buildBody(evidence) {
  const paragraphs = [];
  const roleParagraph = buildRoleParagraph(evidence.roles);
  const accomplishmentParagraph = buildAccomplishmentParagraph(evidence.accomplishments);
  const skillsParagraph = buildSkillsParagraph(evidence.skills, evidence.tools);

  if (roleParagraph) paragraphs.push(roleParagraph);
  if (accomplishmentParagraph) paragraphs.push(accomplishmentParagraph);
  if (skillsParagraph) paragraphs.push(skillsParagraph);

  if (!paragraphs.length) {
    paragraphs.push("My Career Vault is still growing, but I am interested in roles where I can contribute thoughtfully, learn quickly, and communicate clearly.");
  }

  return paragraphs;
}

function buildRoleParagraph(roles) {
  const role = roles[0];
  if (!role) {
    return "";
  }

  const heading = formatRole(role);
  const summary = String(role.summary || "").trim();

  if (heading && summary) {
    return `In my work as ${heading}, my Career Vault summary notes: ${sentenceFragment(summary)}`;
  }

  if (heading) {
    return `My Career Vault includes experience as ${heading}, which I would be glad to connect to the needs of this role in more detail.`;
  }

  return summary ? `My documented experience includes this summary: ${sentenceFragment(summary)}` : "";
}

function buildAccomplishmentParagraph(accomplishments) {
  if (!accomplishments.length) {
    return "";
  }

  return `Some of the evidence I would emphasize includes ${formatList(accomplishments.map(listFragment))}.`;
}

function buildSkillsParagraph(skills, tools) {
  const parts = [];

  if (skills.length) {
    parts.push(`skills in ${formatList(skills)}`);
  }

  if (tools.length) {
    parts.push(`hands-on work with ${formatList(tools)}`);
  }

  if (!parts.length) {
    return "";
  }

  return `I also bring ${parts.join(" and ")}. I try to pair practical execution with a warm, clear communication style so the work is easier for others to trust and use.`;
}

function buildClosing(person = {}) {
  const name = String(person.name || "").trim();
  return {
    paragraph: "Thank you for considering my application. I would appreciate the opportunity to talk about how my experience could support the work ahead.",
    signature: name || "Your Name",
  };
}

function prioritizeValues(signals = []) {
  const prioritized = prioritizeSignals(signals);
  const matched = prioritized.filter((signal) => signal.score > 0);
  const unmatched = prioritized.filter((signal) => signal.score === 0);

  return [...matched, ...unmatched].map((signal) => signal.value);
}

function prioritizeRoles(roles = [], signals = []) {
  return prioritizeSignals(signals).map((signal) => roles[signal.index]).filter(Boolean);
}

function prioritizeSignals(signals = []) {
  return [...signals].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.index - b.index;
  });
}

function formatRole(role = {}) {
  const title = String(role.title || "").trim();
  const company = String(role.company || "").trim();

  if (title && company) {
    return `${title} at ${company}`;
  }

  return title || company;
}

function sentenceFragment(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function listFragment(value) {
  return String(value || "")
    .trim()
    .replace(/[.!?]+$/g, "");
}

function formatList(items = []) {
  const cleanItems = items.map((item) => String(item || "").trim()).filter(Boolean);

  if (cleanItems.length <= 1) {
    return cleanItems[0] || "";
  }

  if (cleanItems.length === 2) {
    return `${cleanItems[0]} and ${cleanItems[1]}`;
  }

  return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems[cleanItems.length - 1]}`;
}

function genericJobDescription() {
  return "The role values clear communication, leadership, operations, technology, collaboration, measurable outcomes, and thoughtful problem solving.";
}

window.RightForMeCoverLetterBuilder = {
  buildCoverLetter,
};
