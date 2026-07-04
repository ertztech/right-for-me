const assert = require("node:assert/strict");

const {
  extractJobIntelligence,
  mergeExtractedJobIntelligence,
} = require("../src/jobsApplied/jobIntelligenceExtractor");

const SAMPLE_POSTING = `
Location: Milwaukee, WI - Hybrid
Salary: $110,000 - $135,000

Responsibilities:
- Lead transformation roadmap across operations teams.
- Improve operating metrics and delivery cadence.

Required Qualifications:
- 7+ years of experience in operations transformation.
- Strong change management and stakeholder communication.

Preferred Qualifications:
- Manufacturing operations experience.
- Six Sigma certification preferred.

Tools and Technologies:
- Jira
- Power BI
- SQL

Leadership Expectations:
- Lead cross-functional leaders through change.
`;

function run() {
  const result = extractJobIntelligence(SAMPLE_POSTING);

  assert.deepEqual(result.responsibilities, [
    "Lead transformation roadmap across operations teams.",
    "Improve operating metrics and delivery cadence.",
  ]);

  assert.ok(result.requiredSkills.some((item) => item.includes("7+ years")));
  assert.ok(result.requiredSkills.some((item) => item.includes("change management")));
  assert.ok(result.preferredSkills.some((item) => item.includes("Manufacturing operations")));

  assert.equal(result.salaryRange, "$110,000 - $135,000");
  assert.equal(result.workArrangement, "Hybrid");
  assert.equal(result.yearsExperience, "7+ years of experience");

  assert.equal(extractJobIntelligence("This role is remote - US.").workArrangement, "Remote");
  assert.equal(extractJobIntelligence("This role is on-site in Chicago.").workArrangement, "On-site");

  assert.ok(result.technologies.includes("Jira"));
  assert.ok(result.technologies.includes("Power BI"));
  assert.ok(result.certifications.some((item) => item.includes("Six Sigma")));

  const updates = mergeExtractedJobIntelligence(
    {
      salaryRange: "$120,000",
      responsibilities: ["User-entered responsibility"],
      requiredSkills: [],
    },
    {
      salaryRange: "$110,000 - $135,000",
      responsibilities: ["Extracted responsibility"],
      requiredSkills: ["Extracted skill"],
    }
  );

  assert.equal(updates.salaryRange, undefined);
  assert.equal(updates.responsibilities, undefined);
  assert.deepEqual(updates.requiredSkills, ["Extracted skill"]);
}

run();
