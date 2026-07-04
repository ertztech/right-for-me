const assert = require("node:assert/strict");

const {
  generateFitReviewPrefill,
  mergeFitReviewPrefill,
} = require("../src/jobsApplied/fitReviewPrefill");

function strongAlignmentJob() {
  return {
    company: "Example Manufacturing",
    roleTitle: "Operations Transformation Lead",
    responsibilities: ["Lead transformation roadmap", "Improve operating metrics"],
    requiredSkills: ["Change management", "Stakeholder communication", "Operations leadership"],
    preferredSkills: ["Agile transformation"],
    technologies: ["Power BI", "Jira"],
    leadershipExpectations: ["Lead cross-functional stakeholders"],
    certifications: [],
    yearsExperience: "7+ years",
    workArrangement: "Hybrid",
    salaryRange: "$120,000 - $140,000",
    notes: "Strong match on transformation, metrics, and operations leadership.",
    sourcePostingText: "Lead transformation, metrics, agile delivery, and stakeholder communication.",
  };
}

function partialAlignmentJob() {
  return {
    company: "Example Software",
    roleTitle: "Technical Program Manager",
    responsibilities: ["Coordinate delivery roadmap"],
    requiredSkills: ["Software delivery", "SQL", "API integrations", "Cloud platforms", "Data analysis", "Vendor management"],
    preferredSkills: ["AI experience"],
    technologies: ["SQL"],
    leadershipExpectations: ["Partner with stakeholders"],
    certifications: [],
    yearsExperience: "8+ years",
    notes: "Some relevant delivery and stakeholder experience, but technical depth needs review.",
    sourcePostingText: "Requires cloud, API, SQL, and technical program delivery.",
  };
}

function weakAlignmentJob() {
  return {
    company: "Example Clinic",
    roleTitle: "Licensed Clinical Director",
    responsibilities: ["Manage clinical staff"],
    requiredSkills: ["Licensed clinical certification required", "15+ years of experience", "Healthcare compliance", "Clinical supervision", "State licensure", "Medical operations", "Patient care"],
    preferredSkills: [],
    technologies: [],
    leadershipExpectations: ["Senior executive leadership"],
    certifications: ["State license required"],
    yearsExperience: "15+ years",
    notes: "No experience with clinical licensure.",
    sourcePostingText: "Must be certified and license required. 15+ years of experience. Senior executive clinical leadership.",
  };
}

function run() {
  const strong = generateFitReviewPrefill(strongAlignmentJob());
  assert.equal(strong.recommendation, "Apply");
  assert.ok(strong.fitScore >= 72);
  assert.ok(strong.strengths.some((item) => item.includes("transformation")));

  const partial = generateFitReviewPrefill(partialAlignmentJob());
  assert.equal(partial.recommendation, "Maybe");
  assert.ok(partial.fitScore >= 48);
  assert.ok(partial.gaps.length > 0);

  const weak = generateFitReviewPrefill(weakAlignmentJob());
  assert.equal(weak.recommendation, "Skip");
  assert.ok(weak.fitScore < 48);
  assert.ok(weak.concerns.some((item) => item.includes("Certification")));

  const merged = mergeFitReviewPrefill(
    {
      fitScore: 88,
      recommendation: "Apply",
      strengths: ["User-entered strength"],
      gaps: [],
    },
    {
      fitScore: 60,
      recommendation: "Maybe",
      strengths: ["Extracted strength"],
      gaps: ["Extracted gap"],
    }
  );

  assert.equal(merged.fitScore, undefined);
  assert.equal(merged.recommendation, undefined);
  assert.equal(merged.strengths, undefined);
  assert.deepEqual(merged.gaps, ["Extracted gap"]);
}

run();
