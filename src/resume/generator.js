(function attachResumeGenerator(root) {
  function generateResumeDraft({ job = {}, careerVault = {}, backgroundNotes = "" } = {}) {
    const jobText = buildJobText(job);
    const resume = buildResumeForJob(careerVault, jobText);
    const markdownContent = RightForMeResumeMarkdown.renderResumeMarkdown(resume);
    const tailoredSkills = uniqueCleanList([...(resume.skills || []), ...(resume.tools || [])]).slice(0, 12);
    const tailoredExperienceBullets = buildExperienceBullets(resume, job);

    return {
      tailoredSummary: resume.summary || "",
      tailoredSkills,
      tailoredExperienceBullets,
      markdownContent,
      markdownPreview: markdownContent,
      generatedAt: new Date().toISOString(),
      promptVersion: "resume-generation-mvp-local-v1",
      modelName: "local-deterministic",
      userApproved: false,
      sourceContext: {
        company: job.company || "",
        roleTitle: job.roleTitle || "",
        fitRecommendation: job.fitAnalysis?.recommendation || job.fitRecommendation || "",
        backgroundNotesUsed: Boolean(String(backgroundNotes || "").trim()),
      },
    };
  }

  function buildResumeForJob(careerVault, jobText) {
    if (jobText && root.RightForMeTailoringMatcher && root.RightForMeTailoredResume) {
      const signals = RightForMeTailoringMatcher.matchCareerVault(jobText, careerVault);
      return RightForMeTailoredResume.buildTailoredResume(careerVault, signals);
    }

    return RightForMeResumeBuilder.buildResume(careerVault);
  }

  function buildJobText(job = {}) {
    return [
      job.roleTitle,
      job.company,
      job.location,
      job.salaryRange,
      job.workArrangement,
      job.yearsExperience,
      lines(job.responsibilities),
      lines(job.requiredSkills),
      lines(job.preferredSkills),
      lines(job.technologies),
      lines(job.leadershipExpectations),
      lines(job.certifications),
      job.fitAnalysis?.suggestedPositioning,
      lines(job.fitAnalysis?.strengths),
      lines(job.fitAnalysis?.gaps),
      lines(job.fitAnalysis?.concerns),
      job.notes,
      job.sourcePostingText,
    ].filter(Boolean).join("\n");
  }

  function buildExperienceBullets(resume, job) {
    const bullets = [];
    const fitStrengths = uniqueCleanList(job.fitAnalysis?.strengths || []);
    const accomplishments = uniqueCleanList(resume.accomplishments || []);
    const roles = resume.experience || [];

    fitStrengths.slice(0, 3).forEach((item) => {
      bullets.push(`Emphasize fit evidence: ${trimSentence(item)}`);
    });

    accomplishments.slice(0, 4).forEach((item) => {
      bullets.push(trimSentence(item));
    });

    roles.slice(0, 3).forEach((role) => {
      if (role.summary) {
        bullets.push(trimSentence(role.summary));
      } else if (role.title || role.company) {
        bullets.push(`Documented experience as ${[role.title, role.company].filter(Boolean).join(" at ")}.`);
      }
    });

    if (!bullets.length) {
      bullets.push("Add specific accomplishments to Professional Experience to strengthen this resume draft.");
    }

    return uniqueCleanList(bullets).slice(0, 8);
  }

  function lines(value) {
    return Array.isArray(value) ? value.filter(Boolean).join("\n") : String(value || "");
  }

  function uniqueCleanList(items = []) {
    return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
  }

  function trimSentence(value) {
    const text = String(value || "").trim();
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }

  const api = {
    generateResumeDraft,
    buildJobText,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.NextMoveResumeGenerator = api;
})(typeof window !== "undefined" ? window : globalThis);
