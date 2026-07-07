const JOB_STATUSES = [
  "Found",
  "Reviewing",
  "Apply",
  "Maybe",
  "Skip",
  "Applied",
  "Interviewing",
  "Rejected",
  "Offer",
  "Closed",
];

const DASHBOARD_STATUSES = [
  "Found",
  "Reviewing",
  "Apply",
  "Maybe",
  "Skip",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];
const JOBS_FIT_RECOMMENDATIONS = ["Apply", "Maybe", "Skip"];

let selectedJobId = "";

function initializeJobsAppliedController() {
  const addJobForm = document.querySelector("#add-job-form");

  addJobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveJobFromForm(addJobForm);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-job-detail-form]");
    if (!form) {
      return;
    }

    event.preventDefault();
    saveJobDetailUpdates(form);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-fit-review-form]");
    if (!form) {
      return;
    }

    event.preventDefault();
    saveFitReviewUpdates(form);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-resume-draft-form]");
    if (!form) {
      return;
    }

    event.preventDefault();
    saveResumeDraftUpdates(form);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-cover-letter-draft-form]");
    if (!form) {
      return;
    }

    event.preventDefault();
    saveCoverLetterDraftUpdates(form);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-packet-notes-form]");
    if (!form) {
      return;
    }

    event.preventDefault();
    savePacketNotesUpdates(form);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-job-intelligence-form]");
    if (!form) {
      return;
    }

    event.preventDefault();
    saveJobIntelligenceUpdates(form);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-extract-job-intelligence]");
    if (!button) {
      return;
    }

    extractJobIntelligenceForForm(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-opportunity]");
    if (!button) {
      return;
    }

    reviewOpportunityWithAIForForm(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-saved-opportunity]");
    if (!button) {
      return;
    }

    reviewSavedOpportunityWithAI(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-generate-resume-draft]");
    if (!button) {
      return;
    }

    generateResumeDraftForJob(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-generate-cover-letter-draft]");
    if (!button) {
      return;
    }

    generateCoverLetterDraftForJob(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy-packet-draft]");
    if (!button) {
      return;
    }

    copyPacketDraft(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-load-demo-data]");
    if (!button) {
      return;
    }

    loadDemoData(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-clear-demo-data]");
    if (!button) {
      return;
    }

    clearDemoData(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prefill-fit-review]");
    if (!button) {
      return;
    }

    prefillFitReviewForForm(button);
  });

  document.addEventListener("change", (event) => {
    const control = event.target.closest("[data-tracker-status]");
    if (!control) {
      return;
    }

    saveTrackerStatus(control);
  });

  document.addEventListener("change", (event) => {
    const control = event.target.closest("[data-packet-checklist]");
    if (!control) {
      return;
    }

    savePacketChecklistToggle(control);
  });

  window.addEventListener("hashchange", handleJobsRouteChange);
  ensureJobsRoute();
  handleJobsRouteChange();
}

function saveJobFromForm(form) {
  const formData = new FormData(form);
  const record = {
    id: createJobId(),
    company: cleanValue(formData.get("company")),
    roleTitle: cleanValue(formData.get("roleTitle")),
    jobUrl: cleanValue(formData.get("jobUrl")),
    location: cleanValue(formData.get("location")),
    salaryRange: cleanValue(formData.get("salaryRange")),
    workArrangement: cleanValue(formData.get("workArrangement")),
    status: cleanValue(formData.get("status")) || "Found",
    fitScore: "",
    fitRecommendation: "",
    dateFound: new Date().toISOString().slice(0, 10),
    dateApplied: "",
    followUpDate: "",
    resumeVersionPath: "",
    coverLetterPath: "",
    notes: cleanValue(formData.get("notes")),
    responsibilities: linesFromText(formData.get("responsibilities")),
    requiredSkills: linesFromText(formData.get("requiredSkills")),
    preferredSkills: linesFromText(formData.get("preferredSkills")),
    technologies: linesFromText(formData.get("technologies")),
    leadershipExpectations: linesFromText(formData.get("leadershipExpectations")),
    certifications: linesFromText(formData.get("certifications")),
    yearsExperience: cleanValue(formData.get("yearsExperience")),
    sourcePostingText: cleanValue(formData.get("sourcePostingText")),
    fitAnalysis: null,
    resumeDraft: null,
    coverLetterDraft: null,
  };

  try {
    RightForMeJobsAppliedStorage.addJobApplication(record);
    selectedJobId = record.id;
    form.reset();
    setJobsStatus("Opportunity saved. Workspace opened so you can analyze fit and generate drafts.", "success");
    navigateToJobsRoute("studio", record.id);
  } catch (error) {
    setJobsStatus(error.message || "Job could not be saved.", "failure");
  }
}

function saveJobIntelligenceUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.jobIntelligenceForm;
  const updates = {
    company: cleanValue(formData.get("company")),
    roleTitle: cleanValue(formData.get("roleTitle")),
    jobUrl: cleanValue(formData.get("jobUrl")),
    location: cleanValue(formData.get("location")),
    salaryRange: cleanValue(formData.get("salaryRange")),
    workArrangement: cleanValue(formData.get("workArrangement")),
    responsibilities: linesFromText(formData.get("responsibilities")),
    requiredSkills: linesFromText(formData.get("requiredSkills")),
    preferredSkills: linesFromText(formData.get("preferredSkills")),
    technologies: linesFromText(formData.get("technologies")),
    leadershipExpectations: linesFromText(formData.get("leadershipExpectations")),
    certifications: linesFromText(formData.get("certifications")),
    yearsExperience: cleanValue(formData.get("yearsExperience")),
    notes: cleanValue(formData.get("notes")),
    sourcePostingText: cleanValue(formData.get("sourcePostingText")),
  };

  if (!updates.company || !updates.roleTitle) {
    setJobsStatus("Company and role title are required before saving Opportunity Intelligence.", "failure");
    return;
  }

  saveJobDraft(jobId, updates, "Opportunity Intelligence saved. NextMove refreshed the review workspace.");
}

function extractJobIntelligenceForForm(button) {
  const form = button.closest("[data-job-intelligence-form]");
  if (!form) {
    return;
  }

  const sourceText = cleanValue(form.elements.sourcePostingText?.value);
  if (!sourceText) {
    setJobsStatus("Paste the source posting text before extracting Job Intelligence.", "failure");
    return;
  }

  const existing = jobIntelligenceValuesFromForm(form);
  const extracted = RightForMeJobIntelligenceExtractor.extractJobIntelligence(sourceText);
  const updates = RightForMeJobIntelligenceExtractor.mergeExtractedJobIntelligence(existing, extracted);

  if (!Object.keys(updates).length) {
    setJobsStatus("No blank Job Intelligence fields were filled. Existing edits were preserved.", "idle");
    return;
  }

  applyJobIntelligenceValuesToForm(form, updates);
  saveJobDraft(
    form.dataset.jobIntelligenceForm,
    jobIntelligenceValuesFromForm(form),
    `Extraction complete. Filled ${Object.keys(updates).length} blank field(s); existing edits were preserved.`
  );
}

