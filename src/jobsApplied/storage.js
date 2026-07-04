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

  const nextRecords = [...records, record];
  saveJobApplications(nextRecords);
  return nextRecords;
}

function updateJobApplication(jobId, updates) {
  const records = getJobApplications();
  const index = records.findIndex((job) => job.id === jobId);

  if (index === -1) {
    throw new Error(`Job application not found: ${jobId}`);
  }

  const updated = { ...records[index], ...updates, id: jobId };
  validateJobApplication(updated);
  records[index] = updated;
  saveJobApplications(records);
  return updated;
}

function saveJobApplications(records) {
  localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(records, null, 2));
}

function validateJobApplication(record) {
  const missing = JOB_APPLICATION_REQUIRED_FIELDS.filter((field) => !String(record[field] || "").trim());

  if (missing.length) {
    throw new Error(`Missing required field(s): ${missing.join(", ")}`);
  }

  if (!JOB_APPLICATION_STATUSES.includes(record.status)) {
    throw new Error(`Invalid job status: ${record.status}`);
  }
}

window.RightForMeJobsAppliedStorage = {
  getJobApplications,
  addJobApplication,
  updateJobApplication,
};
