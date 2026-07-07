const JOB_APPLICATIONS_STORAGE_KEY = "rightforme-job-applications";
const JOB_APPLICATION_REQUIRED_FIELDS = ["id", "company", "roleTitle", "status"];
const JOB_APPLICATION_STATUSES = [
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
const FIT_RECOMMENDATIONS = ["Apply", "Maybe", "Skip"];

function getJobApplications() {
  const saved = localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const records = JSON.parse(saved);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function addJobApplication(record) {
  validateJobApplication(record);

  const records = getJobApplications();
  if (records.some((job) => job.id === record.id)) {
    throw new Error(`Job application already exists: ${record.id}`);
  }

  const timestampedRecord = {
    ...record,
    updatedAt: record.updatedAt || new Date().toISOString(),
  };
  const nextRecords = [...records, timestampedRecord];
  saveJobApplications(nextRecords);
  return nextRecords;
}

function updateJobApplication(jobId, updates) {
  const records = getJobApplications();
  const index = records.findIndex((job) => job.id === jobId);

  if (index === -1) {
    throw new Error(`Job application not found: ${jobId}`);
  }

  const updated = { ...records[index], ...updates, id: jobId, updatedAt: new Date().toISOString() };
  validateJobApplication(updated);
  records[index] = updated;
  saveJobApplications(records);
  return updated;
}

function saveJobApplications(records) {
  localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(records, null, 2));
}

function replaceJobApplications(records) {
  records.forEach(validateJobApplication);
  saveJobApplications(records);
  return records;
}

function validateJobApplication(record) {
  const missing = JOB_APPLICATION_REQUIRED_FIELDS.filter((field) => !String(record[field] || "").trim());

  if (missing.length) {
    throw new Error(`Missing required field(s): ${missing.join(", ")}`);
  }

  if (!JOB_APPLICATION_STATUSES.includes(record.status)) {
    throw new Error(`Invalid job status: ${record.status}`);
  }

  validateFitReview(record);
}

function validateFitReview(record) {
  const score = record.fitAnalysis?.fitScore ?? record.fitScore;
  const recommendation = record.fitAnalysis?.recommendation ?? record.fitRecommendation;

  if (String(score || "").trim()) {
    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
      throw new Error("Fit score must be a number from 0 to 100.");
    }
  }

  if (String(recommendation || "").trim() && !FIT_RECOMMENDATIONS.includes(recommendation)) {
    throw new Error(`Invalid fit recommendation: ${recommendation}`);
  }
}

window.RightForMeJobsAppliedStorage = {
  getJobApplications,
  addJobApplication,
  updateJobApplication,
  replaceJobApplications,
};
