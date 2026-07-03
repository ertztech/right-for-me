function initializeResumeController() {
  const generateResumeButton = document.querySelector("#generate-resume");
  const copyResumeButton = document.querySelector("#copy-resume");
  const downloadResumeButton = document.querySelector("#download-resume");
  const resumePreview = document.querySelector("#resume-preview");
  const resumeStatus = document.querySelector("#resume-status");

  function setStatus(message) {
    if (resumeStatus) {
      resumeStatus.textContent = message;
    }
  }

  function generateResumeMarkdown() {
    RightForMeCareerVault.saveVault();

    const resume = RightForMeResumeBuilder.buildResume(
      RightForMeCareerVault.getVault()
    );
    const markdown = RightForMeResumeMarkdown.renderResumeMarkdown(resume);

    resumePreview.value = markdown;
    setStatus("Resume generated.");

    return markdown;
  }

  function currentOrGeneratedMarkdown() {
    return resumePreview.value.trim()
      ? resumePreview.value
      : generateResumeMarkdown();
  }

  async function copyResume() {
    const markdown = currentOrGeneratedMarkdown();

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown);
    } else {
      resumePreview.focus();
      resumePreview.select();
      document.execCommand("copy");
    }

    setStatus("Resume copied.");
  }

  function downloadResume() {
    const markdown = currentOrGeneratedMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = resumeFilename();
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setStatus("Markdown downloaded.");
  }

  function resumeFilename() {
    const personName = RightForMeCareerVault.getVault().person?.name || "";
    const slug = personName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    return `${slug || "rightforme"}_resume.md`;
  }

  generateResumeButton.addEventListener("click", generateResumeMarkdown);
  copyResumeButton.addEventListener("click", () => {
    copyResume().catch(() => setStatus("Resume could not be copied."));
  });
  downloadResumeButton.addEventListener("click", downloadResume);
}

window.RightForMeResumeController = {
  initializeResumeController,
};