async function reviewOpportunityWithAIForForm(button) {
  const form = button.closest("[data-job-intelligence-form]");
  if (!form) {
    return;
  }

  const jobId = form.dataset.jobIntelligenceForm;
  const sourcePostingText = cleanValue(form.elements.sourcePostingText?.value);
  if (!sourcePostingText) {
    setJobsStatus("Paste the source posting text before reviewing this opportunity.", "failure");
    return;
  }

  const savedJob = findJobById(jobId);
  if (!savedJob) {
    setJobsStatus("Save the opportunity before reviewing it.", "failure");
    return;
  }

  const jobRecord = {
    ...savedJob,
    ...jobIntelligenceValuesFromForm(form),
  };
  const feedback = createJobsActionFeedback(button, {
    workingText: "Reviewing...",
    successText: "Opportunity review saved.",
    failureText: "Opportunity review could not be completed.",
  });

  await feedback.run(async () => {
    const response = await fetch("/api/review-opportunity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job: jobRecord,
        profile: readCareerVaultProfile(),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    window.dispatchEvent(new CustomEvent("nextmove:ai-debug-updated"));

    if (!response.ok) {
      throw new Error(payload.error || "Opportunity review could not be completed.");
    }

    const analysis = RightForMeAIJobAnalysis.validateAIJobAnalysis(payload.analysis || {});
    // Merge strategy: AI fills only blank fields so user-entered edits remain the source of truth.
    const updates = RightForMeAIJobAnalysis.mergeAIJobAnalysis(savedJob, analysis);

    if (!Object.keys(updates).length) {
      return { message: "Opportunity review returned valid data, but no blank fields needed updates." };
    }

    RightForMeJobsAppliedStorage.updateJobApplication(jobId, updates);
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    return { message: "Opportunity review saved." };
  }).then((result) => {
    if (result?.error instanceof TypeError) {
      setJobsStatus(
        "Opportunity review could not reach the local backend. Run node server.js and open the app from http://localhost:4173.",
        "failure"
      );
    }
  });
}

async function reviewSavedOpportunityWithAI(button) {
  const jobId = button.dataset.reviewSavedOpportunity || selectedJobId;
  const savedJob = findJobById(jobId);
  if (!savedJob) {
    setJobsStatus("Select or save an opportunity before analyzing fit.", "failure");
    return;
  }

  if (!cleanValue(savedJob.sourcePostingText)) {
    setJobsStatus("Add the saved job description before analyzing fit.", "failure");
    return;
  }

  const feedback = createJobsActionFeedback(button, {
    workingText: "Analyzing...",
    successText: "Fit analysis saved.",
    failureText: "Fit analysis could not be completed.",
  });

  await feedback.run(async () => {
    const response = await fetch("/api/review-opportunity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job: savedJob,
        profile: readCareerVaultProfile(),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    window.dispatchEvent(new CustomEvent("nextmove:ai-debug-updated"));

    if (!response.ok) {
      throw new Error(payload.error || "Fit analysis could not be completed.");
    }

    const analysis = RightForMeAIJobAnalysis.validateAIJobAnalysis(payload.analysis || {});
    const updates = RightForMeAIJobAnalysis.mergeAIJobAnalysis(savedJob, analysis);

    if (!Object.keys(updates).length) {
      return { message: "Fit analysis returned valid data, but this opportunity already had matching saved outputs." };
    }

    RightForMeJobsAppliedStorage.updateJobApplication(savedJob.id, updates);
    selectedJobId = savedJob.id;
    refreshJobsAppliedViews();
    return { message: "Fit analysis saved to this opportunity." };
  }).then((result) => {
    if (result?.error instanceof TypeError) {
      setJobsStatus(
        "Fit analysis could not reach the local backend. Run node server.js and open the app from http://localhost:4173.",
        "failure"
      );
    }
  });
}

async function generateResumeDraftForJob(button) {
  const jobId = button.dataset.generateResumeDraft || selectedJobId;
  const feedback = createJobsActionFeedback(button, {
    workingText: "Generating...",
    successText: "Resume generated and saved.",
    failureText: "Resume could not be generated.",
  });

  return feedback.run(async () => {
    const result = generateResumeForJob(jobId);
    return {
      ...result,
      message: "Resume generated and saved.",
    };
  });
}

async function generateCoverLetterDraftForJob(button) {
  const jobId = button.dataset.generateCoverLetterDraft || selectedJobId;
  const feedback = createJobsActionFeedback(button, {
    workingText: "Generating...",
    successText: "Cover letter generated and saved.",
    failureText: "Cover letter could not be generated.",
  });

  return feedback.run(async () => {
    const result = generateCoverLetterForJob(jobId);
    return {
      ...result,
      message: "Cover letter generated and saved.",
    };
  });
}

async function copyPacketDraft(button) {
  const job = findJobById(button.dataset.jobId || selectedJobId);
  if (!job) {
    setJobsStatus("Select an opportunity before copying packet content.", "failure");
    return;
  }

  const draftType = button.dataset.copyPacketDraft;
  const text = draftType === "cover-letter" ? coverLetterDraftText(job) : resumeDraftText(job);
  const label = draftType === "cover-letter" ? "Cover letter draft" : "Resume draft";

  if (!text) {
    setJobsStatus(`${label} is empty. Generate or save draft content first.`, "failure");
    return;
  }

  try {
    await copyTextToClipboard(text);
    setJobsStatus(`${label} copied.`, "success");
  } catch {
    setJobsStatus(`${label} could not be copied. Select the text and copy manually.`, "failure");
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back for browser contexts where Clipboard API exists but write permission is denied.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function generateResumeForJob(jobId = selectedJobId) {
  const job = findJobById(jobId);
  if (!job) {
    throw new Error("Select or save an opportunity before generating a resume.");
  }

  RightForMeCareerVault.saveVault();
  if (!hasCareerVaultBaseData(RightForMeCareerVault.getVault())) {
    throw new Error("Add your base resume or Professional Experience details before generating a tailored resume.");
  }

  const resumeDraft = NextMoveResumeGenerator.generateResumeDraft({
    job,
    careerVault: RightForMeCareerVault.getVault(),
    backgroundNotes: document.querySelector("#candidate-background")?.value || "",
  });
  const updatedJob = RightForMeJobsAppliedStorage.updateJobApplication(job.id, {
    resumeDraft: {
      ...(job.resumeDraft || {}),
      ...resumeDraft,
      userApproved: job.resumeDraft?.userApproved || false,
    },
  });
  const resumePreview = document.querySelector("#resume-preview");

  if (resumePreview) {
    resumePreview.value = resumeDraft.markdownContent;
  }

  selectedJobId = job.id;
  refreshJobsAppliedViews();

  return {
    job: updatedJob,
    markdown: resumeDraft.markdownContent,
    resumeDraft,
  };
}

function generateCoverLetterForJob(jobId = selectedJobId) {
  const job = findJobById(jobId);
  if (!job) {
    throw new Error("Select or save an opportunity before generating a cover letter.");
  }

  if (!cleanValue(job.sourcePostingText) && !hasJobIntelligence(job)) {
    throw new Error("Add the saved job description before generating a cover letter.");
  }

  RightForMeCareerVault.saveVault();
  const careerVault = RightForMeCareerVault.getVault();
  if (!hasCareerVaultBaseData(careerVault)) {
    throw new Error("Add your base resume or Professional Experience details before generating a cover letter.");
  }

  if (!window.RightForMeCoverLetterBuilder || !window.RightForMeCoverLetterRenderer) {
    throw new Error("Cover letter generation is not available yet. You can still paste and save a draft in this workspace.");
  }

  const coverLetter = RightForMeCoverLetterBuilder.buildCoverLetter(
    careerVault,
    NextMoveResumeGenerator.buildJobText(job)
  );
  const markdown = RightForMeCoverLetterRenderer.renderCoverLetterMarkdown(coverLetter);
  const updatedJob = RightForMeJobsAppliedStorage.updateJobApplication(job.id, {
    coverLetterDraft: {
      ...(job.coverLetterDraft || {}),
      coverLetterContent: markdown,
      draftText: markdown,
      toneNote: job.coverLetterDraft?.toneNote || "Warm, friendly, confident, and human.",
      generatedAt: new Date().toISOString(),
      promptVersion: "cover-letter-generation-mvp-local-v1",
      modelName: "local-deterministic",
      userApproved: job.coverLetterDraft?.userApproved || false,
    },
  });

  selectedJobId = job.id;
  refreshJobsAppliedViews();

  return {
    job: updatedJob,
    markdown,
  };
}

function hasCareerVaultBaseData(vault = {}) {
  return Boolean(
    cleanValue(vault.person?.name)
    || (Array.isArray(vault.roles) && vault.roles.length)
    || (Array.isArray(vault.skills) && vault.skills.length)
    || (Array.isArray(vault.tools) && vault.tools.length)
    || (Array.isArray(vault.accomplishments) && vault.accomplishments.length)
  );
}

async function loadDemoData(button) {
  const feedback = createJobsActionFeedback(button, {
    workingText: "Loading...",
    successText: "Sample data loaded.",
    failureText: "Sample data could not be loaded.",
  });

  return feedback.run(async () => {
    if (hasUserData() && !window.confirm("Load sample data alongside your existing data? Existing real records will be preserved.")) {
      return { message: "Sample data load canceled." };
    }

    const result = NextMoveDemoDataSeeder.loadSampleData();
    selectedJobId = "demo-job-operations-transformation-lead";
    refreshJobsAppliedViews();
    updateSelectedJobLinks();

    return {
      ...result,
      message: `Loaded ${result.jobsAdded} sample jobs.${result.vaultSeeded ? " Demo Professional Experience profile added." : " Existing Professional Experience preserved."}`,
    };
  });
}

async function clearDemoData(button) {
  const feedback = createJobsActionFeedback(button, {
    workingText: "Clearing...",
    successText: "Demo data cleared.",
    failureText: "Demo data could not be cleared.",
  });

  return feedback.run(async () => {
    const result = NextMoveDemoDataSeeder.clearDemoData();
    const jobs = RightForMeJobsAppliedStorage.getJobApplications();
    selectedJobId = jobs[0]?.id || "";
    refreshJobsAppliedViews();
    updateSelectedJobLinks();

    return {
      ...result,
      message: `Cleared ${result.jobsRemoved} demo jobs.${result.vaultCleared ? " Demo Professional Experience profile cleared." : " Real Professional Experience preserved."}`,
    };
  });
}

function hasUserData() {
  const realJobs = RightForMeJobsAppliedStorage
    .getJobApplications()
    .some((job) => !NextMoveDemoDataSeeder.isDemoRecord(job));
  const vault = RightForMeCareerVault.getVault();
  const hasVaultData = Boolean(
    String(vault.person?.name || "").trim()
    || (vault.roles || []).length
    || (vault.skills || []).length
    || (vault.tools || []).length
    || (vault.accomplishments || []).length
  );

  return realJobs || (hasVaultData && !NextMoveDemoDataSeeder.isDemoRecord(vault));
}

function selectedJob() {
  return selectedJobId ? findJobById(selectedJobId) : null;
}

function createJobsActionFeedback(button, messages) {
  return NextMoveActionFeedback.createActionFeedback({
    button,
    statusNode: document.querySelector("#jobs-applied-status"),
    ...messages,
  });
}

function saveJobDetailUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.jobDetailForm;
  const updates = {
    status: cleanValue(formData.get("status")),
    dateApplied: cleanValue(formData.get("dateApplied")),
    followUpDate: cleanValue(formData.get("followUpDate")),
    notes: cleanValue(formData.get("notes")),
  };

  if (!isValidJobStatus(updates.status)) {
    setJobsStatus("Choose a valid job status before saving.", "failure");
    return;
  }

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, updates);
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Job details saved. Your dashboard is up to date.", "success");
  } catch (error) {
    setJobsStatus(error.message || "Job details could not be saved.", "failure");
  }
}

function saveFitReviewUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.fitReviewForm;
  const score = cleanValue(formData.get("fitScore"));
  const recommendation = cleanValue(formData.get("fitRecommendation"));
  const validationError = validateFitReviewInput(score, recommendation);

  if (validationError) {
    setJobsStatus(validationError, "failure");
    return;
  }

  const job = RightForMeJobsAppliedStorage.getJobApplications().find((record) => record.id === jobId);
  const existingFitAnalysis = job?.fitAnalysis || {};
  const fitAnalysis = {
    ...existingFitAnalysis,
    fitScore: Number(score),
    recommendation,
    strengths: linesFromText(formData.get("strengths")),
    gaps: linesFromText(formData.get("gaps")),
    concerns: linesFromText(formData.get("concerns")),
    suggestedPositioning: cleanValue(formData.get("suggestedPositioning")),
    generatedAt: existingFitAnalysis.generatedAt || "",
    promptVersion: existingFitAnalysis.promptVersion || "fit-analysis-v1",
    modelName: existingFitAnalysis.modelName || "",
    userApproved: formData.get("userApproved") === "on",
  };

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, {
      fitScore: fitAnalysis.fitScore,
      fitRecommendation: fitAnalysis.recommendation,
      fitAnalysis,
    });
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Fit Review saved. NextMove updated the job detail and dashboard.", "success");
  } catch (error) {
    setJobsStatus(error.message || "Fit Review could not be saved.", "failure");
  }
}

function prefillFitReviewForForm(button) {
  const form = button.closest("[data-fit-review-form]");
  if (!form) {
    return;
  }

  const jobId = form.dataset.fitReviewForm;
  const job = findJobById(jobId);
  if (!job) {
    setJobsStatus("Save an opportunity before prefilling Fit Review.", "failure");
    return;
  }

  const existing = fitReviewValuesFromForm(form);
  const prefill = RightForMeFitReviewPrefill.generateFitReviewPrefill(job);
  const updates = RightForMeFitReviewPrefill.mergeFitReviewPrefill(existing, prefill);

  if (!Object.keys(updates).length) {
    setJobsStatus("No blank Fit Review fields were filled. Existing edits were preserved.", "idle");
    return;
  }

  applyFitReviewValuesToForm(form, updates);
  savePrefilledFitReview(form, prefill.promptVersion, prefill.modelName);
}

