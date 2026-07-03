function renderCoverLetterMarkdown(coverLetter) {
  const lines = [];
  const person = coverLetter.person || {};
  const contact = compactList([person.location, person.email, person.phone]);

  lines.push(`# ${person.name || "Your Name"} Cover Letter`);

  if (contact.length) {
    lines.push(contact.join(" | "));
  }

  lines.push("");
  lines.push(coverLetter.greeting || "Dear Hiring Team,");
  lines.push("");
  lines.push(coverLetter.opening);

  compactList(coverLetter.body).forEach((paragraph) => {
    lines.push("");
    lines.push(paragraph);
  });

  if (coverLetter.closing?.paragraph) {
    lines.push("");
    lines.push(coverLetter.closing.paragraph);
  }

  lines.push("");
  lines.push("Warmly,");
  lines.push(coverLetter.closing?.signature || person.name || "Your Name");

  return lines.join("\n");
}

function compactList(items = []) {
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

window.RightForMeCoverLetterRenderer = {
  renderCoverLetterMarkdown,
};
