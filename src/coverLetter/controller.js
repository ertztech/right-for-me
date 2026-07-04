function initializeCoverLetterController() {
  const generateButton = document.querySelector("#generate-cover-letter");
  const copyButton = document.querySelector("#copy-cover-letter");
  const downloadButton = document.querySelector("#download-cover-letter");
  const jobDescription = document.querySelector("#job-description");
  const preview = document.querySelector("#cover-letter-preview");
  const status = document.querySelector("#cover-letter-status");

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function generateCoverLetterMarkdown() {
    const feedback = NextMoveActionFeedback.createActionFeedback({
      button: generateButton,
      statusNode: status,
      workingText: "Generating...",
      successText: "Cover letter generated.",
      failureText: "Cover letter could not be generated.",
    });

    feedback.run(() => {
      const markdown = generateCoverLetterMarkdownNow();
      return {
        markdown,
        message: jobDescription.value.trim() ? "Cover letter generated." : "Generic cover letter generated.",
      };
    });
  }

  function generateCoverLetterMarkdownNow() {
    RightForMeCareerVault.saveVault();

    const coverLetter = RightForMeCoverLetterBuilder.buildCoverLetter(
      RightForMeCareerVault.getVault(),
      jobDescription.value
    );
    const markdown = RightForMeCoverLetterRenderer.renderCoverLetterMarkdown(coverLetter);

    preview.value = markdown;
    setStatus(jobDescription.value.trim() ? "Cover letter generated." : "Generic cover letter generated.");

    return markdown;
  }

  function currentOrGeneratedMarkdown() {
    return preview.value.trim() ? preview.value : generateCoverLetterMarkdownNow();
  }

  async function copyCoverLetter() {
    const markdown = currentOrGeneratedMarkdown();

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown);
    } else {
      preview.focus();
      preview.select();
      document.execCommand("copy");
    }

    setStatus("Cover letter copied.");
  }

  function downloadCoverLetter() {
    const markdown = currentOrGeneratedMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = coverLetterFilename();
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setStatus("Cover letter downloaded.");
  }

  function coverLetterFilename() {
    const personName = RightForMeCareerVault.getVault().person?.name || "";
    const slug = personName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    return `${slug || "rightforme"}_cover_letter.md`;
  }

  generateButton.addEventListener("click", generateCoverLetterMarkdown);
  copyButton.addEventListener("click", () => {
    copyCoverLetter().catch(() => setStatus("Cover letter could not be copied."));
  });
  downloadButton.addEventListener("click", downloadCoverLetter);
}

window.RightForMeCoverLetterController = {
  initializeCoverLetterController,
};