function savePrefilledFitReview(form, promptVersion, modelName) {
  const values = fitReviewValuesFromForm(form);
  const score = cleanValue(values.fitScore);
  const recommendation = cleanValue(values.recommendation);
  const validationError = validateFitReviewInput(score, recommendation);

  if (validationError) {
    setJobsStatus(validationError, "failure");
    return;
  }

  const jobId = form.dataset.fitReviewForm;
  const job = findJobById(jobId);
  const existingFitAnalysis = job?.fitAnalysis || {};
  const fitAnalysis = {
    ...existingFitAnalysis,
    fitScore: Number(score),
    recommendation,
    strengths: values.strengths,
    gaps: values.gaps,
    concerns: values.concerns,
    suggestedPositioning: values.suggestedPositioning,
    generatedAt: existingFitAnalysis.generatedAt || "",
    promptVersion: existingFitAnalysis.promptVersion || promptVersion,
    modelName: existingFitAnalysis.modelName || modelName,
    userApproved: values.userApproved,
  };

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, {
      fitScore: fitAnalysis.fitScore,
      fitRecommendation: fitAnalysis.recommendation,
      fitAnalysis,
    });
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Fit Review prefilled from Job Intelligence. Review before relying on it.", "success");
  } catch (error) {
    setJobsStatus(error.message || "Fit Review could not be prefilled.", "failure");
  }
}

function saveResumeDraftUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.resumeDraftForm;
  const job = findJobById(jobId);
  const existingDraft = job?.resumeDraft || {};
  const markdownContent = cleanValue(formData.get("markdownContent"));
  const resumeDraft = {
    ...existingDraft,
    tailoredSummary: cleanValue(formData.get("tailoredSummary")),
    tailoredSkills: linesFromText(formData.get("tailoredSkills")),
    tailoredExperienceBullets: linesFromText(formData.get("tailoredExperienceBullets")),
    markdownContent,
    markdownPreview: markdownContent,
    generatedAt: existingDraft.generatedAt || "",
    promptVersion: existingDraft.promptVersion || "tailored-resume-v1",
    modelName: existingDraft.modelName || "manual",
    userApproved: formData.get("userApproved") === "on",
  };

  saveJobDraft(jobId, { resumeDraft }, "Resume draft saved. NextMove updated the application packet.");
}

function saveCoverLetterDraftUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.coverLetterDraftForm;
  const job = findJobById(jobId);
  const existingDraft = job?.coverLetterDraft || {};
  const coverLetterContent = cleanValue(formData.get("coverLetterContent"));
  const coverLetterDraft = {
    ...existingDraft,
    coverLetterContent,
    draftText: coverLetterContent,
    toneNote: existingDraft.toneNote || "Warm, friendly, confident, and human.",
    generatedAt: existingDraft.generatedAt || "",
    promptVersion: existingDraft.promptVersion || "cover-letter-v1",
    modelName: existingDraft.modelName || "manual",
    userApproved: formData.get("userApproved") === "on",
  };

  saveJobDraft(jobId, { coverLetterDraft }, "Cover letter draft saved. NextMove updated the application packet.");
}

function savePacketNotesUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.packetNotesForm;
  saveJobDraft(
    jobId,
    { notes: cleanValue(formData.get("packetNotes")) },
    "Packet notes saved. NextMove updated the job detail and packet."
  );
}

function saveJobDraft(jobId, updates, successMessage) {
  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, updates);
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus(successMessage, "success");
  } catch (error) {
    setJobsStatus(error.message || "Changes could not be saved.", "failure");
  }
}

function saveTrackerStatus(control) {
  const jobId = control.dataset.trackerStatus;
  const status = cleanValue(control.value);

  if (!isValidJobStatus(status)) {
    setJobsStatus("Choose a valid job status before saving.", "failure");
    refreshJobsAppliedViews();
    return;
  }

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, { status });
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Status updated. NextMove refreshed your dashboard and tracker.", "success");
  } catch (error) {
    setJobsStatus(error.message || "Status could not be updated.", "failure");
    refreshJobsAppliedViews();
  }
}

function savePacketChecklistToggle(control) {
  const jobId = control.dataset.jobId;
  const field = control.dataset.packetChecklist;
  const allowedFields = ["resumeReviewed", "coverLetterReviewed", "applicationSubmitted", "followUpScheduled"];

  if (!jobId || !allowedFields.includes(field)) {
    setJobsStatus("Checklist item could not be saved.", "failure");
    refreshJobsAppliedViews();
    return;
  }

  const job = findJobById(jobId);
  if (!job) {
    setJobsStatus("Select an opportunity before updating checklist items.", "failure");
    refreshJobsAppliedViews();
    return;
  }

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, {
      packetChecklist: {
        ...(job.packetChecklist || {}),
        [field]: Boolean(control.checked),
      },
    });
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Readiness checklist updated.", "success");
  } catch (error) {
    setJobsStatus(error.message || "Checklist item could not be saved.", "failure");
    refreshJobsAppliedViews();
  }
}

function handleJobsRouteChange() {
  const route = currentJobsRoute();
  const jobs = RightForMeJobsAppliedStorage.getJobApplications();
  selectedJobId = route.jobId || selectedJobId || jobs[0]?.id || "";

  renderJobsAppliedViews(jobs);
  showJobsPage(route.page);
}

function refreshJobsAppliedViews() {
  const jobs = RightForMeJobsAppliedStorage.getJobApplications();
  renderJobsAppliedViews(jobs);
  updateSelectedJobLinks();
}

function showJobsPage(pageName) {
  document.querySelectorAll("[data-jobs-page]").forEach((page) => {
    page.classList.toggle("hidden", page.dataset.jobsPage !== pageName);
  });

  document.querySelectorAll("[data-jobs-route-link]").forEach((link) => {
    link.classList.toggle("active-nav", link.dataset.jobsRouteLink === pageName);
  });

  updateSelectedJobLinks();
  document.querySelector(`[data-jobs-page="${pageName}"]`)?.scrollIntoView({ block: "start" });
}

function renderJobsAppliedViews(jobs) {
  renderDashboard(jobs);
  renderOpportunityReview(currentJob(jobs));
  renderJobDetail(currentJob(jobs));
  renderFitAnalysis(currentJob(jobs));
  renderResumeBuilder(currentJob(jobs));
  renderCoverLetterBuilder(currentJob(jobs));
  renderApplicationPacket(currentJob(jobs));
  renderApplicationStudio(currentJob(jobs));
  renderTracker(jobs);
}

function renderDashboard(jobs) {
  renderDashboardSummary("#jobs-status-summary", jobs);
  renderJobCards("#recent-jobs-list", recentJobs(jobs));
  renderNextActions(jobs);
}

function renderJobDetail(job) {
  const node = document.querySelector("#job-detail-content");
  if (!job) {
    node.innerHTML = emptyMessage("No opportunity selected yet. Start with Opportunity Review to analyze a posting before building an application packet.");
    return;
  }

  node.innerHTML = `
    <dl class="detail-grid">
      ${detailRow("Company", job.company)}
      ${detailRow("Role", job.roleTitle)}
      ${detailRow("Status", job.status)}
      ${detailRow("Fit score", formatValue(job.fitScore))}
      ${detailRow("Recommendation", formatValue(job.fitRecommendation))}
      ${detailRow("Location", formatValue(job.location))}
      ${detailRow("Salary", formatValue(job.salaryRange))}
      ${detailRow("Work arrangement", formatValue(job.workArrangement))}
      ${detailRow("Resume path", formatValue(job.resumeVersionPath))}
      ${detailRow("Cover letter path", formatValue(job.coverLetterPath))}
      ${detailRow("URL", job.jobUrl ? `<a href="${escapeAttribute(job.jobUrl)}">${escapeHtml(job.jobUrl)}</a>` : "Not saved yet", true)}
    </dl>
    ${jobIntelligenceSummaryBlock(job)}
    ${fitReviewSummaryBlock(job)}
    ${applicationPacketStatusBlock(job)}
    <div class="section-block">
      <h2>Status Controls</h2>
      <form class="input-panel flat-panel job-update-form" data-job-detail-form="${escapeAttribute(job.id)}">
        <div class="form-grid">
          <label>
            Status
            <select name="status">
              ${statusOptions(job.status)}
            </select>
          </label>
          <label>
            Date Applied
            <input name="dateApplied" type="date" value="${escapeAttribute(job.dateApplied || "")}">
          </label>
          <label>
            Follow-up Date
            <input name="followUpDate" type="date" value="${escapeAttribute(job.followUpDate || "")}">
          </label>
        </div>
        <label>
          Notes
          <textarea name="notes" rows="5">${escapeHtml(job.notes || "")}</textarea>
        </label>
        <button type="submit">Save Job Updates</button>
      </form>
    </div>
  `;

  updateSelectedJobLinks();
}

function renderOpportunityReview(job) {
  const node = document.querySelector("#opportunity-review-content");
  if (!node) {
    return;
  }

  if (!job) {
    node.innerHTML = emptyMessage("Save a posting to extract requirements, assess fit, and identify how to position your experience.");
    return;
  }

  node.innerHTML = `
    <div class="section-block">
      <div class="panel-header compact-header">
        <div>
          <h2>Opportunity Intelligence</h2>
          <p class="support-copy">Use this workspace to analyze the posting, capture key requirements, and decide whether the opportunity is worth pursuing.</p>
        </div>
        <a class="secondary-button nav-link-button" href="#/jobs/fit/${escapeAttribute(job.id)}" data-selected-job-route="fit">Open Fit Review</a>
      </div>
      ${jobIntelligenceForm(job)}
    </div>
    <div class="section-block">
      <h2>Fit Review</h2>
      ${fitReviewSummaryBlock(job)}
      <p class="empty-copy">${hasFitAnalysis(job) ? "Fit Review is saved for this opportunity." : "Fit Review is not saved yet. Use Apply, Maybe, or Skip once you have enough evidence."}</p>
    </div>
  `;
}

