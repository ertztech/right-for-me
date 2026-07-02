function renderResumeMarkdown(resume) {
  const lines = [];

  lines.push(`# ${resume.person.name || "Your Name"}`);

  const contact = [
    resume.person.location,
    resume.person.email,
    resume.person.phone,
  ].filter(Boolean);

  if (contact.length) {
    lines.push(contact.join(" | "));
  }

  lines.push("");
  lines.push("## Professional Summary");
  lines.push(resume.summary || "Professional summary will be generated from the Career Vault.");

  if (resume.skills.length) {
    lines.push("");
    lines.push("## Skills");
    lines.push(resume.skills.map((skill) => `- ${skill}`).join("\n"));
  }

  if (resume.tools.length) {
    lines.push("");
    lines.push("## Tools");
    lines.push(resume.tools.map((tool) => `- ${tool}`).join("\n"));
  }

  if (resume.experience.length) {
    lines.push("");
    lines.push("## Professional Experience");

    resume.experience.forEach((role) => {
      lines.push("");
      lines.push(`### ${role.title || "Role"} | ${role.company || "Company"}`);

      const dates = [role.start, role.end].filter(Boolean).join(" - ");
      if (dates) {
        lines.push(dates);
      }

      if (role.summary) {
        lines.push("");
        lines.push(role.summary);
      }
    });
  }

  if (resume.accomplishments.length) {
    lines.push("");
    lines.push("## Selected Accomplishments");
    lines.push(resume.accomplishments.map((item) => `- ${item}`).join("\n"));
  }

  return lines.join("\n");
}

window.RightForMeResumeMarkdown = {
  renderResumeMarkdown,
};