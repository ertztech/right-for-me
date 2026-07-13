const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createJourneyHarness() {
  const nodes = new Map();
  let dynamicVersion = 0;
  const dynamicCache = new Map();

  function invalidateDynamicNodes() {
    dynamicVersion += 1;
    dynamicCache.clear();
  }

  function createBaseNode(selector) {
    let innerHTML = "";
    return {
      selector,
      textContent: "",
      value: "",
      dataset: {},
      style: {},
      disabled: false,
      handlers: {},
      classList: { toggle() {} },
      scrollIntoView() {},
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      click() {
        this.handlers.click?.({ target: this });
      },
      set innerHTML(value) {
        innerHTML = value;
        invalidateDynamicNodes();
      },
      get innerHTML() {
        return innerHTML;
      },
    };
  }

  function ensureNode(selector) {
    if (!nodes.has(selector)) {
      nodes.set(selector, createBaseNode(selector));
    }

    return nodes.get(selector);
  }

  function decodeHtml(value = "") {
    return String(value)
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }

  function extractAttribute(html, name) {
    const match = html.match(new RegExp(`${name}="([\\s\\S]*?)"`));
    return decodeHtml(match?.[1] || "");
  }

  function extractTextareaValue(html, name) {
    const match = html.match(new RegExp(`<textarea[^>]*name="${name}"[^>]*>([\\s\\S]*?)<\\/textarea>`));
    return decodeHtml(match?.[1] || "");
  }

  function extractInputValue(html, name) {
    const match = html.match(new RegExp(`<input[^>]*name="${name}"[^>]*value="([\\s\\S]*?)"[^>]*>`));
    return decodeHtml(match?.[1] || "");
  }

  function createDynamicNode(selector, build) {
    const cacheKey = `${dynamicVersion}:${selector}`;
    if (!dynamicCache.has(cacheKey)) {
      dynamicCache.set(cacheKey, build());
    }

    return dynamicCache.get(cacheKey);
  }

  function createButton(selector) {
    return {
      selector,
      dataset: {},
      disabled: false,
      handlers: {},
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      click() {
        this.handlers.click?.({ target: this });
      },
    };
  }

  function createForm(selector, fields) {
    return {
      selector,
      dataset: {},
      elements: fields,
      handlers: {},
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      submit() {
        this.handlers.submit?.({ preventDefault() {}, target: this });
      },
    };
  }

  const documentStub = {
    addEventListener() {},
    querySelector(selector) {
      const journeyNode = ensureNode("#career-journey-content");
      const html = journeyNode.innerHTML;

      if (selector === "[data-start-career-journey]") {
        return html.includes("data-start-career-journey")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-edit-career-journey-chapter-one]") {
        return html.includes("data-edit-career-journey-chapter-one")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-start-career-journey-chapter-two]") {
        return html.includes("data-start-career-journey-chapter-two")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-edit-career-journey-chapter-two]") {
        return html.includes("data-edit-career-journey-chapter-two")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-form]") {
        if (!html.includes("data-career-journey-form")) {
          return null;
        }

        return createDynamicNode(selector, () => createForm(selector, {
          chapterOneResponse: {
            value: extractTextareaValue(html, "chapterOneResponse"),
          },
        }));
      }

      if (selector === "[data-career-journey-chapter-two-form]") {
        if (!html.includes("data-career-journey-chapter-two-form")) {
          return null;
        }

        return createDynamicNode(selector, () => createForm(selector, {
          seasonTitle: { value: extractInputValue(html, "seasonTitle") },
          organization: { value: extractInputValue(html, "organization") },
          startYear: { value: extractInputValue(html, "startYear") },
          endYear: { value: extractInputValue(html, "endYear") },
          seasonReflection: {
            value: extractTextareaValue(html, "seasonReflection"),
          },
        }));
      }

      return ensureNode(selector);
    },
    querySelectorAll(selector) {
      if (selector === "[data-jobs-page]") {
        return [
          { dataset: { jobsPage: "dashboard" }, classList: { toggle() {} }, scrollIntoView() {} },
          { dataset: { jobsPage: "journey" }, classList: { toggle() {} }, scrollIntoView() {} },
        ];
      }

      if (selector === "[data-jobs-route-link]") {
        return [
          { dataset: { jobsRouteLink: "dashboard" }, classList: { toggle() {} } },
          { dataset: { jobsRouteLink: "journey" }, classList: { toggle() {} } },
        ];
      }

      return [];
    },
  };

  const context = {
    console,
    document: documentStub,
    window: null,
    localStorage: {
      getItem: () => null,
      setItem() {},
    },
    navigator: {
      clipboard: {
        writeText: async () => {},
      },
    },
    location: {
      hash: "#/jobs/journey",
    },
    RightForMeJobsAppliedStorage: {
      getJobApplications: () => [],
      updateJobApplication() {
        throw new Error("Job storage updates are not expected in Career Journey regression tests.");
      },
      addJobApplication() {
        throw new Error("Job creation is not expected in Career Journey regression tests.");
      },
    },
    RightForMeCareerVault: {
      getVault: () => ({}),
    },
    RightForMeJobIntelligenceExtractor: {
      extractJobIntelligence: () => ({}),
      mergeExtractedJobIntelligence: () => ({}),
    },
    RightForMeAIJobAnalysis: {
      validateAIJobAnalysis: (analysis) => analysis,
      mergeAIJobAnalysis: () => ({}),
    },
    RightForMeFitReviewPrefill: {
      generateFitReviewPrefill: () => ({}),
      mergeFitReviewPrefill: () => ({}),
    },
    RightForMeCoverLetterBuilder: {
      buildCoverLetter: () => ({}),
    },
    RightForMeCoverLetterRenderer: {
      renderCoverLetterMarkdown: () => "",
    },
    fetch: async () => {
      throw new Error("Network calls are not expected in Career Journey regression tests.");
    },
    FormData,
    CustomEvent,
  };

  context.window = context;
  context.window.addEventListener = () => {};
  context.window.dispatchEvent = () => {};
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "../src/jobsApplied/controller.js"), "utf8"),
    context
  );

  ensureNode("#career-journey-content");
  ensureNode("#jobs-applied-status");

  return {
    context,
    get journeyHtml() {
      return ensureNode("#career-journey-content").innerHTML;
    },
    get statusNode() {
      return ensureNode("#jobs-applied-status");
    },
    click(selector) {
      const node = documentStub.querySelector(selector);
      assert.ok(node, `Expected control ${selector} to be present.`);
      node.click();
    },
    submitChapterOne(value) {
      const form = documentStub.querySelector("[data-career-journey-form]");
      assert.ok(form, "Expected Chapter 1 form to be present.");
      form.elements.chapterOneResponse.value = value;
      form.submit();
    },
    submitChapterTwo(values = {}) {
      const form = documentStub.querySelector("[data-career-journey-chapter-two-form]");
      assert.ok(form, "Expected Chapter 2 form to be present.");
      form.elements.seasonTitle.value = values.seasonTitle ?? form.elements.seasonTitle.value;
      form.elements.organization.value = values.organization ?? form.elements.organization.value;
      form.elements.startYear.value = values.startYear ?? form.elements.startYear.value;
      form.elements.endYear.value = values.endYear ?? form.elements.endYear.value;
      form.elements.seasonReflection.value = values.seasonReflection ?? form.elements.seasonReflection.value;
      form.submit();
    },
    render() {
      context.renderCareerJourney();
      context.bindCareerJourneyActions();
    },
  };
}