function renderFitAnalysis(job) {
  const node = document.querySelector("#fit-analysis-placeholder");
  if (!job) {
    node.innerHTML = emptyMessage("Fit Review will appear after an opportunity is saved. Start with Opportunity Review when you are ready.");
    return;
  }

  const fitAnalysis = job.fitAnalysis || {};

  node.innerHTML = `
    <div class="score-grid">
      <article><span>Fit Score</span><strong>${escapeHtml(formatValue(fitAnalysis.fitScore || job.fitScore))}</strong></article>
      <article><span>Recommendation</span><strong>${escapeHtml(formatValue(fitAnalysis.recommendation || job.fitRecommendation))}</strong></article>
      <article><span>Status</span><strong>${escapeHtml(job.status)}</strong></article>
    </div>
    ${placeholderBlock("Strengths", listOrPlaceholder(fitAnalysis.strengths, "Strengths will appear here after Fit Review is connected to this opportunity."))}
    ${placeholderBlock("Gaps", listOrPlaceholder(fitAnalysis.gaps, "Gaps to prepare for will appear here."))}
    ${placeholderBlock("Concerns", listOrPlaceholder(fitAnalysis.concerns, "Concerns and tradeoffs will appear here."))}
    ${placeholderBlock("Suggested Positioning", fitAnalysis.suggestedPositioning || "NextMove will help frame an honest Apply, Maybe, or Skip recommendation here.")}
    ${aiMetadataBlock(fitAnalysis)}
    <div class="section-block">
      <h2>Edit Fit Review</h2>
      <form class="input-panel flat-panel fit-review-form" data-fit-review-form="${escapeAttribute(job.id)}">
        <div class="form-grid">
          <label>
            Fit Score
            <input name="fitScore" type="number" min="0" max="100" step="1" value="${escapeAttribute(fitAnalysis.fitScore ?? job.fitScore ?? "")}" required>
          </label>
          <label>
            Recommendation
            <select name="fitRecommendation" required>
              ${fitRecommendationOptions(fitAnalysis.recommendation || job.fitRecommendation)}
            </select>
          </label>
        </div>
        <label>
          Strengths
          <textarea name="strengths" rows="4" placeholder="One strength per line">${escapeHtml(textFromLines(fitAnalysis.strengths))}</textarea>
        </label>
        <label>
          Gaps
          <textarea name="gaps" rows="4" placeholder="One gap per line">${escapeHtml(textFromLines(fitAnalysis.gaps))}</textarea>
        </label>
        <label>
          Concerns
          <textarea name="concerns" rows="4" placeholder="One concern per line">${escapeHtml(textFromLines(fitAnalysis.concerns))}</textarea>
        </label>
        <label>
          Suggested Positioning
          <textarea name="suggestedPositioning" rows="4">${escapeHtml(fitAnalysis.suggestedPositioning || "")}</textarea>
        </label>
        <label class="checkbox-label">
          <input name="userApproved" type="checkbox"${fitAnalysis.userApproved ? " checked" : ""}>
          User approved
        </label>
        <p class="helper-copy">This local prefill is a first-pass recommendation based on Job Intelligence. Review and edit it before relying on it.</p>
        <div class="button-row">
          <button type="button" class="secondary-button" data-prefill-fit-review>Prefill from Job Intelligence</button>
          <button type="submit">Save Fit Review</button>
        </div>
      </form>
    </div>
  `;
}

function renderResumeBuilder(job) {
  if (!job) {
    document.querySelector("#jobs-resume-placeholder").innerHTML = emptyMessage("Save an opportunity before reviewing tailored resume output.");
    return;
  }

  const resumeDraft = job.resumeDraft || {};
  const markdownContent = resumeDraft.markdownContent || resumeDraft.markdownPreview || job.resumeVersionPath || "";
  document.querySelector("#jobs-resume-placeholder").innerHTML = `
    ${placeholderBlock("Tailored Summary", resumeDraft.tailoredSummary || "A tailored summary grounded in your Professional Experience will appear here.")}
    ${placeholderBlock("Tailored Skills", listOrPlaceholder(resumeDraft.tailoredSkills, "Tailored skills will appear here."))}
    ${placeholderBlock("Tailored Experience Bullets", listOrPlaceholder(resumeDraft.tailoredExperienceBullets, "Experience bullets grounded in your Professional Experience will appear here."))}
    ${placeholderBlock("Markdown Preview", markdownContent || "Markdown resume preview will appear here when generated or saved.")}
    ${aiMetadataBlock(resumeDraft)}
    <div class="section-block">
      <h2>Edit Resume Draft</h2>
      <form class="input-panel flat-panel packet-draft-form" data-resume-draft-form="${escapeAttribute(job.id)}">
        <label>
          Tailored Summary
          <textarea name="tailoredSummary" rows="4">${escapeHtml(resumeDraft.tailoredSummary || "")}</textarea>
        </label>
        <label>
          Tailored Skills
          <textarea name="tailoredSkills" rows="4" placeholder="One skill per line">${escapeHtml(textFromLines(resumeDraft.tailoredSkills))}</textarea>
        </label>
        <label>
          Tailored Experience Bullets
          <textarea name="tailoredExperienceBullets" rows="5" placeholder="One bullet per line">${escapeHtml(textFromLines(resumeDraft.tailoredExperienceBullets))}</textarea>
        </label>
        <label>
          Markdown Content
          <textarea name="markdownContent" rows="8">${escapeHtml(markdownContent)}</textarea>
        </label>
        <label class="checkbox-label">
          <input name="userApproved" type="checkbox"${resumeDraft.userApproved ? " checked" : ""}>
          User approved
        </label>
        <div class="button-row">
          <button type="button" class="secondary-button" data-generate-resume-draft="${escapeAttribute(job.id)}">Generate Resume</button>
          <button type="submit">Save Resume Draft</button>
        </div>
      </form>
    </div>
  `;
}

function renderCoverLetterBuilder(job) {
  if (!job) {
    document.querySelector("#jobs-cover-letter-placeholder").innerHTML = emptyMessage("Save an opportunity before reviewing cover letter output.");
    return;
  }

  const coverLetterDraft = job.coverLetterDraft || {};
  const coverLetterContent = coverLetterDraft.coverLetterContent || coverLetterDraft.draftText || job.coverLetterPath || "";
  document.querySelector("#jobs-cover-letter-placeholder").innerHTML = `
    ${placeholderBlock("Draft Cover Letter", coverLetterContent || "A warm, honest draft cover letter will appear here.")}
    ${placeholderBlock("Tone Note", coverLetterDraft.toneNote || "Tone target: warm, friendly, confident, and human.")}
    ${placeholderBlock("User Approval Status", coverLetterDraft.userApproved ? "Approved by user." : "Not approved yet.")}
    ${aiMetadataBlock(coverLetterDraft)}
    <div class="section-block">
      <h2>Edit Cover Letter Draft</h2>
      <form class="input-panel flat-panel packet-draft-form" data-cover-letter-draft-form="${escapeAttribute(job.id)}">
        <label>
          Cover Letter Content
          <textarea name="coverLetterContent" rows="10">${escapeHtml(coverLetterContent)}</textarea>
        </label>
        <label class="checkbox-label">
          <input name="userApproved" type="checkbox"${coverLetterDraft.userApproved ? " checked" : ""}>
          User approved
        </label>
        <button type="submit">Save Cover Letter Draft</button>
      </form>
    </div>
  `;
}

function renderApplicationPacket(job) {
  document.querySelector("#jobs-packet-placeholder").innerHTML = job
    ? `
      ${placeholderBlock("Job Details", `${job.company} - ${job.roleTitle}`)}
      ${fitReviewPacketBlock(job)}
      ${packetStatusGrid(job)}
      ${placeholderBlock("Resume Draft", resumeDraftStatus(job))}
      ${placeholderBlock("Cover Letter Draft", coverLetterDraftStatus(job))}
      ${placeholderBlock("Packet Notes", job.notes || "NextMove will gather notes, evidence, and follow-up context here.")}
      <div class="section-block">
        <h2>Edit Packet Notes</h2>
        <form class="input-panel flat-panel packet-draft-form" data-packet-notes-form="${escapeAttribute(job.id)}">
          <label>
            Packet Notes
            <textarea name="packetNotes" rows="6">${escapeHtml(job.notes || "")}</textarea>
          </label>
          <button type="submit">Save Packet Notes</button>
        </form>
      </div>
      <button type="button" class="secondary-button" disabled>Export packet later</button>
    `
    : emptyMessage("Save an opportunity before building an application packet.");
}

