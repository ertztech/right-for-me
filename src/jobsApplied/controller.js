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
const FIT_RECOMMENDATIONS = ["Apply", "Maybe", "Skip"];

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

  document.addEventListener("change", (event) => {
    const control = event.target.closest("[data-tracker-status]");
    if (!control) {
      return;
    }

    saveTrackerStatus(control);
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
    sourcePostingText: cleanValue(formData.get("sourcePostingText")),
    fitAnalysis: null,
    resumeDraft: null,
    coverLetterDraft: null,
  };

  try {
    RightForMeJobsAppliedStorage.addJobApplication(record);
    selectedJobId = record.id;
    form.reset();
    setJobsStatus("Job saved.");
    navigateToJobsRoute("detail", record.id);
  } catch (error) {
    setJobsStatus(error.message || "Job could not be saved.");
  }
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
    setJobsStatus("Choose a valid job status before saving.");
    return;
  }

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, updates);
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Job details saved. Your dashboard is up to date.");
  } catch (error) {
    setJobsStatus(error.message || "Job details could not be saved.");
  }
}

function saveFitReviewUpdates(form) {
  const formData = new FormData(form);
  const jobId = form.dataset.fitReviewForm;
  const score = cleanValue(formData.get("fitScore"));
  const recommendation = cleanValue(formData.get("fitRecommendation"));
  const validationError = validateFitReviewInput(score, recommendation);

  if (validationError) {
    setJobsStatus(validationError);
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
    setJobsStatus("Fit Review saved. NextMove updated the job detail and dashboard.");
  } catch (error) {
    setJobsStatus(error.message || "Fit Review could not be saved.");
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
    setJobsStatus(successMessage);
  } catch (error) {
    setJobsStatus(error.message || "Changes could not be saved.");
  }
}

