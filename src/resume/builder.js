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
    accomplishments: careerVault.accomplishments || [],
  };
}

function buildSummary(careerVault) {
  const roleCount = careerVault.roles?.length || 0;
  const skillCount = careerVault.skills?.length || 0;

  if (roleCount === 0 && skillCount === 0) {
    return "Professional summary will be generated from the Career Vault.";
  }

  return `Professional with experience across ${roleCount} role(s), bringing strengths in ${careerVault.skills.slice(0, 5).join(", ") || "leadership, problem solving, and continuous improvement"}.`;
}

window.RightForMeResumeBuilder = {
  buildResume,
};