function renderApplicationStudio(job) {
  const node = document.querySelector("#application-studio-content");
  if (!node) {
    return;
  }

  if (!job) {
    node.innerHTML = `
      ${emptyMessage("Save an opportunity before opening Application Studio to prepare the application packet.")}
      <div class="button-row">
        <a class="secondary-button nav-link-button" href="#/jobs/opportunity">Add Opportunity</a>
        <button type="button" class="secondary-button" data-load-demo-data>Load Sample Data</button>
      </div>
    `;
    return;
  }

  const readiness = applicationPacketReadiness(job);

  node.innerHTML = `
    <div class="studio-hero">
      <div class="studio-hero-main">
        <p class="eyebrow">Application Studio</p>
        <h2>${escapeHtml(job.roleTitle)}</h2>
        <p>${escapeHtml(job.company)} | ${escapeHtml(formatValue(job.location))} | ${escapeHtml(formatValue(job.workArrangement))}</p>
      </div>
      <div class="studio-hero-status">
        <span>Status</span>
        ${statusBadge(job.status)}
        <p>${escapeHtml(readinessSummaryText(readiness))}</p>
      </div>
    </div>

    <div class="studio-action-bar">
      <button type="button" class="secondary-button" data-review-saved-opportunity="${escapeAttribute(job.id)}">Analyze Fit</button>
      <button type="button" class="secondary-button" data-generate-resume-draft="${escapeAttribute(job.id)}">Generate Resume Draft</button>
      <button type="button" class="secondary-button" data-generate-cover-letter-draft="${escapeAttribute(job.id)}">Generate Cover Letter Draft</button>
      <a class="secondary-button nav-link-button" href="#/jobs/opportunity/${escapeAttribute(job.id)}">Opportunity Review</a>
      <a class="secondary-button nav-link-button" href="#/jobs/tracker">Open Tracker</a>
    </div>

    <div class="studio-grid active-workspace-grid">
      <section class="studio-card studio-card-primary">
        <h2>Active Opportunity Workspace</h2>
        ${jobDetailsSnapshotBlock(job)}
        ${applicationStudioStatusForm(job)}
      </section>

      <section class="studio-card studio-card-primary">
        <div>
          <h2>Packet Readiness</h2>
          <p class="support-copy">${escapeHtml(readinessSummaryText(readiness))}</p>
        </div>
        ${readinessMeterBlock(readiness)}
        ${readinessChecklistBlock(job, readiness)}
      </section>

      <section class="studio-card">
        <h2>Status and Next Step</h2>
        ${packetStatusGrid(job)}
      </section>
    </div>

    <div class="two-column">
      <section class="studio-card">
        <h2>Fit Review</h2>
        ${fitReviewWorkspaceBlock(job)}
      </section>
      <section class="studio-card">
        <h2>Opportunity Snapshot</h2>
        ${postingSummaryBlock(job)}
      </section>
    </div>

    <details class="studio-card studio-disclosure">
      <summary>Job Intelligence</summary>
      ${jobIntelligenceWorkspaceBlock(job)}
    </details>

    <div class="two-column">
      <section class="studio-card">
        <h2>Resume Draft</h2>
        ${draftPreviewBlock("Resume Content", resumeDraftText(job), "No resume draft yet. Generate a resume or save markdown content here when ready.")}
        <div class="button-row">
          <button type="button" class="secondary-button" data-copy-packet-draft="resume" data-job-id="${escapeAttribute(job.id)}">Copy Resume Draft</button>
        </div>
        ${resumeDraftEditorBlock(job)}
      </section>
      <section class="studio-card">
        <h2>Cover Letter Draft</h2>
        ${draftPreviewBlock("Cover Letter Content", coverLetterDraftText(job), "No cover letter draft yet. Save draft content here when ready.")}
        <div class="button-row">
          <button type="button" class="secondary-button" data-copy-packet-draft="cover-letter" data-job-id="${escapeAttribute(job.id)}">Copy Cover Letter Draft</button>
        </div>
        ${coverLetterDraftEditorBlock(job)}
      </section>
    </div>
    <section class="studio-card">
      <h2>Notes and Follow-up</h2>
      ${placeholderBlock("Follow-up Date", formatValue(job.followUpDate))}
      ${packetNotesEditorBlock(job)}
    </section>
  `;
}

function applicationStudioStatusForm(job) {
  return `
    <form class="input-panel flat-panel job-update-form" data-job-detail-form="${escapeAttribute(job.id)}">
      <div class="form-grid">
        <label>
          Status
          <select name="status">
            ${statusOptions(job.status)}
          </select>
        </label>
        <label>
          Date Applied
          <input name="dateApplied" type="date" value="${escapeAttribute(job.dateApplied || "")}">
        </label>
        <label>
          Follow-up Date
          <input name="followUpDate" type="date" value="${escapeAttribute(job.followUpDate || "")}">
        </label>
      </div>
      <label>
        Packet / Follow-up Notes
        <textarea name="notes" rows="4">${escapeHtml(job.notes || "")}</textarea>
      </label>
      <button type="submit">Update Status and Notes</button>
    </form>
  `;
}

function applicationPacketReadiness(job) {
  const checklist = job.packetChecklist || {};
  const submittedByStatus = ["Applied", "Interviewing", "Rejected", "Offer", "Closed"].includes(job.status);
  const items = [
    readinessItem("Job posting saved", Boolean(cleanValue(job.sourcePostingText)), "Add the posting text in Opportunity Review."),
    readinessItem("Job intelligence available", hasJobIntelligence(job), "Extract or enter responsibilities, skills, tools, and role details."),
    readinessItem("Fit review available", hasFitAnalysis(job), "Save an Apply, Maybe, or Skip fit review."),
    readinessItem("Resume draft available", hasResumeDraft(job), "Generate or save a tailored resume draft."),
    readinessItem("Cover letter draft available", hasCoverLetterDraft(job), "Save a cover letter draft."),
    readinessItem("Notes added", Boolean(cleanValue(job.notes)), "Add packet notes or follow-up context."),
    readinessItem("Status selected", Boolean(cleanValue(job.status)), "Choose a current application status."),
    readinessItem("Follow-up details added", Boolean(cleanValue(job.followUpDate)), "Add a follow-up date when useful."),
    readinessItem("Resume reviewed", Boolean(checklist.resumeReviewed), "Review the resume draft before using it.", "resumeReviewed"),
    readinessItem("Cover letter reviewed", Boolean(checklist.coverLetterReviewed), "Review the cover letter draft before using it.", "coverLetterReviewed"),
    readinessItem("Application submitted", Boolean(checklist.applicationSubmitted || submittedByStatus), "Mark this when the application is submitted.", "applicationSubmitted"),
    readinessItem("Follow-up scheduled", Boolean(checklist.followUpScheduled || cleanValue(job.followUpDate)), "Mark this when the next follow-up is scheduled.", "followUpScheduled"),
  ];
  const completed = items.filter((item) => item.complete).length;

  return {
    completed,
    items,
    total: items.length,
  };
}

function readinessItem(label, complete, emptyText, field = "") {
  return {
    complete: Boolean(complete),
    emptyText,
    field,
    label,
  };
}

function readinessSummaryText(readiness) {
  return `${readiness.completed} of ${readiness.total} complete`;
}

function readinessMeterBlock(readiness) {
  const percent = readiness.total ? Math.round((readiness.completed / readiness.total) * 100) : 0;
  return `
    <div class="readiness-meter" aria-label="${escapeAttribute(readinessSummaryText(readiness))}">
      <div class="readiness-meter-fill" style="width: ${percent}%"></div>
    </div>
  `;
}

function readinessChecklistBlock(job, readiness) {
  return `
    <div class="readiness-checklist">
      ${readiness.items.map((item) => readinessChecklistItem(job, item)).join("")}
    </div>
  `;
}

function readinessChecklistItem(job, item) {
  const stateText = item.complete ? "Complete" : item.emptyText;
  const stateClass = item.complete ? "complete" : "incomplete";

  if (item.field) {
    return `
      <label class="readiness-item ${stateClass}">
        <input
          type="checkbox"
          data-packet-checklist="${escapeAttribute(item.field)}"
          data-job-id="${escapeAttribute(job.id)}"
          ${item.complete ? "checked" : ""}
        >
        <span>
          <strong>${escapeHtml(item.label)}</strong>
          <small>${escapeHtml(stateText)}</small>
        </span>
      </label>
    `;
  }

  return `
    <div class="readiness-item ${stateClass}">
      <span class="readiness-dot" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(stateText)}</small>
      </span>
    </div>
  `;
}

function jobDetailsSnapshotBlock(job) {
  return `
    <dl class="detail-grid">
      ${detailRow("Company", job.company)}
      ${detailRow("Role", job.roleTitle)}
      ${detailRow("Status", job.status)}
      ${detailRow("Date found", formatValue(job.dateFound))}
      ${detailRow("Date applied", formatValue(job.dateApplied))}
      ${detailRow("Follow-up", formatValue(job.followUpDate))}
      ${detailRow("Location", formatValue(job.location))}
      ${detailRow("Salary", formatValue(job.salaryRange))}
      ${detailRow("Work arrangement", formatValue(job.workArrangement))}
      ${detailRow("Job URL", job.jobUrl ? `<a href="${escapeAttribute(job.jobUrl)}">${escapeHtml(job.jobUrl)}</a>` : "Not saved yet", true)}
    </dl>
  `;
}

function postingSummaryBlock(job) {
  return placeholderBlock(
    "Job Posting Text",
    job.sourcePostingText || "No source posting text is saved yet. Add or paste the posting in Opportunity Review."
  );
}

function fitReviewWorkspaceBlock(job) {
  const fitAnalysis = job.fitAnalysis || {};
  return `
    <div class="score-grid">
      <article><span>Score</span><strong>${escapeHtml(formatValue(fitAnalysis.fitScore ?? job.fitScore))}</strong></article>
      <article><span>Recommendation</span><strong>${escapeHtml(formatValue(fitAnalysis.recommendation || job.fitRecommendation))}</strong></article>
      <article><span>Approval</span><strong>${fitAnalysis.userApproved ? "Approved" : "Missing"}</strong></article>
    </div>
    ${placeholderBlock("Strengths", listOrPlaceholder(fitAnalysis.strengths, "No fit strengths saved yet."))}
    ${placeholderBlock("Gaps", listOrPlaceholder(fitAnalysis.gaps, "No fit gaps saved yet."))}
    ${placeholderBlock("Concerns", listOrPlaceholder(fitAnalysis.concerns, "No fit concerns saved yet."))}
    ${placeholderBlock("Suggested Positioning", fitAnalysis.suggestedPositioning || "No positioning note saved yet.")}
  `;
}

function jobIntelligenceWorkspaceBlock(job) {
  return `
    <div class="three-column">
      ${placeholderBlock("Responsibilities", listOrPlaceholder(job.responsibilities, "No responsibilities saved yet."))}
      ${placeholderBlock("Required Skills", listOrPlaceholder(job.requiredSkills, "No required skills saved yet."))}
      ${placeholderBlock("Preferred Skills", listOrPlaceholder(job.preferredSkills, "No preferred skills saved yet."))}
      ${placeholderBlock("Technologies / Tools", listOrPlaceholder(job.technologies, "No technologies saved yet."))}
      ${placeholderBlock("Leadership Expectations", listOrPlaceholder(job.leadershipExpectations, "No leadership expectations saved yet."))}
      ${placeholderBlock("Certifications", listOrPlaceholder(job.certifications, "No certifications saved yet."))}
      ${placeholderBlock("Years of Experience", formatValue(job.yearsExperience))}
    </div>
  `;
}

function draftPreviewBlock(title, content, emptyText) {
  return content
    ? `<div class="placeholder-block packet-preview-block"><h3>${escapeHtml(title)}</h3><pre>${escapeHtml(content)}</pre></div>`
    : placeholderBlock(title, emptyText);
}

