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

let selectedJobId = "";

function initializeJobsAppliedController() {
  const addJobForm = document.querySelector("#add-job-form");

  addJobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveJobFromForm(addJobForm);
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

function handleJobsRouteChange() {
  const route = currentJobsRoute();
  const jobs = RightForMeJobsAppliedStorage.getJobApplications();
  selectedJobId = route.jobId || selectedJobId || jobs[0]?.id || "";

  renderJobsAppliedViews(jobs);
  showJobsPage(route.page);
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
    node.innerHTML = emptyMessage("No job selected yet. Add a job to see its detail page.");
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
    <div class="section-block">
      <h2>Notes</h2>
      <p>${escapeHtml(job.notes || "No notes yet.")}</p>
    </div>
  `;

  updateSelectedJobLinks();
}

function renderFitAnalysis(job) {
  const node = document.querySelector("#fit-analysis-placeholder");
  if (!job) {
    node.innerHTML = emptyMessage("Fit analysis will appear after a job is saved.");
    return;
  }

  const fitAnalysis = job.fitAnalysis || {};

  node.innerHTML = `
    <div class="score-grid">
      <article><span>Fit Score</span><strong>${escapeHtml(formatValue(fitAnalysis.fitScore || job.fitScore))}</strong></article>
      <article><span>Recommendation</span><strong>${escapeHtml(formatValue(fitAnalysis.recommendation || job.fitRecommendation))}</strong></article>
      <article><span>Status</span><strong>${escapeHtml(job.status)}</strong></article>
    </div>
    ${placeholderBlock("Strengths", listOrPlaceholder(fitAnalysis.strengths, "AI-generated strengths will appear here after fit analysis is wired."))}
    ${placeholderBlock("Gaps", listOrPlaceholder(fitAnalysis.gaps, "AI-generated gaps will appear here."))}
    ${placeholderBlock("Concerns", listOrPlaceholder(fitAnalysis.concerns, "AI-generated concerns and tradeoffs will appear here."))}
    ${placeholderBlock("Suggested Positioning", fitAnalysis.suggestedPositioning || "Apply, Maybe, or Skip positioning will appear here.")}
    ${aiMetadataBlock(fitAnalysis)}
  `;
}

function renderResumeBuilder(job) {
  if (!job) {
    document.querySelector("#jobs-resume-placeholder").innerHTML = emptyMessage("Save a job before reviewing tailored resume output.");
    return;
  }

  const resumeDraft = job.resumeDraft || {};
  document.querySelector("#jobs-resume-placeholder").innerHTML = `
    ${placeholderBlock("Tailored Summary", resumeDraft.tailoredSummary || "AI-generated tailored summary will appear here.")}
    ${placeholderBlock("Tailored Skills", listOrPlaceholder(resumeDraft.tailoredSkills, "AI-generated tailored skills will appear here."))}
    ${placeholderBlock("Tailored Experience Bullets", listOrPlaceholder(resumeDraft.tailoredExperienceBullets, "AI-generated experience bullets will appear here."))}
    ${placeholderBlock("Markdown Preview", resumeDraft.markdownPreview || job.resumeVersionPath || "Markdown resume preview placeholder.")}
    ${aiMetadataBlock(resumeDraft)}
  `;
}

function renderCoverLetterBuilder(job) {
  if (!job) {
    document.querySelector("#jobs-cover-letter-placeholder").innerHTML = emptyMessage("Save a job before reviewing cover letter output.");
    return;
  }

  const coverLetterDraft = job.coverLetterDraft || {};
  document.querySelector("#jobs-cover-letter-placeholder").innerHTML = `
    ${placeholderBlock("Draft Cover Letter", coverLetterDraft.draftText || job.coverLetterPath || "AI-generated draft cover letter will appear here.")}
    ${placeholderBlock("Tone Note", coverLetterDraft.toneNote || "Tone target: warm, friendly, confident, and human.")}
    ${placeholderBlock("User Approval Status", coverLetterDraft.userApproved ? "Approved by user." : "Not approved yet.")}
    ${aiMetadataBlock(coverLetterDraft)}
  `;
}

function renderApplicationPacket(job) {
  document.querySelector("#jobs-packet-placeholder").innerHTML = job
    ? `
      ${placeholderBlock("Job Details", `${job.company} - ${job.roleTitle}`)}
      ${placeholderBlock("Resume", job.resumeVersionPath || "Resume output will connect here.")}
      ${placeholderBlock("Cover Letter", job.coverLetterPath || "Cover letter output will connect here.")}
      ${placeholderBlock("Application Notes", job.notes || "Application notes will connect here.")}
      <button type="button" class="secondary-button" disabled>Export packet later</button>
    `
    : emptyMessage("Save a job before building an application packet.");
}

function renderTracker(jobs) {
  const node = document.querySelector("#application-tracker-list");
  if (!jobs.length) {
    node.innerHTML = emptyMessage("Saved jobs will appear here by status.");
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
          ${matchingJobs.map((job) => jobCard(job, true)).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderStatusSummary(selector, jobs) {
  const node = document.querySelector(selector);
  const statuses = JOB_STATUSES.filter((status) => jobs.some((job) => job.status === status));

  node.innerHTML = statuses.length
    ? statuses.map((status) => `<article><span>${status}</span><strong>${jobs.filter((job) => job.status === status).length}</strong></article>`).join("")
    : `<article><span>No jobs yet</span><strong>0</strong></article>`;
}

function renderJobCards(selector, jobs) {
  const node = document.querySelector(selector);
  node.innerHTML = jobs.length
    ? jobs.map((job) => jobCard(job)).join("")
    : emptyMessage("No saved jobs yet.");
}

function renderNextActions(jobs) {
  const node = document.querySelector("#jobs-next-actions");
  if (!jobs.length) {
    node.innerHTML = "<li>Add a job posting to start the workflow.</li>";
    return;
  }

  const actions = jobs
    .filter((job) => ["Found", "Reviewing", "Apply", "Applied", "Interviewing"].includes(job.status))
    .slice(0, 5)
    .map((job) => `<li>${escapeHtml(nextActionFor(job))}</li>`);

  node.innerHTML = actions.length ? actions.join("") : "<li>No active next actions right now.</li>";
}

function jobCard(job, includeDates = false) {
  const dates = includeDates
    ? `<p>Found: ${formatValue(job.dateFound)} | Applied: ${formatValue(job.dateApplied)} | Follow-up: ${formatValue(job.followUpDate)}</p>`
    : `<p>${escapeHtml(formatValue(job.location))} | ${escapeHtml(formatValue(job.fitRecommendation))}</p>`;

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

function recentJobs(jobs) {
  return [...jobs].sort((a, b) => String(b.dateFound || "").localeCompare(String(a.dateFound || ""))).slice(0, 5);
}

function nextActionFor(job) {
  if (job.status === "Found") return `Review ${job.roleTitle} at ${job.company}.`;
  if (job.status === "Reviewing") return `Run fit analysis for ${job.roleTitle}.`;
  if (job.status === "Apply") return `Generate packet for ${job.roleTitle}.`;
  if (job.status === "Applied") return `Check follow-up date for ${job.roleTitle}.`;
  return `Prepare for ${job.roleTitle}.`;
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
