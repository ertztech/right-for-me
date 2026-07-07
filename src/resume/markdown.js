function renderResumeMarkdown(resume) {
  const lines = [];
  const person = resume.person || {};

  lines.push(`# ${person.name || "Your Name"}`);

  const contact = compactList([
    person.location,
    person.email,
    person.phone,
  ]);

  if (contact.length) {
    lines.push(contact.join(" | "));
  }

  addSection(lines, "Professional Summary", [
    resume.summary || "Professional summary will be generated from Professional Experience.",
  ]);

  const skills = compactList(resume.skills);
  const tools = compactList(resume.tools);
  if (skills.length || tools.length) {
    lines.push("");
    lines.push("## Skills & Tools");

    if (skills.length) {
      lines.push("");
      lines.push("### Core Skills");
      addBullets(lines, skills);
    }

    if (tools.length) {
      lines.push("");
      lines.push("### Tools & Platforms");
      addBullets(lines, tools);
    }
  }

  const experience = resume.experience || [];
  if (experience.length) {
    lines.push("");
    lines.push("## Professional Experience");

    experience.forEach((role) => {
      lines.push("");
      lines.push(`### ${formatRoleHeading(role)}`);

      const dates = compactList([role.start, role.end]).join(" - ");
      if (dates) {
        lines.push(`_${dates}_`);
      }

      if (role.summary) {
        lines.push("");
        lines.push(role.summary);
      }
    });
  }

  const accomplishments = compactList(resume.accomplishments);
  if (accomplishments.length) {
    lines.push("");
    lines.push("## Selected Accomplishments");
    addBullets(lines, accomplishments);
  }

  return lines.join("\n");
}

function addSection(lines, heading, contentLines) {
  const content = compactList(contentLines);
  if (!content.length) {
    return;
  }

  lines.push("");
  lines.push(`## ${heading}`);
  content.forEach((line) => lines.push(line));
}

function addBullets(lines, items) {
  compactList(items).forEach((item) => lines.push(`- ${item}`));
}

function compactList(items = []) {
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function formatRoleHeading(role = {}) {
  const title = role.title || "Role";
  const company = role.company || "Company";
  return `${title} | ${company}`;
}

window.RightForMeResumeMarkdown = {
  renderResumeMarkdown,
};