function renderTracker(jobs) {
  const node = document.querySelector("#application-tracker-list");
  if (!jobs.length) {
    node.innerHTML = emptyMessage("Saved opportunities will appear here by pipeline status. Add one role, then track dates, follow-ups, and next steps.");
    return;
  }

  node.innerHTML = JOB_STATUSES.map((status) => {
    const matchingJobs = jobs.filter((job) => job.status === status);
    if (!matchingJobs.length) {
      return "";
    }

    return `
      <div class="section-block">
        <h2>${statusBadge(status)}</h2>
        <div class="job-card-list">
          ${matchingJobs.map((job) => trackerJobCard(job)).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderStatusSummary(selector, jobs) {
  const node = document.querySelector(selector);
  const counts = countJobsByStatus(jobs);

  node.innerHTML = DASHBOARD_STATUSES.map((status) => {
    const count = counts[status] || 0;
    const label = count === 1 ? "job" : "jobs";

    return `
      <article class="${count ? `status-card ${statusClass(status)}` : "status-card muted-card"}">
        <span>${escapeHtml(status)}</span>
        <strong>${count}</strong>
        <p>${label}</p>
      </article>
    `;
  }).join("");
}

function renderDashboardSummary(selector, jobs) {
  const node = document.querySelector(selector);
  const activeJobs = jobs.filter((job) => !["Skip", "Rejected", "Closed"].includes(job.status));
  const packetDraftsNeedingReview = jobs.filter((job) => fitRecommendationFor(job) === "Apply" && !isApplicationPacketComplete(job));
  const followUpsDue = jobs.filter((job) => job.status === "Applied" && isDueOrPast(job.followUpDate));
  const submittedJobs = jobs.filter((job) => ["Applied", "Interviewing", "Offer"].includes(job.status));

  const metrics = [
    {
      label: "Active",
      value: activeJobs.length,
      detail: "opportunities in play",
      className: "status-reviewing",
    },
    {
      label: "Packets",
      value: packetDraftsNeedingReview.length,
      detail: "need draft work",
      className: packetDraftsNeedingReview.length ? "status-apply" : "status-found",
    },
    {
      label: "Follow-up",
      value: followUpsDue.length,
      detail: "due or past due",
      className: followUpsDue.length ? "status-maybe" : "status-found",
    },
    {
      label: "Submitted",
      value: submittedJobs.length,
      detail: "applied/interviewing",
      className: "status-applied",
    },
  ];

  node.innerHTML = metrics.map((metric) => `
    <article class="dashboard-metric-card ${metric.className}">
      <span>${escapeHtml(metric.label)}</span>
      <strong>${metric.value}</strong>
      <p>${escapeHtml(metric.detail)}</p>
    </article>
  `).join("");
}

function renderJobCards(selector, jobs) {
  const node = document.querySelector(selector);
  node.innerHTML = jobs.length
    ? jobs.map((job) => jobCard(job, false, true)).join("")
    : `
      ${emptyMessage("No saved opportunities yet. Paste one posting or load sample data to test the full workspace flow.")}
      <div class="button-row">
        <a class="secondary-button nav-link-button" href="#/jobs/opportunity">Add Opportunity</a>
        <button type="button" class="secondary-button" data-load-demo-data>Load Sample Data</button>
      </div>
    `;
}

function renderNextActions(jobs) {
  const node = document.querySelector("#jobs-next-actions");
  const action = recommendedNextAction(jobs);
  const secondaryActions = dashboardSecondaryActions(jobs);

  node.innerHTML = `
    <div class="dashboard-primary-action">
      <p class="next-action-label">${escapeHtml(action.label)}</p>
      <h3>${escapeHtml(action.title)}</h3>
      <p>${escapeHtml(action.detail)}</p>
      <a class="nav-link-button" href="${escapeAttribute(action.href)}">${escapeHtml(action.buttonText)}</a>
    </div>
    <div class="dashboard-secondary-actions">
      ${secondaryActions.map((secondaryAction) => dashboardSecondaryActionLink(secondaryAction)).join("")}
    </div>
  `;
}

function dashboardSecondaryActions(jobs) {
  if (!jobs.length) {
    return [
      {
        type: "button",
        label: "Load Sample Data",
        className: "secondary-button",
        dataAttribute: "data-load-demo-data",
      },
      {
        type: "link",
        label: "Complete Experience",
        href: "#professional-experience",
      },
    ];
  }

  return [
    {
      type: "link",
      label: "View Tracker",
      href: "#/jobs/tracker",
    },
    {
      type: "link",
      label: "Open Studio",
      href: `#/jobs/studio${selectedJobId ? `/${encodeURIComponent(selectedJobId)}` : ""}`,
    },
  ];
}

function dashboardSecondaryActionLink(action) {
  if (action.type === "button") {
    return `<button type="button" class="${escapeAttribute(action.className || "secondary-button")}" ${action.dataAttribute}>${escapeHtml(action.label)}</button>`;
  }

  return `<a class="secondary-button nav-link-button" href="${escapeAttribute(action.href)}">${escapeHtml(action.label)}</a>`;
}

function jobCard(job, includeDates = false, dashboardCard = false) {
  const fit = fitRecommendationFor(job) || "No fit yet";
  const score = job.fitAnalysis?.fitScore ?? job.fitScore;
  const fitDisplay = cleanValue(score) ? `${score} / ${fit}` : fit;
  const updated = formatShortDateTime(job.updatedAt || job.dateFound);
  const summary = dashboardCard
    ? `<p>Fit: ${escapeHtml(fitDisplay)} | Updated: ${escapeHtml(updated)}</p>`
    : `<p>${escapeHtml(formatValue(job.location))} | Fit: ${escapeHtml(fitDisplay)}</p>`;

  const dates = includeDates
    ? `<p>Found: ${escapeHtml(formatValue(job.dateFound))} | Updated: ${escapeHtml(updated)} | Follow-up: ${escapeHtml(formatValue(job.followUpDate))}</p>`
    : summary;

  return `
    <article class="job-card">
      <div>
        <h3>${escapeHtml(job.roleTitle)}</h3>
        <p>${escapeHtml(job.company)} ${statusBadge(job.status)}</p>
        ${dates}
      </div>
      <div class="tracker-card-actions">
        <a class="small-button nav-link-button" href="#/jobs/studio/${escapeAttribute(job.id)}" data-select-job="${escapeAttribute(job.id)}" data-open-page="studio">Open Workspace</a>
        <a class="small-button nav-link-button" href="#/jobs/detail/${escapeAttribute(job.id)}" data-select-job="${escapeAttribute(job.id)}" data-open-page="detail">View Details</a>
      </div>
    </article>
  `;
}

function trackerJobCard(job) {
  return `
    <article class="job-card tracker-job-card">
      <div>
        <h3>${escapeHtml(job.roleTitle)}</h3>
        <p>${escapeHtml(job.company)} ${statusBadge(job.status)}</p>
        <p>Found: ${escapeHtml(formatValue(job.dateFound))}</p>
        <p>Applied: ${escapeHtml(formatValue(job.dateApplied))} | Follow-up: ${escapeHtml(formatValue(job.followUpDate))}</p>
      </div>
      <div class="tracker-card-actions">
        <label>
          Status
          <select data-tracker-status="${escapeAttribute(job.id)}">
            ${statusOptions(job.status)}
          </select>
        </label>
        <a class="small-button nav-link-button" href="#/jobs/studio/${escapeAttribute(job.id)}">Studio</a>
        <a class="small-button nav-link-button" href="#/jobs/detail/${escapeAttribute(job.id)}" data-select-job="${escapeAttribute(job.id)}" data-open-page="detail">View Details</a>
      </div>
    </article>
  `;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-select-job]");
  if (!button) {
    return;
  }

  selectedJobId = button.dataset.selectJob;
  navigateToJobsRoute(button.dataset.openPage || "studio", selectedJobId);
});

function currentJob(jobs) {
  return jobs.find((job) => job.id === selectedJobId) || jobs[0] || null;
}

function findJobById(jobId) {
  return RightForMeJobsAppliedStorage.getJobApplications().find((job) => job.id === jobId) || null;
}

function readCareerVaultProfile() {
  if (window.RightForMeCareerVault?.getVault) {
    return window.RightForMeCareerVault.getVault();
  }

  return {};
}

function recentJobs(jobs) {
  return [...jobs].sort((a, b) => String(b.updatedAt || b.dateFound || "").localeCompare(String(a.updatedAt || a.dateFound || ""))).slice(0, 8);
}

function recommendedNextAction(jobs) {
  if (!jobs.length) {
    return {
      label: "Start here",
      title: "Add your first job posting.",
      detail: "Paste a role you are considering so NextMove can help you review fit and organize the application work.",
      buttonText: "Open Opportunity Review",
      href: "#/jobs/opportunity",
    };
  }

  const interviewingJob = jobs.find((job) => job.status === "Interviewing");
  if (interviewingJob) {
    return actionForJob(
      "Interview prep",
      `Prepare for interviews with ${interviewingJob.company}.`,
      `${interviewingJob.roleTitle} is in Interviewing. Gather notes, evidence, and likely questions before the next conversation.`,
      "Open job detail",
      interviewingJob
    );
  }

  const dueFollowUpJob = jobs.find((job) => job.status === "Applied" && isDueOrPast(job.followUpDate));
  if (dueFollowUpJob) {
    return actionForJob(
      "Follow-up due",
      `Follow up on ${dueFollowUpJob.roleTitle}.`,
      `${dueFollowUpJob.company} has a follow-up date due or past. A short, calm check-in keeps momentum visible.`,
      "Open job detail",
      dueFollowUpJob
    );
  }

  const reviewingJobWithoutFit = jobs.find((job) => job.status === "Reviewing" && !hasFitAnalysis(job));
  if (reviewingJobWithoutFit) {
    return actionForJob(
      "Fit review",
      `Complete Fit Review for ${reviewingJobWithoutFit.roleTitle}.`,
      `Review strengths, gaps, and positioning before deciding whether ${reviewingJobWithoutFit.company} is Apply, Maybe, or Skip.`,
      "Open Fit Review",
      reviewingJobWithoutFit,
      "fit"
    );
  }

  const activeFitJobs = jobs.filter((job) => !["Skip", "Applied", "Interviewing", "Rejected", "Offer", "Closed"].includes(job.status));
  const incompleteApplyPacketJob = activeFitJobs.find((job) => fitRecommendationFor(job) === "Apply" && !isApplicationPacketComplete(job));
  if (incompleteApplyPacketJob) {
    return actionForJob(
      "Application packet",
      `Complete the packet for ${incompleteApplyPacketJob.roleTitle}.`,
      "This role has an Apply recommendation and still needs a saved resume draft or cover letter draft.",
      "Open Application Studio",
      incompleteApplyPacketJob,
      "studio"
    );
  }

  const completeApplyPacketJob = activeFitJobs.find((job) => fitRecommendationFor(job) === "Apply" && isApplicationPacketComplete(job) && job.status !== "Applied");
  if (completeApplyPacketJob) {
    return actionForJob(
      "Ready to apply",
      `Mark ${completeApplyPacketJob.roleTitle} as Applied when submitted.`,
      "The application packet has a saved resume and cover letter. After you apply, update the job status and follow-up date.",
      "Open job detail",
      completeApplyPacketJob
    );
  }

  const applyRecommendationJob = activeFitJobs.find((job) => fitRecommendationFor(job) === "Apply");
  if (applyRecommendationJob) {
    return actionForJob(
      "Application packet",
      `Build the packet for ${applyRecommendationJob.roleTitle}.`,
      "This role has an Apply recommendation. Pull the tailored resume, cover letter, and notes together.",
      "Open Application Studio",
      applyRecommendationJob,
      "studio"
    );
  }

  const maybeRecommendationJob = activeFitJobs.find((job) => fitRecommendationFor(job) === "Maybe");
  if (maybeRecommendationJob) {
    return actionForJob(
      "User review",
      `Review the Maybe decision for ${maybeRecommendationJob.roleTitle}.`,
      "Check the gaps, concerns, and positioning before spending more application energy here.",
      "Open Fit Review",
      maybeRecommendationJob,
      "fit"
    );
  }

  const applyJob = jobs.find((job) => job.status === "Apply" && fitRecommendationFor(job) !== "Skip");
  if (applyJob) {
    return actionForJob(
      "Application packet",
      `Build the packet for ${applyJob.roleTitle}.`,
      "Pull the tailored resume, cover letter, and notes together before applying.",
      "Open packet",
      applyJob,
      "packet"
    );
  }

  const foundJob = jobs.find((job) => job.status === "Found");
  if (foundJob) {
    return actionForJob(
      "Review saved job",
      `Review ${foundJob.roleTitle} at ${foundJob.company}.`,
      "Turn this saved opportunity into a clear Apply, Maybe, or Skip decision.",
      "Open job detail",
      foundJob
    );
  }

  return {
    label: "Steady state",
    title: "Review saved jobs.",
    detail: "No urgent follow-up is due. Open the tracker or add another posting when you are ready.",
    buttonText: "Open Tracker",
    href: "#/jobs/tracker",
  };
}

