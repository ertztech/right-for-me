const assert = require("node:assert/strict");

const {
  buildStoryCoachPrompt,
  parseStoryCoachResponse,
  validateStoryCoachResponse,
} = require("../src/jobsApplied/storyCoach");

function run() {
  const prompt = buildStoryCoachPrompt("I kept a project from slipping when the team was overwhelmed.");
  assert.match(prompt, /Return exactly this JSON shape/);
  assert.match(prompt, /I kept a project from slipping/);

  const valid = validateStoryCoachResponse({
    reflection: "This moment seems to have stayed with you because it asked you to steady something under pressure.",
    followUpQuestion: "What part of that moment felt most important to you while it was happening?",
    possibleSignal: "This may suggest that you often notice when a situation needs calm structure.",
  });
  assert.equal(typeof valid.reflection, "string");
  assert.equal(typeof valid.followUpQuestion, "string");
  assert.equal(typeof valid.possibleSignal, "string");

  const parsed = parseStoryCoachResponse(JSON.stringify(valid));
  assert.deepEqual(parsed, valid);

  assert.throws(
    () => validateStoryCoachResponse({ reflection: "a", followUpQuestion: "", possibleSignal: "c" }),
    /must include/
  );

  assert.throws(
    () => parseStoryCoachResponse("{not-json"),
    /valid JSON/
  );
}

run();