function countMatches(text, needle) {
  return (text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

const journey = createJourneyHarness();

journey.render();
assert.ok(journey.journeyHtml.includes("Chapter 1 of 5"));
assert.ok(journey.journeyHtml.includes("Journey not started yet."));
assert.ok(journey.journeyHtml.includes("Current chapter"));
assert.ok(journey.journeyHtml.includes("Upcoming"));

journey.click("[data-start-career-journey]");
assert.equal(journey.statusNode.textContent, "Career Journey started. Chapter 1 is ready for guided reflection.");
assert.equal(journey.statusNode.dataset.actionState, "success");
assert.ok(journey.journeyHtml.includes("Chapter 1 is in progress."));

journey.submitChapterOne("");
assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
assert.equal(journey.statusNode.dataset.actionState, "idle");
assert.ok(journey.journeyHtml.includes("Chapter 1 is in progress."));
assert.ok(journey.journeyHtml.includes("Chapter 1 is now in motion, even if you are still finding the words."));
assert.ok(!journey.journeyHtml.includes("Chapter 2 preview"));

journey.submitChapterOne("   ");
assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
assert.ok(journey.journeyHtml.includes("Chapter 1 is in progress."));
assert.ok(!journey.journeyHtml.includes("<blockquote class=\"journey-reflection-echo\">"));

journey.submitChapterOne("I am ready to reconnect my operations work with roles that value calmer leadership.");
assert.equal(journey.statusNode.textContent, "Chapter 1 reflection captured for this session.");
assert.equal(journey.statusNode.dataset.actionState, "success");
assert.ok(journey.journeyHtml.includes("Chapter 2 of 5"));
assert.ok(journey.journeyHtml.includes("Chapter 2 is available when you are ready."));
assert.ok(journey.journeyHtml.includes("Chapter 1 reflection"));
assert.ok(journey.journeyHtml.includes("I am ready to reconnect my operations work with roles that value calmer leadership."));
assert.ok(journey.journeyHtml.includes("Complete"));
assert.ok(journey.journeyHtml.includes("Available next"));

journey.click("[data-edit-career-journey-chapter-one]");
assert.equal(journey.statusNode.textContent, "You can revise this reflection whenever you are ready.");
assert.ok(journey.journeyHtml.includes("Save Reflection"));
const chapterOneEditForm = journey.context.document.querySelector("[data-career-journey-form]");
assert.equal(
  chapterOneEditForm.elements.chapterOneResponse.value,
  "I am ready to reconnect my operations work with roles that value calmer leadership."
);

journey.submitChapterOne("I want to tell a clearer story about change leadership and measurable delivery.");
assert.ok(journey.journeyHtml.includes("I want to tell a clearer story about change leadership and measurable delivery."));
assert.ok(!journey.journeyHtml.includes("I am ready to reconnect my operations work with roles that value calmer leadership."));

journey.click("[data-edit-career-journey-chapter-one]");
journey.submitChapterOne("   ");
assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
assert.ok(journey.journeyHtml.includes("Chapter 1 is in progress."));
assert.ok(journey.journeyHtml.includes("Current chapter"));
assert.ok(journey.journeyHtml.includes("Upcoming"));
assert.ok(!journey.journeyHtml.includes("Available next"));
assert.ok(!journey.journeyHtml.includes("I want to tell a clearer story about change leadership and measurable delivery."));

journey.submitChapterOne("I am rebuilding momentum after a transition year.");
assert.ok(journey.journeyHtml.includes("I am rebuilding momentum after a transition year."));
assert.ok(!journey.journeyHtml.includes("I want to tell a clearer story about change leadership and measurable delivery."));
assert.ok(journey.journeyHtml.includes("Chapter 2 is available when you are ready."));

journey.click("[data-start-career-journey-chapter-two]");
assert.equal(journey.statusNode.textContent, "Chapter 2 is ready for one career season.");
assert.ok(journey.journeyHtml.includes("Chapter 2 is in progress."));
assert.ok(journey.journeyHtml.includes("Role or career season"));

journey.submitChapterTwo({
  seasonTitle: "   ",
  organization: "Northwind Labs",
  startYear: "2022",
  endYear: "2024",
  seasonReflection: "Built calmer systems after a volatile stretch.",
});
assert.equal(journey.statusNode.textContent, "Add a role or career season before saving Chapter 2.");
assert.equal(journey.statusNode.dataset.actionState, "failure");
assert.ok(journey.journeyHtml.includes("Role or career season is required before you continue."));
assert.ok(journey.journeyHtml.includes("Chapter 2 is in progress."));

journey.submitChapterTwo({
  seasonTitle: "Operations Lead",
  organization: "Northwind Labs",
  startYear: "2022",
  endYear: "2024",
  seasonReflection: "Built calmer systems after a volatile stretch.",
});
assert.equal(journey.statusNode.textContent, "Chapter 2 career season captured for this session.");
assert.equal(journey.statusNode.dataset.actionState, "success");
assert.ok(journey.journeyHtml.includes("Chapter 2 is complete for this session."));
assert.ok(journey.journeyHtml.includes("<strong>Operations Lead</strong>"));
assert.ok(journey.journeyHtml.includes("Northwind Labs"));
assert.ok(journey.journeyHtml.includes("2022 - 2024"));
assert.ok(journey.journeyHtml.includes("Built calmer systems after a volatile stretch."));
assert.ok(journey.journeyHtml.includes("Complete"));

journey.click("[data-edit-career-journey-chapter-two]");
assert.equal(journey.statusNode.textContent, "You can revise this career season whenever you are ready.");
assert.ok(journey.journeyHtml.includes("Update Career Season"));
const chapterTwoEditForm = journey.context.document.querySelector("[data-career-journey-chapter-two-form]");
assert.equal(chapterTwoEditForm.elements.seasonTitle.value, "Operations Lead");
assert.equal(chapterTwoEditForm.elements.organization.value, "Northwind Labs");
assert.equal(chapterTwoEditForm.elements.startYear.value, "2022");
assert.equal(chapterTwoEditForm.elements.endYear.value, "2024");
assert.equal(chapterTwoEditForm.elements.seasonReflection.value, "Built calmer systems after a volatile stretch.");

journey.submitChapterTwo({
  seasonTitle: "Career Transition",
  organization: "",
  startYear: "",
  endYear: "Present",
  seasonReflection: "",
});
assert.ok(journey.journeyHtml.includes("<strong>Career Transition</strong>"));
assert.ok(!journey.journeyHtml.includes("Operations Lead"));
assert.ok(journey.journeyHtml.includes("Present"));
assert.ok(!journey.journeyHtml.includes("Northwind Labs"));
assert.ok(!journey.journeyHtml.includes("What mattered about this season?"));
assert.equal(countMatches(journey.journeyHtml, "<strong>Career Transition</strong>"), 1);
assert.equal(journey.statusNode.textContent, "Chapter 2 career season captured for this session.");
assert.ok(journey.journeyHtml.includes("Chapter 2 is complete for this session."));