function actionForJob(label, title, detail, buttonText, job, page = "detail") {
  return {
    label,
    title,
    detail,
    buttonText,
    href: `#/jobs/${page}/${encodeURIComponent(job.id)}`,
  };
}

function countJobsByStatus(jobs) {
  return jobs.reduce((counts, job) => {
    counts[job.status] = (counts[job.status] || 0) + 1;
    return counts;
  }, {});
}

function isDueOrPast(dateValue) {
  const date = String(dateValue || "").trim();
  if (!date) {
    return false;
  }

  return date <= new Date().toISOString().slice(0, 10);
}

function fitReviewSummaryBlock(job) {
  const fitAnalysis = job.fitAnalysis || {};
  const strengths = Array.isArray(fitAnalysis.strengths) ? fitAnalysis.strengths : [];
  const concerns = Array.isArray(fitAnalysis.concerns) ? fitAnalysis.concerns : [];
  const signal = strengths[0] || concerns[0] || "No strengths or concerns saved yet.";

  return `
    <div class="section-block">
      <h2>Fit Review Summary</h2>
      <div class="score-grid">
        <article><span>Score</span><strong>${escapeHtml(formatValue(fitAnalysis.fitScore ?? job.fitScore))}</strong></article>
        <article><span>Recommendation</span><strong>${escapeHtml(formatValue(fitAnalysis.recommendation || job.fitRecommendation))}</strong></article>
        <article><span>Approval</span><strong>${fitAnalysis.userApproved ? "Approved" : "Missing"}</strong></article>
      </div>
      <p>${escapeHtml(signal)}</p>
    </div>
  `;
}

function jobIntelligenceSummaryBlock(job) {
  return `
    <div class="section-block">
      <h2>Opportunity Intelligence</h2>
      <div class="three-column">
        ${placeholderBlock("Responsibilities", listOrPlaceholder(job.responsibilities, "No responsibilities saved yet."))}
        ${placeholderBlock("Required Skills", listOrPlaceholder(job.requiredSkills, "No required skills saved yet."))}
        ${placeholderBlock("Technologies / Tools", listOrPlaceholder(job.technologies, "No technologies saved yet."))}
      </div>
    </div>
  `;
}

function jobIntelligenceForm(job) {
  return `
    <form class="input-panel flat-panel job-intelligence-form" data-job-intelligence-form="${escapeAttribute(job.id)}">
      <div class="form-grid">
        <label>
          Company
          <input name="company" type="text" required value="${escapeAttribute(job.company || "")}">
        </label>
        <label>
          Role Title
          <input name="roleTitle" type="text" required value="${escapeAttribute(job.roleTitle || "")}">
        </label>
        <label>
          Job URL
          <input name="jobUrl" type="url" value="${escapeAttribute(job.jobUrl || "")}">
        </label>
        <label>
          Location
          <input name="location" type="text" value="${escapeAttribute(job.location || "")}">
        </label>
        <label>
          Salary Range
          <input name="salaryRange" type="text" value="${escapeAttribute(job.salaryRange || "")}">
        </label>
        <label>
          Work Arrangement
          <input name="workArrangement" type="text" value="${escapeAttribute(job.workArrangement || "")}">
        </label>
        <label>
          Years of Experience
          <input name="yearsExperience" type="text" value="${escapeAttribute(job.yearsExperience || "")}">
        </label>
      </div>
      <div class="form-grid">
        ${jobIntelligenceTextarea("Responsibilities", "responsibilities", job.responsibilities)}
        ${jobIntelligenceTextarea("Required Skills", "requiredSkills", job.requiredSkills)}
        ${jobIntelligenceTextarea("Preferred Skills", "preferredSkills", job.preferredSkills)}
        ${jobIntelligenceTextarea("Technologies / Tools", "technologies", job.technologies)}
        ${jobIntelligenceTextarea("Leadership Expectations", "leadershipExpectations", job.leadershipExpectations)}
        ${jobIntelligenceTextarea("Certifications", "certifications", job.certifications)}
      </div>
      <label>
        Notes
        <textarea name="notes" rows="5">${escapeHtml(job.notes || "")}</textarea>
      </label>
      <label>
        Source Posting Text
        <textarea name="sourcePostingText" rows="8">${escapeHtml(job.sourcePostingText || "")}</textarea>
      </label>
      <p class="helper-copy">Use rule-based extraction for a fast local fallback, or Review Opportunity when OPENAI_API_KEY is configured. Both can be edited before you rely on them.</p>
      <div class="button-row">
        <button type="button" class="secondary-button" data-extract-job-intelligence>Extract from posting</button>
        <button type="button" class="secondary-button" data-review-opportunity>Review Opportunity</button>
        <button type="submit">Save Opportunity Intelligence</button>
      </div>
    </form>
  `;
}

function jobIntelligenceTextarea(label, name, value) {
  return `
    <label>
      ${escapeHtml(label)}
      <textarea name="${escapeAttribute(name)}" rows="4" placeholder="One item per line">${escapeHtml(textFromLines(value))}</textarea>
    </label>
  `;
}

function applicationPacketStatusBlock(job) {
  return `
    <div class="section-block">
      <h2>Application Packet Status</h2>
      <div class="score-grid">
        <article><span>Resume</span><strong>${escapeHtml(resumeDraftStatus(job))}</strong></article>
        <article><span>Cover Letter</span><strong>${escapeHtml(coverLetterDraftStatus(job))}</strong></article>
        <article><span>Packet Notes</span><strong>${job.notes ? "Present" : "Missing"}</strong></article>
      </div>
    </div>
  `;
}

function resumeDraftEditorBlock(job) {
  const resumeDraft = job.resumeDraft || {};
  const markdownContent = resumeDraftText(job);

  return `
    ${placeholderBlock("Status", resumeDraftStatus(job))}
    <form class="input-panel flat-panel packet-draft-form" data-resume-draft-form="${escapeAttribute(job.id)}">
      <label>
        Tailored Summary
        <textarea name="tailoredSummary" rows="4">${escapeHtml(resumeDraft.tailoredSummary || "")}</textarea>
      </label>
      <label>
        Tailored Skills
        <textarea name="tailoredSkills" rows="4" placeholder="One skill per line">${escapeHtml(textFromLines(resumeDraft.tailoredSkills))}</textarea>
      </label>
      <label>
        Tailored Experience Bullets
        <textarea name="tailoredExperienceBullets" rows="5" placeholder="One bullet per line">${escapeHtml(textFromLines(resumeDraft.tailoredExperienceBullets))}</textarea>
      </label>
      <label>
        Markdown Content
        <textarea name="markdownContent" rows="8">${escapeHtml(markdownContent)}</textarea>
      </label>
      <label class="checkbox-label">
        <input name="userApproved" type="checkbox"${resumeDraft.userApproved ? " checked" : ""}>
        User approved
      </label>
      <div class="button-row">
        <button type="button" class="secondary-button" data-generate-resume-draft="${escapeAttribute(job.id)}">Generate Resume</button>
        <button type="submit">Save Resume Draft</button>
      </div>
    </form>
  `;
}

function coverLetterDraftEditorBlock(job) {
  const coverLetterDraft = job.coverLetterDraft || {};
  const coverLetterContent = coverLetterDraftText(job);

  return `
    ${placeholderBlock("Status", coverLetterDraftStatus(job))}
    <form class="input-panel flat-panel packet-draft-form" data-cover-letter-draft-form="${escapeAttribute(job.id)}">
      <label>
        Cover Letter Content
        <textarea name="coverLetterContent" rows="10">${escapeHtml(coverLetterContent)}</textarea>
      </label>
      <label class="checkbox-label">
        <input name="userApproved" type="checkbox"${coverLetterDraft.userApproved ? " checked" : ""}>
        User approved
      </label>
      <button type="submit">Save Cover Letter Draft</button>
    </form>
  `;
}

function packetNotesEditorBlock(job) {
  return `
    <form class="input-panel flat-panel packet-draft-form" data-packet-notes-form="${escapeAttribute(job.id)}">
      <label>
        Packet Notes
        <textarea name="packetNotes" rows="6">${escapeHtml(job.notes || "")}</textarea>
      </label>
      <button type="submit">Save Packet Notes</button>
    </form>
  `;
}

