function initializeTailoringController() {
  const tailorButton = document.querySelector("#generate-tailored-resume");
  const jobDescription = document.querySelector("#job-description");
  const resumePreview = document.querySelector("#resume-preview");
  const resumeStatus = document.querySelector("#resume-status");

  function setStatus(message) {
    if (resumeStatus) {
      resumeStatus.textContent = message;
    }
  }

  function generateTailoredResume() {
    RightForMeCareerVault.saveVault();

    if (!jobDescription.value.trim()) {
      setStatus("Paste a job description before tailoring.");
      jobDescription.focus();
      return "";
    }

    const vault = RightForMeCareerVault.getVault();
    const relevanceSignals = RightForMeTailoringMatcher.matchCareerVault(
      jobDescription.value,
      vault
    );
    const resume = RightForMeTailoredResume.buildTailoredResume(
      vault,
      relevanceSignals
    );
    const markdown = RightForMeResumeMarkdown.renderResumeMarkdown(resume);

    resumePreview.value = markdown;
    setStatus("Tailored resume generated.");

    return markdown;
  }

  tailorButton.addEventListener("click", generateTailoredResume);
}

window.RightForMeTailoringController = {
  initializeTailoringController,
};
