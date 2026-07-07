function initializeApplicationPacketController() {
  const generateButton = document.querySelector("#generate-application-packet");
  const copyNotesButton = document.querySelector("#copy-application-notes");
  const downloadNotesButton = document.querySelector("#download-application-notes");
  const jobDescription = document.querySelector("#job-description");
  const resumePreview = document.querySelector("#resume-preview");
  const coverLetterPreview = document.querySelector("#cover-letter-preview");
  const notesPreview = document.querySelector("#application-notes-preview");
  const status = document.querySelector("#application-packet-status");

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function generateApplicationPacket() {
    const feedback = NextMoveActionFeedback.createActionFeedback({
      button: generateButton,
      statusNode: status,
      workingText: "Generating...",
      successText: "Application packet generated.",
      failureText: "Application packet could not be generated.",
    });

    return feedback.run(() => ({
      ...generateApplicationPacketNow(),
      message: "Application packet generated.",
    }));
  }

  function generateApplicationPacketNow() {
    RightForMeCareerVault.saveVault();

    const packet = RightForMeApplicationPacketBuilder.buildApplicationPacket(
      RightForMeCareerVault.getVault(),
      jobDescription.value
    );
    const resumeMarkdown = RightForMeResumeMarkdown.renderResumeMarkdown(
      packet.tailoredResume
    );
    const coverLetterMarkdown = RightForMeCoverLetterRenderer.renderCoverLetterMarkdown(
      packet.coverLetter
    );
    const notesMarkdown = RightForMeApplicationPacketRenderer.renderApplicationNotesMarkdown(
      packet.applicationNotes
    );

    resumePreview.value = resumeMarkdown;
    coverLetterPreview.value = coverLetterMarkdown;
    notesPreview.value = notesMarkdown;
    setStatus("Application packet generated.");

    return {
      resumeMarkdown,
      coverLetterMarkdown,
      notesMarkdown,
    };
  }

  function currentOrGeneratedNotes() {
    return notesPreview.value.trim()
      ? notesPreview.value
      : generateApplicationPacketNow().notesMarkdown;
  }

  async function copyApplicationNotes() {
    const markdown = currentOrGeneratedNotes();

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown);
    } else {
      notesPreview.focus();
      notesPreview.select();
      document.execCommand("copy");
    }

    setStatus("Application notes copied.");
  }

  function downloadApplicationNotes() {
    const markdown = currentOrGeneratedNotes();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = applicationNotesFilename();
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setStatus("Application notes downloaded.");
  }

  function applicationNotesFilename() {
    const personName = RightForMeCareerVault.getVault().person?.name || "";
    const slug = personName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    return `${slug || "rightforme"}_application_notes.md`;
  }

  generateButton.addEventListener("click", generateApplicationPacket);
  copyNotesButton.addEventListener("click", () => {
    copyApplicationNotes().catch(() => setStatus("Application notes could not be copied."));
  });
  downloadNotesButton.addEventListener("click", downloadApplicationNotes);
}

window.RightForMeApplicationPacketController = {
  initializeApplicationPacketController,
};
