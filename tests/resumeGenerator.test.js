const assert = require("node:assert/strict");

global.window = global;

require("../src/resume/builder");
require("../src/resume/markdown");
require("../src/tailoring/matcher");
require("../src/tailoring/tailoredResume");
require("../src/resume/generator");

const draft = NextMoveResumeGenerator.generateResumeDraft({
  careerVault: {
    person: { name: "Alex Builder", location: "Milwaukee", email: "alex@example.com", phone: "" },
    roles: [
      {
        company: "OpsCo",
        title: "Transformation Lead",
        start: "2020",
        end: "Present",
        summary: "Led transformation roadmap and improved delivery metrics",
      },
    ],
    skills: ["Operations transformation", "Change management", "Technical delivery"],
    tools: ["Power BI", "Jira"],
    accomplishments: ["Improved delivery cadence by 30%"],
  },
  job: {
    company: "FutureCo",
    roleTitle: "Operations Transformation Manager",
    requiredSkills: ["change management", "metrics"],
    technologies: ["Power BI"],
    fitAnalysis: {
      recommendation: "Apply",
      strengths: ["Strong transformation and metrics alignment"],
    },
    sourcePostingText: "Lead operations transformation, change management, metrics, and Power BI reporting.",
  },
  backgroundNotes: "Built reporting workflows and coached teams.",
});

assert.equal(draft.modelName, "local-deterministic");
assert.equal(draft.promptVersion, "resume-generation-mvp-local-v1");
assert.ok(draft.markdownContent.includes("# Alex Builder"));
assert.ok(draft.markdownContent.includes("Operations transformation"));
assert.ok(draft.tailoredSkills.includes("Power BI"));
assert.ok(draft.tailoredExperienceBullets.some((item) => item.includes("transformation")));
assert.equal(draft.sourceContext.company, "FutureCo");