function saveTrackerStatus(control) {
  const jobId = control.dataset.trackerStatus;
  const status = cleanValue(control.value);

  if (!isValidJobStatus(status)) {
    setJobsStatus("Choose a valid job status before saving.");
    refreshJobsAppliedViews();
    return;
  }

  try {
    RightForMeJobsAppliedStorage.updateJobApplication(jobId, { status });
    selectedJobId = jobId;
    refreshJobsAppliedViews();
    setJobsStatus("Status updated. NextMove refreshed your dashboard and tracker.");
  } catch (error) {
    setJobsStatus(error.message || "Status could not be updated.");
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
}

function renderJobsAppliedViews(jobs) {
  renderDashboard(jobs);
  renderJobDetail(currentJob(jobs));
  renderFitAnalysis(currentJob(jobs));
  renderResumeBuilder(currentJob(jobs));
  renderCoverLetterBuilder(currentJob(jobs));
  renderApplicationPacket(currentJob(jobs));
  renderTracker(jobs);
}

function renderDashboard(jobs) {
  renderStatusSummary("#jobs-status-summary", jobs);
  renderJobCards("#recent-jobs-list", recentJobs(jobs));
  renderNextActions(jobs);
}

function renderJobDetail(job) {
  const node = document.querySelector("#job-detail-content");
  if (!job) {
    node.innerHTML = emptyMessage("No opportunity selected yet. Start with Job Intake and NextMove will keep the next step clear.");
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

function renderFitAnalysis(job) {
  const node = document.querySelector("#fit-analysis-placeholder");
  if (!job) {
    node.innerHTML = emptyMessage("Fit Review will appear after an opportunity is saved. Start with Job Intake when you are ready.");
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
        <button type="submit">Save Fit Review</button>
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
    ${placeholderBlock("Tailored Summary", resumeDraft.tailoredSummary || "A tailored summary grounded in your Career Vault will appear here.")}
    ${placeholderBlock("Tailored Skills", listOrPlaceholder(resumeDraft.tailoredSkills, "Tailored skills will appear here."))}
    ${placeholderBlock("Tailored Experience Bullets", listOrPlaceholder(resumeDraft.tailoredExperienceBullets, "Experience bullets grounded in your Career Vault will appear here."))}
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
        <button type="submit">Save Resume Draft</button>
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

function renderTracker(jobs) {
  const node = document.querySelector("#application-tracker-list");
  if (!jobs.length) {
    node.innerHTML = emptyMessage("Saved opportunities will appear here by status. Add one role, then track the next move.");
    return;
  }

  node.innerHTML = JOB_STATUSES.map((status) => {
    const matchingJobs = jobs.filter((job) => job.status === status);
    if (!matchingJobs.length) {
      return "";
    }

    return `
      <div class="section-block">
        <h2>${status}</h2>
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
      <article class="${count ? "status-card" : "status-card muted-card"}">
        <span>${status}</span>
        <strong>${count}</strong>
        <p>${label}</p>
      </article>
    `;
  }).join("");
}

function renderJobCards(selector, jobs) {
  const node = document.querySelector(selector);
  node.innerHTML = jobs.length
    ? jobs.map((job) => jobCard(job, false, true)).join("")
    : emptyMessage("No saved opportunities yet. Paste one posting when you are ready, and NextMove will help you decide the next step.");
}

function renderNextActions(jobs) {
  const node = document.querySelector("#jobs-next-actions");
  const action = recommendedNextAction(jobs);
  node.innerHTML = `
    <article class="next-action-card">
      <p class="next-action-label">${escapeHtml(action.label)}</p>
      <h3>${escapeHtml(action.title)}</h3>
      <p>${escapeHtml(action.detail)}</p>
      <a class="small-button nav-link-button" href="${escapeAttribute(action.href)}">${escapeHtml(action.buttonText)}</a>
    </article>
  `;
}

function jobCard(job, includeDates = false, dashboardCard = false) {
  const summary = dashboardCard
    ? `<p>${escapeHtml(job.company)} | ${escapeHtml(job.status)} | Found: ${escapeHtml(formatValue(job.dateFound))}</p>`
    : `<p>${escapeHtml(formatValue(job.location))} | ${escapeHtml(formatValue(job.fitRecommendation))}</p>`;

  const dates = includeDates
    ? `<p>Found: ${escapeHtml(formatValue(job.dateFound))} | Applied: ${escapeHtml(formatValue(job.dateApplied))} | Follow-up: ${escapeHtml(formatValue(job.followUpDate))}</p>`
    : summary;

  return `
    <article class="job-card">
      <div>
        <h3>${escapeHtml(job.roleTitle)}</h3>
        <p>${escapeHtml(job.company)} | ${escapeHtml(job.status)}</p>
        ${dates}
      </div>
      <a class="small-button nav-link-button" href="#/jobs/detail/${escapeAttribute(job.id)}" data-select-job="${escapeAttribute(job.id)}">Open</a>
    </article>
  `;
}

function trackerJobCard(job) {
  return `
    <article class="job-card tracker-job-card">
      <div>
        <h3>${escapeHtml(job.roleTitle)}</h3>
        <p>${escapeHtml(job.company)} | Found: ${escapeHtml(formatValue(job.dateFound))}</p>
        <p>Applied: ${escapeHtml(formatValue(job.dateApplied))} | Follow-up: ${escapeHtml(formatValue(job.followUpDate))}</p>
      </div>
      <div class="tracker-card-actions">
        <label>
          Status
          <select data-tracker-status="${escapeAttribute(job.id)}">
            ${statusOptions(job.status)}
          </select>
        </label>
        <a class="small-button nav-link-button" href="#/jobs/detail/${escapeAttribute(job.id)}" data-select-job="${escapeAttribute(job.id)}">Open</a>
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
  navigateToJobsRoute("detail", selectedJobId);
});

function currentJob(jobs) {
  return jobs.find((job) => job.id === selectedJobId) || jobs[0] || null;
}

function findJobById(jobId) {
  return RightForMeJobsAppliedStorage.getJobApplications().find((job) => job.id === jobId) || null;
}

function recentJobs(jobs) {
  return [...jobs].sort((a, b) => String(b.dateFound || "").localeCompare(String(a.dateFound || ""))).slice(0, 5);
}

function recommendedNextAction(jobs) {
  if (!jobs.length) {
    return {
      label: "Start here",
      title: "Add your first job posting.",
      detail: "Paste a role you are considering so NextMove can help you review fit and organize the application work.",
      buttonText: "Start Job Intake",
      href: "#/jobs/add",
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
      "Open packet",
      incompleteApplyPacketJob,
      "packet"
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
      "Open packet",
      applyRecommendationJob,
      "packet"
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

  if (!FIT_RECOMMENDATIONS.includes(recommendation)) {
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
  return FIT_RECOMMENDATIONS.map((recommendation) => {
    const selected = recommendation === selectedRecommendation ? " selected" : "";
    return `<option value="${escapeAttribute(recommendation)}"${selected}>${escapeHtml(recommendation)}</option>`;
  }).join("");
}

function isValidJobStatus(status) {
  return JOB_STATUSES.includes(status);
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

function setJobsStatus(message) {
  document.querySelector("#jobs-applied-status").textContent = message;
}

function ensureJobsRoute() {
  if (!currentJobsRoute().page) {
    navigateToJobsRoute("dashboard");
  }
}

function currentJobsRoute() {
  const [, root, page, jobId] = window.location.hash.split("/");

  if (root !== "jobs") {
    return { page: "", jobId: "" };
  }

  return {
    page: knownJobsPage(page) ? page : "dashboard",
    jobId: jobId || "",
  };
}

function knownJobsPage(page) {
  return [
    "dashboard",
    "add",
    "detail",
    "fit",
    "resume",
    "cover-letter",
    "packet",
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
    if (["detail", "fit", "resume", "cover-letter", "packet"].includes(link.dataset.jobsRouteLink)) {
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
};