function fitReviewPacketBlock(job) {
  const fitAnalysis = job.fitAnalysis || {};
  const recommendation = fitAnalysis.recommendation || job.fitRecommendation || "Not saved yet";
  const score = fitAnalysis.fitScore ?? job.fitScore;
  const positioning = fitAnalysis.suggestedPositioning || "Suggested positioning will appear after Fit Review is saved.";

  return placeholderBlock(
    "Fit Review Summary",
    `Score: ${formatValue(score)} | Recommendation: ${formatValue(recommendation)} | ${positioning}`
  );
}

function packetStatusGrid(job) {
  return `
    <div class="score-grid">
      <article><span>Resume</span><strong>${escapeHtml(resumeDraftStatus(job))}</strong></article>
      <article><span>Cover Letter</span><strong>${escapeHtml(coverLetterDraftStatus(job))}</strong></article>
      <article><span>Packet Notes</span><strong>${job.notes ? "Present" : "Missing"}</strong></article>
    </div>
  `;
}

function resumeDraftText(job) {
  const resumeDraft = job.resumeDraft || {};
  return resumeDraft.markdownContent || resumeDraft.markdownPreview || job.resumeVersionPath || "";
}

function coverLetterDraftText(job) {
  const coverLetterDraft = job.coverLetterDraft || {};
  return coverLetterDraft.coverLetterContent || coverLetterDraft.draftText || job.coverLetterPath || "";
}

function resumeDraftStatus(job) {
  if (!hasResumeDraft(job)) {
    return "Missing";
  }

  return job.resumeDraft?.userApproved ? "Approved" : "Saved";
}

function coverLetterDraftStatus(job) {
  if (!hasCoverLetterDraft(job)) {
    return "Missing";
  }

  return job.coverLetterDraft?.userApproved ? "Approved" : "Saved";
}

function validateFitReviewInput(score, recommendation) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
    return "Fit score must be a number from 0 to 100.";
  }

  if (!JOBS_FIT_RECOMMENDATIONS.includes(recommendation)) {
    return "Choose Apply, Maybe, or Skip for the fit recommendation.";
  }

  return "";
}

function hasFitAnalysis(job) {
  return Boolean(job.fitAnalysis && String(job.fitAnalysis.recommendation || "").trim());
}

function fitRecommendationFor(job) {
  return job.fitAnalysis?.recommendation || job.fitRecommendation || "";
}

function hasJobIntelligence(job) {
  return Boolean(
    (Array.isArray(job.responsibilities) && job.responsibilities.length) ||
    (Array.isArray(job.requiredSkills) && job.requiredSkills.length) ||
    (Array.isArray(job.preferredSkills) && job.preferredSkills.length) ||
    (Array.isArray(job.technologies) && job.technologies.length) ||
    (Array.isArray(job.leadershipExpectations) && job.leadershipExpectations.length) ||
    (Array.isArray(job.certifications) && job.certifications.length) ||
    cleanValue(job.yearsExperience)
  );
}

function hasResumeDraft(job) {
  const draft = job.resumeDraft || {};
  return Boolean(
    cleanValue(draft.markdownContent) ||
    cleanValue(draft.markdownPreview) ||
    cleanValue(draft.tailoredSummary) ||
    (Array.isArray(draft.tailoredSkills) && draft.tailoredSkills.length) ||
    (Array.isArray(draft.tailoredExperienceBullets) && draft.tailoredExperienceBullets.length)
  );
}

function hasCoverLetterDraft(job) {
  const draft = job.coverLetterDraft || {};
  return Boolean(cleanValue(draft.coverLetterContent) || cleanValue(draft.draftText));
}

function isApplicationPacketComplete(job) {
  return hasResumeDraft(job) && hasCoverLetterDraft(job);
}

function statusOptions(selectedStatus) {
  return JOB_STATUSES.map((status) => {
    const selected = status === selectedStatus ? " selected" : "";
    return `<option value="${escapeAttribute(status)}"${selected}>${escapeHtml(status)}</option>`;
  }).join("");
}

function fitRecommendationOptions(selectedRecommendation) {
  const options = JOBS_FIT_RECOMMENDATIONS.map((recommendation) => {
    const selected = recommendation === selectedRecommendation ? " selected" : "";
    return `<option value="${escapeAttribute(recommendation)}"${selected}>${escapeHtml(recommendation)}</option>`;
  }).join("");

  return `<option value="">Choose recommendation</option>${options}`;
}

function isValidJobStatus(status) {
  return JOB_STATUSES.includes(status);
}

function fitReviewValuesFromForm(form) {
  return {
    fitScore: cleanValue(form.elements.fitScore?.value),
    recommendation: cleanValue(form.elements.fitRecommendation?.value),
    strengths: linesFromText(form.elements.strengths?.value),
    gaps: linesFromText(form.elements.gaps?.value),
    concerns: linesFromText(form.elements.concerns?.value),
    suggestedPositioning: cleanValue(form.elements.suggestedPositioning?.value),
    userApproved: Boolean(form.elements.userApproved?.checked),
  };
}

function applyFitReviewValuesToForm(form, values) {
  const fieldMap = {
    fitScore: "fitScore",
    recommendation: "fitRecommendation",
    strengths: "strengths",
    gaps: "gaps",
    concerns: "concerns",
    suggestedPositioning: "suggestedPositioning",
    userApproved: "userApproved",
  };

  Object.entries(values).forEach(([field, value]) => {
    const control = form.elements[fieldMap[field]];
    if (!control) {
      return;
    }

    if (field === "userApproved") {
      control.checked = Boolean(value);
      return;
    }

    control.value = Array.isArray(value) ? value.join("\n") : value;
  });
}

function jobIntelligenceValuesFromForm(form) {
  return {
    company: cleanValue(form.elements.company?.value),
    roleTitle: cleanValue(form.elements.roleTitle?.value),
    jobUrl: cleanValue(form.elements.jobUrl?.value),
    location: cleanValue(form.elements.location?.value),
    salaryRange: cleanValue(form.elements.salaryRange?.value),
    workArrangement: cleanValue(form.elements.workArrangement?.value),
    responsibilities: linesFromText(form.elements.responsibilities?.value),
    requiredSkills: linesFromText(form.elements.requiredSkills?.value),
    preferredSkills: linesFromText(form.elements.preferredSkills?.value),
    technologies: linesFromText(form.elements.technologies?.value),
    leadershipExpectations: linesFromText(form.elements.leadershipExpectations?.value),
    certifications: linesFromText(form.elements.certifications?.value),
    yearsExperience: cleanValue(form.elements.yearsExperience?.value),
    notes: cleanValue(form.elements.notes?.value),
    sourcePostingText: cleanValue(form.elements.sourcePostingText?.value),
  };
}

function applyJobIntelligenceValuesToForm(form, values) {
  Object.entries(values).forEach(([field, value]) => {
    const control = form.elements[field];
    if (!control) {
      return;
    }

    control.value = Array.isArray(value) ? value.join("\n") : value;
  });
}

function linesFromText(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function textFromLines(items) {
  return Array.isArray(items) ? items.join("\n") : "";
}

function createJobId() {
  return `job_${Date.now()}`;
}

function cleanValue(value) {
  return String(value || "").trim();
}

function setJobsStatus(message, state = "idle") {
  const node = document.querySelector("#jobs-applied-status");
  node.textContent = message;
  node.dataset.actionState = state;
}

function ensureJobsRoute() {
  if (!window.location.hash) {
    navigateToJobsRoute("dashboard");
  }
}

function currentJobsRoute() {
  const [, root, page, jobId] = window.location.hash.split("/");

  if (root !== "jobs") {
    return { page: "", jobId: "" };
  }

  const pageName = jobsPageAlias(page);

  return {
    page: knownJobsPage(pageName) ? pageName : "dashboard",
    jobId: jobId || "",
  };
}

function jobsPageAlias(page) {
  if (page === "add") {
    return "opportunity";
  }

  return page;
}

function knownJobsPage(page) {
  return [
    "dashboard",
    "opportunity",
    "add",
    "detail",
    "fit",
    "resume",
    "cover-letter",
    "packet",
    "studio",
    "tracker",
    "settings",
  ].includes(page);
}

function navigateToJobsRoute(page, jobId = "") {
  window.location.hash = `#/jobs/${page}${jobId ? `/${encodeURIComponent(jobId)}` : ""}`;
}

function updateSelectedJobLinks() {
  document.querySelectorAll("[data-selected-job-route]").forEach((link) => {
    const page = link.dataset.selectedJobRoute;
    link.href = `#/jobs/${page}${selectedJobId ? `/${encodeURIComponent(selectedJobId)}` : ""}`;
  });

  document.querySelectorAll("[data-jobs-route-link]").forEach((link) => {
    if (["opportunity", "detail", "fit", "resume", "cover-letter", "packet", "studio"].includes(link.dataset.jobsRouteLink)) {
      link.href = `#/jobs/${link.dataset.jobsRouteLink}${selectedJobId ? `/${encodeURIComponent(selectedJobId)}` : ""}`;
    }
  });
}

function detailRow(label, value, allowHtml = false) {
  const displayValue = value || "Not saved yet";
  return `<dt>${escapeHtml(label)}</dt><dd>${allowHtml ? displayValue : escapeHtml(displayValue)}</dd>`;
}

function placeholderBlock(title, text) {
  return `<div class="placeholder-block"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
}

function listOrPlaceholder(items, placeholder) {
  if (!Array.isArray(items) || !items.length) {
    return placeholder;
  }

  return items.join("; ");
}

function aiMetadataBlock(output = {}) {
  return placeholderBlock(
    "AI Output Metadata",
    `Generated at: ${formatValue(output.generatedAt)} | Prompt version: ${formatValue(output.promptVersion)} | Model: ${formatValue(output.modelName)} | User approved: ${output.userApproved ? "Yes" : "No"}`
  );
}

function emptyMessage(message) {
  return `<p class="empty-copy">${escapeHtml(message)}</p>`;
}

function formatValue(value) {
  return String(value || "").trim() || "Not saved yet";
}

function formatShortDateTime(value) {
  const text = cleanValue(value);
  if (!text) {
    return "Not saved yet";
  }

  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(text);
  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status) {
  return `<span class="status-badge ${statusClass(status)}">${escapeHtml(formatValue(status))}</span>`;
}

function statusClass(status) {
  return `status-${String(status || "unknown").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "unknown"}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

window.RightForMeJobsAppliedController = {
  initializeJobsAppliedController,
  generateResumeForSelectedJob: generateResumeForJob,
  selectedJob,
};
