function renderApplicationNotesMarkdown(notes) {
  const lines = ["# Application Notes"];

  addApplicationNotesSection(lines, "Strongest Matching Skills", notes.strongestSkills);
  addApplicationNotesSection(lines, "Strongest Matching Tools", notes.strongestTools);
  addApplicationNotesSection(lines, "Suggested Resume Emphasis", notes.resumeEmphasis);
  addApplicationNotesSection(lines, "Possible Gaps to Prepare For", notes.possibleGaps);

  return lines.join("\n");
}

function addApplicationNotesSection(lines, heading, items = []) {
  const content = compactApplicationNotesList(items);
  if (!content.length) {
    return;
  }

  lines.push("");
  lines.push(`## ${heading}`);
  content.forEach((item) => lines.push(`- ${item}`));
}

function compactApplicationNotesList(items = []) {
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

window.RightForMeApplicationPacketRenderer = {
  renderApplicationNotesMarkdown,
};
