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

  function createButton(selector, dataset = {}) {
    return {
      selector,
      dataset,
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
          ? createDynamicNode("[data-start-career-journey]:0", () => createButton(selector))
          : null;
      }

      if (selector === "[data-start-career-journey-current]") {
        return html.includes("data-start-career-journey-current")
          ? createDynamicNode("[data-start-career-journey-current]", () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-toggle-navigation]") {
        return html.includes("data-career-journey-toggle-navigation")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-close-workspace]") {
        return html.includes("data-career-journey-close-workspace")
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

      if (selector === "[data-career-journey-explore-story]") {
        return html.includes("data-career-journey-explore-story")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-retry-story]") {
        return html.includes("data-career-journey-retry-story")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-save-moment]") {
        return html.includes("data-career-journey-save-moment")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-edit-story]") {
        return html.includes("data-career-journey-edit-story")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-start-over]") {
        return html.includes("data-career-journey-start-over")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-toggle-context]") {
        const match = html.match(/data-career-journey-toggle-context="([^"]+)"/);
        return match
          ? createDynamicNode("[data-career-journey-toggle-context]", () => createButton(selector, { careerJourneyToggleContext: match[1] }))
          : null;
      }

      if (selector === '[data-career-journey-toggle-context="different"]') {
        return html.includes('data-career-journey-toggle-context="different"')
          ? createDynamicNode("[data-career-journey-toggle-context]", () => createButton(selector, { careerJourneyToggleContext: "different" }))
          : null;
      }

      if (selector === '[data-career-journey-toggle-context="timeline"]') {
        return html.includes('data-career-journey-toggle-context="timeline"')
          ? createDynamicNode("[data-career-journey-toggle-context]", () => createButton(selector, { careerJourneyToggleContext: "timeline" }))
          : null;
      }

      if (selector === "[data-career-journey-add-moment]") {
        return html.includes("data-career-journey-add-moment")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-done-for-now]") {
        return html.includes("data-career-journey-done-for-now")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-back-to-moments]") {
        return html.includes("data-career-journey-back-to-moments")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === '[data-career-journey-view-moment="journey_moment_1"]') {
        return html.includes('data-career-journey-view-moment="journey_moment_1"')
          ? createDynamicNode('[data-career-journey-view-moment]:journey_moment_1', () => createButton(selector, { careerJourneyViewMoment: "journey_moment_1" }))
          : null;
      }

      if (selector === '[data-career-journey-view-moment="journey_moment_2"]') {
        return html.includes('data-career-journey-view-moment="journey_moment_2"')
          ? createDynamicNode('[data-career-journey-view-moment]:journey_moment_2', () => createButton(selector, { careerJourneyViewMoment: "journey_moment_2" }))
          : null;
      }

      if (selector === '[data-career-journey-edit-moment="journey_moment_1"]') {
        return html.includes('data-career-journey-edit-moment="journey_moment_1"')
          ? createDynamicNode('[data-career-journey-edit-moment]:journey_moment_1', () => createButton(selector, { careerJourneyEditMoment: "journey_moment_1" }))
          : null;
      }

      if (selector === '[data-career-journey-edit-moment="journey_moment_2"]') {
        return html.includes('data-career-journey-edit-moment="journey_moment_2"')
          ? createDynamicNode('[data-career-journey-edit-moment]:journey_moment_2', () => createButton(selector, { careerJourneyEditMoment: "journey_moment_2" }))
          : null;
      }

      if (selector === '[data-career-journey-open-chapter="1"]') {
        return html.includes('data-career-journey-open-chapter="1"')
          ? createDynamicNode('[data-career-journey-open-chapter]:1', () => createButton(selector, { careerJourneyOpenChapter: "1" }))
          : null;
      }

      if (selector === '[data-career-journey-open-chapter="2"]') {
        return html.includes('data-career-journey-open-chapter="2"')
          ? createDynamicNode('[data-career-journey-open-chapter]:2', () => createButton(selector, { careerJourneyOpenChapter: "2" }))
          : null;
      }

      if (selector === '[data-career-journey-open-chapter="3"]') {
        return html.includes('data-career-journey-open-chapter="3"')
          ? createDynamicNode('[data-career-journey-open-chapter]:3', () => createButton(selector, { careerJourneyOpenChapter: "3" }))
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
          timelineEntryId: { value: extractInputValue(html, "timelineEntryId") },
          seasonTitle: { value: extractInputValue(html, "seasonTitle") },
          organization: { value: extractInputValue(html, "organization") },
          startYear: { value: extractInputValue(html, "startYear") },
          endYear: { value: extractInputValue(html, "endYear") },
          seasonReflection: {
            value: extractTextareaValue(html, "seasonReflection"),
          },
        }));
      }

      if (selector === 'textarea[name="chapterOneResponse"]') {
        if (!html.includes('name="chapterOneResponse"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractTextareaValue(html, "chapterOneResponse"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
          dispatchInput(value) {
            this.value = value;
            this.handlers.input?.({ target: this });
          },
        }));
      }

      if (selector === '[name="timelineEntryId"]') {
        if (!html.includes('name="timelineEntryId"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractInputValue(html, "timelineEntryId"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
        }));
      }

      if (selector === '[name="seasonTitle"]') {
        if (!html.includes('name="seasonTitle"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractInputValue(html, "seasonTitle"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
        }));
      }

      if (selector === '[name="organization"]') {
        if (!html.includes('name="organization"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractInputValue(html, "organization"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
        }));
      }

      if (selector === '[name="startYear"]') {
        if (!html.includes('name="startYear"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractInputValue(html, "startYear"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
        }));
      }

      if (selector === '[name="endYear"]') {
        if (!html.includes('name="endYear"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractInputValue(html, "endYear"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
        }));
      }

      if (selector === '[name="seasonReflection"]') {
        if (!html.includes('name="seasonReflection"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractTextareaValue(html, "seasonReflection"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
        }));
      }

      if (selector === 'textarea[name="chapterThreeInitialResponse"]') {
        if (!html.includes('name="chapterThreeInitialResponse"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractTextareaValue(html, "chapterThreeInitialResponse"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
          dispatchInput(value) {
            this.value = value;
            this.handlers.input?.({ target: this });
          },
        }));
      }

      if (selector === 'textarea[name="chapterThreeFollowUpResponse"]') {
        if (!html.includes('name="chapterThreeFollowUpResponse"')) {
          return null;
        }

        return createDynamicNode(selector, () => ({
          selector,
          dataset: {},
          value: extractTextareaValue(html, "chapterThreeFollowUpResponse"),
          handlers: {},
          addEventListener(eventName, handler) {
            this.handlers[eventName] = handler;
          },
          dispatchInput(value) {
            this.value = value;
            this.handlers.input?.({ target: this });
          },
        }));
      }

      return ensureNode(selector);
    },
    querySelectorAll(selector) {
      const journeyNode = ensureNode("#career-journey-content");
      const html = journeyNode.innerHTML;

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

      if (selector === "[data-career-journey-voice-start]") {
        return [];
      }

      if (selector === "[data-career-journey-view-moment]") {
        const matches = [...html.matchAll(/data-career-journey-view-moment="([^"]+)"/g)];
        return matches.map((match) => createDynamicNode(`[data-career-journey-view-moment]:${match[1]}`, () => createButton(selector, { careerJourneyViewMoment: match[1] })));
      }

      if (selector === "[data-career-journey-edit-moment]") {
        const matches = [...html.matchAll(/data-career-journey-edit-moment="([^"]+)"/g)];
        return matches.map((match) => createDynamicNode(`[data-career-journey-edit-moment]:${match[1]}`, () => createButton(selector, { careerJourneyEditMoment: match[1] })));
      }

      if (selector === "[data-career-journey-open-chapter]") {
        const matches = [...html.matchAll(/data-career-journey-open-chapter="([^"]+)"/g)];
        return matches.map((match) => createDynamicNode(`[data-career-journey-open-chapter]:${match[1]}`, () => createButton(selector, { careerJourneyOpenChapter: match[1] })));
      }

      if (selector === "[data-start-career-journey]") {
        const matches = [...html.matchAll(/data-start-career-journey/g)];
        return matches.map((_, index) => createDynamicNode(`[data-start-career-journey]:${index}`, () => createButton(selector)));
      }

      if (selector === "[data-start-career-journey-current]") {
        return html.includes("data-start-career-journey-current")
          ? [createDynamicNode("[data-start-career-journey-current]", () => createButton(selector))]
          : [];
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
    confirm: () => true,
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
    RightForMeStoryCoach: {
      validateStoryCoachResponse: (analysis) => {
        if (!analysis || typeof analysis !== "object") {
          throw new Error("Malformed AI response.");
        }

        if (typeof analysis.reflection !== "string" || typeof analysis.followUpQuestion !== "string" || typeof analysis.possibleSignal !== "string") {
          throw new Error("Malformed AI response.");
        }

        if (!analysis.reflection.trim() || !analysis.followUpQuestion.trim() || !analysis.possibleSignal.trim()) {
          throw new Error("Malformed AI response.");
        }

        return analysis;
      },
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
    input(selector, value) {
      const node = documentStub.querySelector(selector);
      assert.ok(node, `Expected input ${selector} to be present.`);
      node.dispatchInput(value);
    },
    appendVoice(fieldName, value) {
      context.appendTranscriptToChapterThreeField(fieldName, value);
      context.syncCareerJourneyVoiceStatusUi();
    },
    render() {
      context.renderCareerJourney();
      context.bindCareerJourneyActions();
    },
    setChapterOneDraft(value) {
      const serialized = JSON.stringify(String(value));
      vm.runInContext(`
        careerJourneyChapterOneResponse = ${serialized};
        careerJourneyChapterOneSubmitted = false;
        careerJourneyChapterOneEditing = true;
      `, context);
    },
  };
}

function countMatches(text, needle) {
  return (text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

async function run() {
  const chapterOneDraftJourney = createJourneyHarness();
  chapterOneDraftJourney.setChapterOneDraft("I have a rough Chapter 1 draft that should stay intact.");
  chapterOneDraftJourney.render();
  assert.ok(chapterOneDraftJourney.journeyHtml.includes("Current Chapter"));
  chapterOneDraftJourney.click("[data-start-career-journey-current]");
  assert.equal(chapterOneDraftJourney.statusNode.textContent, "Career Journey started. Chapter 1 is ready for guided reflection.");
  assert.ok(chapterOneDraftJourney.journeyHtml.includes("Focused Workspace"));
  assert.ok(chapterOneDraftJourney.journeyHtml.includes("View journey"));
  assert.ok(chapterOneDraftJourney.journeyHtml.includes("Back to Overview"));
  assert.ok(chapterOneDraftJourney.journeyHtml.includes("Chapter 1 current"));
  assert.ok(chapterOneDraftJourney.journeyHtml.includes("I have a rough Chapter 1 draft that should stay intact."));

  const journey = createJourneyHarness();

  journey.render();
  assert.ok(journey.journeyHtml.includes("Chapter 1 of 5"));
  assert.ok(journey.journeyHtml.includes("Journey not started yet."));
  assert.ok(journey.journeyHtml.includes("Current chapter"));
  assert.ok(journey.journeyHtml.includes("Upcoming"));
  assert.ok(!journey.journeyHtml.includes("Focused Workspace"));
  assert.ok(!journey.journeyHtml.includes("View journey"));

  journey.click("[data-start-career-journey]");
  assert.equal(journey.statusNode.textContent, "Career Journey started. Chapter 1 is ready for guided reflection.");
  assert.equal(journey.statusNode.dataset.actionState, "success");
  assert.ok(journey.journeyHtml.includes("Focused Workspace"));
  assert.ok(journey.journeyHtml.includes("View journey"));
  assert.ok(journey.journeyHtml.includes("Back to Overview"));
  assert.ok(journey.journeyHtml.includes("Chapter 1 current"));

  journey.submitChapterOne("");
  assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
  assert.equal(journey.statusNode.dataset.actionState, "idle");
  assert.ok(journey.journeyHtml.includes("Chapter 1 is now in motion, even if you are still finding the words."));
  assert.ok(!journey.journeyHtml.includes("Chapter 2 preview"));
  assert.ok(journey.journeyHtml.includes("Chapter 1 current"));

  journey.submitChapterOne("   ");
  assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
  assert.ok(!journey.journeyHtml.includes("<blockquote class=\"journey-reflection-echo\">"));
  assert.ok(journey.journeyHtml.includes("Chapter 1 current"));

  journey.submitChapterOne("I am ready to reconnect my operations work with roles that value calmer leadership.");
  assert.equal(journey.statusNode.textContent, "Chapter 1 reflection captured for this session.");
  assert.equal(journey.statusNode.dataset.actionState, "success");
  assert.ok(journey.journeyHtml.includes("Build Your Career Timeline"));
  assert.ok(journey.journeyHtml.includes("Chapter 2 next"));

  journey.click("[data-career-journey-toggle-navigation]");
  assert.ok(journey.journeyHtml.includes("Journey Navigation"));
  assert.ok(journey.journeyHtml.includes('data-career-journey-open-chapter="1"'));
  assert.ok(journey.journeyHtml.includes('data-career-journey-open-chapter="2"'));
  assert.ok(journey.journeyHtml.includes('data-career-journey-open-chapter="3"'));
  journey.click('[data-career-journey-open-chapter="2"]');
  assert.ok(journey.journeyHtml.includes("Build Your Career Timeline"));
  journey.click("[data-career-journey-close-workspace]");
  assert.equal(journey.statusNode.textContent, "Returned to the Career Journey overview.");
  assert.ok(!journey.journeyHtml.includes("Focused Workspace"));
  journey.click("[data-start-career-journey]");
  assert.ok(journey.journeyHtml.includes("Build Your Career Timeline"));

  journey.click("[data-start-career-journey-chapter-two]");
  assert.equal(journey.statusNode.textContent, "Chapter 2 is ready for one career season.");
  assert.ok(journey.journeyHtml.includes("Build Your Career Timeline"));
  assert.ok(journey.journeyHtml.includes("We'll use this part of your journey to help uncover stories"));
  assert.ok(journey.journeyHtml.includes("Role or career season"));
  assert.ok(journey.journeyHtml.includes("Chapter 2 in progress"));

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
  assert.ok(journey.journeyHtml.includes("Chapter 2 in progress"));

  journey.click("[data-career-journey-toggle-navigation]");
  journey.click("[data-career-journey-toggle-navigation]");
  assert.ok(journey.journeyHtml.includes("Northwind Labs"));
  assert.ok(journey.journeyHtml.includes("Built calmer systems after a volatile stretch."));

  journey.submitChapterTwo({
    seasonTitle: "Operations Lead",
    organization: "Northwind Labs",
    startYear: "2022",
    endYear: "2024",
    seasonReflection: "Built calmer systems after a volatile stretch.",
  });
  assert.equal(journey.statusNode.textContent, "Chapter 2 career season captured for this session.");
  assert.equal(journey.statusNode.dataset.actionState, "success");
  assert.ok(!journey.journeyHtml.includes("Chapter 3 is available when you are ready."));
  assert.ok(journey.journeyHtml.includes("Complete"));
  assert.ok(!journey.journeyHtml.includes("Chapter 3 next"));
  assert.ok(journey.journeyHtml.includes("Chapter 3 in progress"));
  assert.ok(journey.journeyHtml.includes("Moments That Mattered"));
  assert.ok(journey.journeyHtml.includes("Explore This Story"));
  assert.ok(journey.journeyHtml.includes("Think back to when you worked as <strong>Operations Lead at Northwind Labs</strong>. What is one moment that felt difficult, important, or stayed with you?"));
  assert.ok(!journey.journeyHtml.includes("From your time as Operations Lead at Northwind Labs"));
  assert.ok(!journey.journeyHtml.includes("You said this season mattered because:"));
  assert.ok(journey.journeyHtml.includes("Built calmer systems after a volatile stretch."));
  assert.ok(journey.journeyHtml.includes("Start with what happened, what made it difficult, and what you did next."));
  assert.ok(journey.journeyHtml.includes('data-career-journey-voice-start="initialResponse"'));
  assert.ok(journey.journeyHtml.includes('aria-label="Use voice input"'));
  assert.ok(journey.journeyHtml.includes("journey-voice-row-compact"));
  assert.ok(journey.journeyHtml.includes("journey-voice-status-row"));
  assert.ok(journey.journeyHtml.includes("3. Moments That Mattered"));
  assert.ok(!journey.journeyHtml.includes("Slow down around one meaningful work moment"));
  assert.ok(!journey.journeyHtml.includes("Some of your strongest stories"));
  assert.ok(!journey.journeyHtml.includes("Start wherever the memory begins"));

  journey.click("[data-career-journey-toggle-navigation]");
  journey.click('[data-career-journey-open-chapter="2"]');
  assert.ok(journey.journeyHtml.includes("Operations Lead"));
  journey.click('[data-career-journey-open-chapter="3"]');
  assert.ok(journey.journeyHtml.includes("Explore This Story"));

  journey.context.fetch = async (_url, options) => {
  const body = JSON.parse(options.body);
  if (body.initialResponse.includes("malformed")) {
    return {
      ok: true,
      json: async () => ({ analysis: { reflection: "", followUpQuestion: "", possibleSignal: "" } }),
    };
  }

  return {
    ok: true,
    json: async () => ({
      analysis: {
        reflection: "This moment seems to have stayed with you because you were holding things together under pressure.",
        followUpQuestion: "What felt most important for you to protect in that moment?",
        possibleSignal: "This may suggest that you pay close attention to stability when stakes feel high.",
      },
    }),
  };
  };

  journey.appendVoice("initialResponse", "   ");
  assert.ok(journey.journeyHtml.includes("Explore This Story"));

  journey.appendVoice("initialResponse", "I kept a launch handoff from falling apart when everyone was overloaded.");
  assert.ok(!journey.journeyHtml.includes("Chapter 3 is available when you are ready."));
  assert.ok(!journey.journeyHtml.includes("Chapter 3 next"));
  assert.ok(journey.journeyHtml.includes("I kept a launch handoff from falling apart when everyone was overloaded."));
  assert.ok(journey.journeyHtml.includes("Chapter 3 in progress"));
  journey.click("[data-career-journey-toggle-navigation]");
  journey.click("[data-career-journey-toggle-navigation]");
  assert.ok(journey.journeyHtml.includes("I kept a launch handoff from falling apart when everyone was overloaded."));
  journey.click("[data-career-journey-explore-story]");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(journey.statusNode.textContent, "NextMove reflected on this moment and asked one follow-up question.");
  assert.ok(journey.journeyHtml.includes("NextMove's reflection"));
  assert.ok(journey.journeyHtml.includes("journey-ai-reflection"));
  assert.ok(journey.journeyHtml.includes("What felt most important for you to protect in that moment?"));
  assert.ok(journey.journeyHtml.includes("journey-ai-question"));
  assert.ok(journey.journeyHtml.includes("This may suggest that you pay close attention to stability when stakes feel high."));
  assert.ok(journey.journeyHtml.includes("journey-ai-signal"));
  assert.ok(journey.journeyHtml.includes('data-career-journey-retry-story'));
  assert.ok(journey.journeyHtml.includes("Tell NextMove a little more."));
  assert.ok(!journey.journeyHtml.includes("What NextMove asked"));

  journey.appendVoice("followUpResponse", "I was trying to keep the customer impact from getting worse while the team regrouped.");
  journey.click("[data-career-journey-save-moment]");
  assert.equal(journey.statusNode.textContent, "Chapter 3 story moment saved for this session.");
  assert.ok(journey.journeyHtml.includes("Your Moments That Mattered"));
  assert.ok(journey.journeyHtml.includes("1 moment captured"));
  assert.ok(journey.journeyHtml.includes('data-career-journey-timeline-entry-id="journey_role_1"'));
  assert.ok(journey.journeyHtml.includes("Operations Lead · Northwind Labs"));
  assert.ok(journey.journeyHtml.includes("I'm Done for Now"));
  assert.ok(!journey.journeyHtml.includes("Chapter 3 is complete for now."));

  journey.click('[data-career-journey-view-moment="journey_moment_1"]');
  assert.equal(journey.statusNode.textContent, "Saved moment opened.");
  assert.ok(journey.journeyHtml.includes("Saved Reflection"));
  assert.ok(journey.journeyHtml.includes("What you added"));
  assert.ok(journey.journeyHtml.includes("Operations Lead · Northwind Labs"));
  assert.ok(journey.journeyHtml.includes("Back to Moments"));

  journey.click("[data-career-journey-back-to-moments]");
  assert.ok(journey.journeyHtml.includes("Your Moments That Mattered"));

  journey.click("[data-career-journey-add-moment]");
  assert.equal(journey.statusNode.textContent, "Chapter 3 is ready for another moment.");
  assert.ok(journey.journeyHtml.includes("1 moment captured"));
  assert.ok(journey.journeyHtml.includes("Operations Lead · Northwind Labs"));
  assert.ok(journey.journeyHtml.includes("Think back to when you worked as <strong>Operations Lead at Northwind Labs</strong>. What is one moment"));
  assert.ok(!journey.journeyHtml.includes("Chapter 3 next"));

  journey.click('[data-career-journey-toggle-context="different"]');
  assert.equal(journey.statusNode.textContent, "This moment is marked as a different experience.");
  assert.ok(journey.journeyHtml.includes("Different experience"));
  assert.ok(journey.journeyHtml.includes("Think of one moment that felt difficult, important, or stayed with you."));
  assert.ok(!journey.journeyHtml.includes("You said this season mattered because:"));
  assert.ok(!journey.journeyHtml.includes("Built calmer systems after a volatile stretch."));
  journey.click('[data-career-journey-toggle-context="timeline"]');
  assert.equal(journey.statusNode.textContent, "This moment is connected to your Chapter 2 career season.");
  assert.ok(journey.journeyHtml.includes("Think back to when you worked as <strong>Operations Lead at Northwind Labs</strong>. What is one moment"));
  assert.ok(journey.journeyHtml.includes("Built calmer systems after a volatile stretch."));
  journey.click('[data-career-journey-toggle-context="different"]');
  assert.equal(journey.statusNode.textContent, "This moment is marked as a different experience.");

  journey.input('textarea[name="chapterThreeInitialResponse"]', "A malformed retry should preserve what I typed.");
  journey.click("[data-career-journey-explore-story]");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(journey.statusNode.dataset.actionState, "failure");
  assert.ok(journey.journeyHtml.includes("Malformed AI response."));
  assert.ok(journey.journeyHtml.includes("A malformed retry should preserve what I typed."));
  assert.ok(journey.journeyHtml.includes("Your Moments That Mattered"));

  journey.context.fetch = async () => ({
    ok: true,
    json: async () => ({
      analysis: {
        reflection: "This second moment seems to matter because you were trying to create steadiness while uncertainty was still present.",
        followUpQuestion: "What did you feel responsible for protecting in that second moment?",
        possibleSignal: "This may suggest that you stay attentive to risk before it becomes visible to everyone else.",
      },
    }),
  });

  journey.click("[data-career-journey-explore-story]");
  await new Promise((resolve) => setImmediate(resolve));
  journey.input('textarea[name="chapterThreeFollowUpResponse"]', "I was trying to protect the handoff quality before it turned into customer confusion.");
  journey.click("[data-career-journey-save-moment]");
  assert.ok(journey.journeyHtml.includes("2 moments captured"));
  assert.ok(journey.journeyHtml.includes('data-career-journey-view-moment="journey_moment_1"'));
  assert.ok(journey.journeyHtml.includes('data-career-journey-view-moment="journey_moment_2"'));
  assert.ok(journey.journeyHtml.includes('data-career-journey-timeline-entry-id=""'));
  assert.ok(journey.journeyHtml.includes("Different experience"));

  journey.click('[data-career-journey-edit-moment="journey_moment_1"]');
  assert.equal(journey.statusNode.textContent, "You can revise this saved moment whenever you are ready.");
  assert.ok(journey.journeyHtml.includes("Save This Moment"));
  assert.ok(journey.journeyHtml.includes("Operations Lead · Northwind Labs"));
  journey.click('[data-career-journey-toggle-context="different"]');
  assert.equal(journey.statusNode.textContent, "This moment is marked as a different experience.");
  journey.input('textarea[name="chapterThreeInitialResponse"]', "I kept a launch handoff from falling apart and rewired the escalation path.");
  journey.click("[data-career-journey-explore-story]");
  await new Promise((resolve) => setImmediate(resolve));
  journey.input('textarea[name="chapterThreeFollowUpResponse"]', "I was protecting the customer handoff and the team's ability to recover quickly.");
  journey.click("[data-career-journey-save-moment]");
  assert.ok(journey.journeyHtml.includes("2 moments captured"));
  assert.equal(countMatches(journey.journeyHtml, 'data-career-journey-view-moment="journey_moment_1"'), 1);
  assert.ok(journey.journeyHtml.includes('data-career-journey-timeline-entry-id=""'));

  journey.click("[data-career-journey-done-for-now]");
  assert.equal(journey.statusNode.textContent, "Chapter 3 marked complete for now.");
  assert.ok(journey.journeyHtml.includes("Complete"));

  journey.click("[data-career-journey-add-moment]");
  assert.equal(journey.statusNode.textContent, "Chapter 3 is ready for another moment.");
  assert.ok(journey.journeyHtml.includes("In progress"));

  journey.input('textarea[name="chapterThreeInitialResponse"]', "A fresh unsaved draft should clear without touching saved moments.");
  journey.render();
  journey.click("[data-career-journey-start-over]");
  assert.equal(journey.statusNode.textContent, "The active Chapter 3 draft was cleared. Saved moments were preserved.");
  assert.ok(journey.journeyHtml.includes("2 moments captured"));
  assert.ok(journey.journeyHtml.includes("Explore This Story"));
  assert.ok(!journey.journeyHtml.includes("Saved Reflection"));

  const noCompanyJourney = createJourneyHarness();
  noCompanyJourney.render();
  noCompanyJourney.click("[data-start-career-journey]");
  noCompanyJourney.submitChapterOne("I want to test a season without an organization.");
  noCompanyJourney.click("[data-start-career-journey-chapter-two]");
  noCompanyJourney.submitChapterTwo({
    seasonTitle: "Machine Operator",
    organization: "",
    seasonReflection: "",
  });
  assert.ok(noCompanyJourney.journeyHtml.includes("Think back to when you worked as <strong>Machine Operator</strong>. What is one moment"));
  assert.ok(!noCompanyJourney.journeyHtml.includes("Machine Operator at"));
  assert.ok(!noCompanyJourney.journeyHtml.includes("You said this season mattered because:"));
}

run();
