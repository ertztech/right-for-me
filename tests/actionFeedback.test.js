const assert = require("node:assert/strict");

global.window = global;

const { createActionFeedback } = require("../src/shared/actionFeedback");

function createButton() {
  return {
    textContent: "Run",
    disabled: false,
    dataset: {},
  };
}

async function run() {
  const button = createButton();
  const statusNode = { textContent: "", dataset: {} };
  const feedback = createActionFeedback({
    button,
    statusNode,
    workingText: "Working...",
    successText: "Done.",
    failureText: "Failed.",
  });

  assert.equal(button.dataset.actionState, "idle");

  await feedback.run(async () => {
    assert.equal(button.disabled, true);
    assert.equal(button.textContent, "Working...");
    assert.equal(statusNode.dataset.actionState, "working");
    return { message: "Saved." };
  });

  assert.equal(button.disabled, false);
  assert.equal(button.textContent, "Run");
  assert.equal(statusNode.dataset.actionState, "success");
  assert.equal(statusNode.textContent, "Saved.");

  const result = await feedback.run(() => {
    throw new Error("Nope.");
  });

  assert.equal(button.disabled, false);
  assert.equal(statusNode.dataset.actionState, "failure");
  assert.equal(statusNode.textContent, "Nope.");
  assert.ok(result.error);
}

run();
