const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createJourneyHarness() {
  const nodes = new Map();
  let dynamicVersion = 0;
  const dynamicCache = new Map();
  const recognitionInstances = [];

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
      hidden: false,
      handlers: {},
      classList: {
        toggle(className, force) {
          if (className === "hidden") {
            this.owner.hidden = Boolean(force);
          }
        },
        owner: null,
      },
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
      const node = createBaseNode(selector);
      node.classList.owner = node;
      nodes.set(selector, node);
    }

    return nodes.get(selector);
  }

  function decodeHtml(value = "") {
    return String(value)
      .replace(/&quot;/g, "\"")
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
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
    const node = {
      selector,
      dataset,
      disabled: false,
      hidden: false,
      handlers: {},
      classList: {
        toggle(className, force) {
          if (className === "hidden") {
            node.hidden = Boolean(force);
          }
        },
      },
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      click() {
        this.handlers.click?.({ target: this });
      },
    };
    return node;
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

  function createTextareaNode(selector, name) {
    return {
      selector,
      dataset: {},
      value: extractTextareaValue(ensureNode("#career-journey-content").innerHTML, name),
      handlers: {},
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      dispatchInput(value) {
        this.value = value;
        this.handlers.input?.({ target: this });
      },
    };
  }

  function voiceButtonsFromHtml(html) {
    return [...html.matchAll(/data-career-journey-voice-start="([^"]+)"/g)].map((match) => match[1]);
  }

  function voiceStopsFromHtml(html) {
    return [...html.matchAll(/data-career-journey-voice-stop/g)].map((_, index) => index);
  }

  class FakeSpeechRecognition {
    constructor() {
      this.lang = "";
      this.interimResults = false;
      this.continuous = false;
      this.maxAlternatives = 1;
      this.onstart = null;
      this.onresult = null;
      this.onerror = null;
      this.onend = null;
      this.startCalls = 0;
      this.stopCalls = 0;
      recognitionInstances.push(this);
    }

    start() {
      this.startCalls += 1;
    }

    stop() {
      this.stopCalls += 1;
    }
  }

  function buildRecognitionEvent(entries) {
    return {
      results: entries.map((entry) => ({
        0: { transcript: entry.transcript },
        isFinal: Boolean(entry.isFinal),
      })),
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

      if (selector === '[data-career-journey-voice-start="chapterOneResponse"]') {
        return html.includes('data-career-journey-voice-start="chapterOneResponse"')
          ? createDynamicNode('[data-career-journey-voice-start]:chapterOneResponse', () => createButton(selector, { careerJourneyVoiceStart: "chapterOneResponse" }))
          : null;
      }

      if (selector === '[data-career-journey-voice-start="initialResponse"]') {
        return html.includes('data-career-journey-voice-start="initialResponse"')
          ? createDynamicNode('[data-career-journey-voice-start]:initialResponse', () => createButton(selector, { careerJourneyVoiceStart: "initialResponse" }))
          : null;
      }

      if (selector === '[data-career-journey-voice-start="followUpResponse"]') {
        return html.includes('data-career-journey-voice-start="followUpResponse"')
          ? createDynamicNode('[data-career-journey-voice-start]:followUpResponse', () => createButton(selector, { careerJourneyVoiceStart: "followUpResponse" }))
          : null;
      }

      if (selector === "[data-career-journey-voice-stop]") {
        return html.includes("data-career-journey-voice-stop")
          ? createDynamicNode("[data-career-journey-voice-stop]:0", () => createButton(selector))
          : null;
      }

      if (selector === '[data-career-journey-voice-status="chapterOneResponse"]') {
        return html.includes('data-career-journey-voice-status="chapterOneResponse"')
          ? createDynamicNode(selector, () => ensureNode(selector))
          : null;
      }

      if (selector === '[data-career-journey-voice-status="initialResponse"]') {
        return html.includes('data-career-journey-voice-status="initialResponse"')
          ? createDynamicNode(selector, () => ensureNode(selector))
          : null;
      }

      if (selector === '[data-career-journey-voice-status="followUpResponse"]') {
        return html.includes('data-career-journey-voice-status="followUpResponse"')
          ? createDynamicNode(selector, () => ensureNode(selector))
          : null;
      }

      if (selector === ".journey-voice-status") {
        return html.includes("journey-voice-status")
          ? createDynamicNode(selector, () => ensureNode(selector))
          : null;
      }

      if (selector === "[data-career-journey-form]") {
        if (!html.includes("data-career-journey-form")) {
          return null;
        }

        return createDynamicNode(selector, () => createForm(selector, {
          chapterOneResponse: { value: extractTextareaValue(html, "chapterOneResponse") },
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
          seasonReflection: { value: extractTextareaValue(html, "seasonReflection") },
        }));
      }

      if (selector === 'textarea[name="chapterOneResponse"]') {
        return html.includes('name="chapterOneResponse"')
          ? createDynamicNode(selector, () => createTextareaNode(selector, "chapterOneResponse"))
          : null;
      }

      if (selector === 'textarea[name="chapterThreeInitialResponse"]') {
        return html.includes('name="chapterThreeInitialResponse"')
          ? createDynamicNode(selector, () => createTextareaNode(selector, "chapterThreeInitialResponse"))
          : null;
      }

      if (selector === 'textarea[name="chapterThreeFollowUpResponse"]') {
        return html.includes('name="chapterThreeFollowUpResponse"')
          ? createDynamicNode(selector, () => createTextareaNode(selector, "chapterThreeFollowUpResponse"))
          : null;
      }

      if (selector === '[name="timelineEntryId"]') {
        return html.includes('name="timelineEntryId"')
          ? createDynamicNode(selector, () => ({ selector, dataset: {}, value: extractInputValue(html, "timelineEntryId"), handlers: {}, addEventListener(eventName, handler) { this.handlers[eventName] = handler; } }))
          : null;
      }

      if (selector === '[name="seasonTitle"]') {
        return html.includes('name="seasonTitle"')
          ? createDynamicNode(selector, () => ({ selector, dataset: {}, value: extractInputValue(html, "seasonTitle"), handlers: {}, addEventListener(eventName, handler) { this.handlers[eventName] = handler; } }))
          : null;
      }

      if (selector === '[name="organization"]') {
        return html.includes('name="organization"')
          ? createDynamicNode(selector, () => ({ selector, dataset: {}, value: extractInputValue(html, "organization"), handlers: {}, addEventListener(eventName, handler) { this.handlers[eventName] = handler; } }))
          : null;
      }

      if (selector === '[name="startYear"]') {
        return html.includes('name="startYear"')
          ? createDynamicNode(selector, () => ({ selector, dataset: {}, value: extractInputValue(html, "startYear"), handlers: {}, addEventListener(eventName, handler) { this.handlers[eventName] = handler; } }))
          : null;
      }

      if (selector === '[name="endYear"]') {
        return html.includes('name="endYear"')
          ? createDynamicNode(selector, () => ({ selector, dataset: {}, value: extractInputValue(html, "endYear"), handlers: {}, addEventListener(eventName, handler) { this.handlers[eventName] = handler; } }))
          : null;
      }

      if (selector === '[name="seasonReflection"]') {
        return html.includes('name="seasonReflection"')
          ? createDynamicNode(selector, () => createTextareaNode(selector, "seasonReflection"))
          : null;
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
        return voiceButtonsFromHtml(html).map((targetKey) => createDynamicNode(`[data-career-journey-voice-start]:${targetKey}`, () => createButton(selector, { careerJourneyVoiceStart: targetKey })));
      }

      if (selector === "[data-career-journey-voice-stop]") {
        return voiceStopsFromHtml(html).map((index) => createDynamicNode(`[data-career-journey-voice-stop]:${index}`, () => createButton(selector)));
      }

      if (selector === "[data-career-journey-view-moment]") {
        return [...html.matchAll(/data-career-journey-view-moment="([^"]+)"/g)].map((match) => createDynamicNode(`[data-career-journey-view-moment]:${match[1]}`, () => createButton(selector, { careerJourneyViewMoment: match[1] })));
      }

      if (selector === "[data-career-journey-edit-moment]") {
        return [...html.matchAll(/data-career-journey-edit-moment="([^"]+)"/g)].map((match) => createDynamicNode(`[data-career-journey-edit-moment]:${match[1]}`, () => createButton(selector, { careerJourneyEditMoment: match[1] })));
      }

      if (selector === "[data-career-journey-open-chapter]") {
        return [...html.matchAll(/data-career-journey-open-chapter="([^"]+)"/g)].map((match) => createDynamicNode(`[data-career-journey-open-chapter]:${match[1]}`, () => createButton(selector, { careerJourneyOpenChapter: match[1] })));
      }

      if (selector === "[data-start-career-journey]") {
        return [...html.matchAll(/data-start-career-journey/g)].map((_, index) => createDynamicNode(`[data-start-career-journey]:${index}`, () => createButton(selector)));
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
    SpeechRecognition: FakeSpeechRecognition,
    webkitSpeechRecognition: FakeSpeechRecognition,
  };

  context.window = context;
  context.window.addEventListener = () => {};
  context.window.dispatchEvent = () => {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../src/shared/voiceSession.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../src/jobsApplied/controller.js"), "utf8"), context);

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
    get recognitionInstances() {
      return recognitionInstances;
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
    fieldValue(selector) {
      const node = documentStub.querySelector(selector);
      assert.ok(node, `Expected field ${selector} to be present.`);
      return node.value;
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
    appendTranscript(targetKey, value) {
      context.appendTranscriptToCareerJourneyField(targetKey, value);
      context.syncCareerJourneyVoiceStatusUi();
    },
    startVoice(targetKey) {
      this.click(`[data-career-journey-voice-start="${targetKey}"]`);
    },
    stopVoice() {
      this.click("[data-career-journey-voice-stop]");
    },
    latestRecognition() {
      assert.ok(recognitionInstances.length > 0, "Expected a recognition instance.");
      return recognitionInstances[recognitionInstances.length - 1];
    },
    emitStart(instance = this.latestRecognition()) {
      instance.onstart?.();
    },
    emitResult(entries, instance = this.latestRecognition()) {
      instance.onresult?.(buildRecognitionEvent(entries));
    },
    emitError(error, instance = this.latestRecognition()) {
      instance.onerror?.({ error });
    },
    emitEnd(instance = this.latestRecognition()) {
      instance.onend?.();
    },
    disableRecognitionSupport() {
      context.SpeechRecognition = undefined;
      context.webkitSpeechRecognition = undefined;
    },
    enableRecognitionSupport() {
      context.SpeechRecognition = FakeSpeechRecognition;
      context.webkitSpeechRecognition = FakeSpeechRecognition;
    },
  };
}

function countMatches(text, needle) {
  return (text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

async function runScenario(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
  } catch (error) {
    console.log(`FAIL: ${name}`);
    throw error;
  }
}

async function run() {
  await runScenario("Chapter 1 voice populates an empty reflection.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    assert.ok(journey.journeyHtml.includes('data-career-journey-voice-start="chapterOneResponse"'));
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I want a calmer next move.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);
    assert.equal(journey.fieldValue('textarea[name="chapterOneResponse"]'), "I want a calmer next move.");
  });

  await runScenario("Chapter 1 voice appends to existing text.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.input('textarea[name="chapterOneResponse"]', "I am regrouping.");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I want a calmer next move.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);
    assert.equal(journey.fieldValue('textarea[name="chapterOneResponse"]'), "I am regrouping. I want a calmer next move.");
  });

  await runScenario("Chapter 1 voice enables the existing valid save path.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I am ready to reconnect my operations work with calmer leadership roles.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);
    journey.submitChapterOne("I am ready to reconnect my operations work with calmer leadership roles.");
    assert.equal(journey.statusNode.textContent, "Chapter 1 reflection captured for this session.");
    assert.ok(journey.journeyHtml.includes("Build Your Career Timeline"));
  });

  await runScenario("Chapter 1 save, edit, clear, and resave behavior remains unchanged.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("");
    assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
    journey.submitChapterOne("I am ready to reconnect my operations work with roles that value calmer leadership.");
    assert.equal(journey.statusNode.textContent, "Chapter 1 reflection captured for this session.");
    journey.click("[data-career-journey-toggle-navigation]");
    journey.click('[data-career-journey-open-chapter="1"]');
    journey.click("[data-edit-career-journey-chapter-one]");
    journey.submitChapterOne("I want to revise this reflection.");
    assert.equal(journey.statusNode.textContent, "Chapter 1 reflection captured for this session.");
    assert.ok(journey.journeyHtml.includes("Build Your Career Timeline"));
  });

  await runScenario("Chapter 3 initial-response voice remains functional.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({ seasonTitle: "Operations Lead", organization: "Northwind Labs", seasonReflection: "Built calmer systems after a volatile stretch." });
    journey.startVoice("initialResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I kept a launch handoff from falling apart when everyone was overloaded.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);
    assert.equal(journey.fieldValue('textarea[name="chapterThreeInitialResponse"]'), "I kept a launch handoff from falling apart when everyone was overloaded.");
  });

  await runScenario("Chapter 3 follow-up voice remains functional.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({ seasonTitle: "Operations Lead", organization: "Northwind Labs", seasonReflection: "Built calmer systems after a volatile stretch." });
    journey.context.fetch = async () => ({
      ok: true,
      json: async () => ({
        analysis: {
          reflection: "This moment seems to have stayed with you because you were holding things together under pressure.",
          followUpQuestion: "What felt most important for you to protect in that moment?",
          possibleSignal: "This may suggest that you pay close attention to stability when stakes feel high.",
        },
      }),
    });
    journey.input('textarea[name="chapterThreeInitialResponse"]', "I kept a launch handoff from falling apart when everyone was overloaded.");
    journey.click("[data-career-journey-explore-story]");
    await new Promise((resolve) => setImmediate(resolve));
    journey.startVoice("followUpResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I was trying to keep the customer impact from getting worse while the team regrouped.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);
    assert.equal(journey.fieldValue('textarea[name="chapterThreeFollowUpResponse"]'), "I was trying to keep the customer impact from getting worse while the team regrouped.");
  });

  await runScenario("A normal browser end restarts an active user session.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I need more room to think.", isFinal: true }], recognition);
    journey.emitEnd(recognition);
    assert.equal(journey.recognitionInstances.length, 2);
  });

  await runScenario("Explicit Stop prevents restart.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I need more room to think.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);
    assert.equal(journey.recognitionInstances.length, 1);
  });

  await runScenario("Surface teardown prevents restart.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.click("[data-career-journey-close-workspace]");
    journey.emitEnd(recognition);
    assert.equal(journey.recognitionInstances.length, 1);
  });

  await runScenario("Finalized transcript is not duplicated.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([
      { transcript: "I kept things steady.", isFinal: false },
      { transcript: "I kept things steady.", isFinal: true },
    ], recognition);
    journey.emitEnd(recognition);
    const restarted = journey.latestRecognition();
    journey.emitStart(restarted);
    journey.emitResult([{ transcript: "I kept things steady.", isFinal: false }], restarted);
    journey.stopVoice();
    journey.emitEnd(restarted);
    assert.equal(countMatches(journey.fieldValue('textarea[name="chapterOneResponse"]'), "I kept things steady."), 1);
  });

  await runScenario("Permission denial ends safely.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const recognition = journey.latestRecognition();
    journey.emitError("not-allowed", recognition);
    journey.emitEnd(recognition);
    assert.ok(journey.journeyHtml.includes("Voice input"));
    assert.equal(journey.statusNode.textContent, "Career Journey started. Chapter 1 is ready for guided reflection.");
  });

  await runScenario("Unsupported recognition leaves typing available.", async () => {
    const journey = createJourneyHarness();
    journey.disableRecognitionSupport();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    journey.input('textarea[name="chapterOneResponse"]', "Typing still works.");
    assert.equal(journey.fieldValue('textarea[name="chapterOneResponse"]'), "Typing still works.");
  });

  await runScenario("Bounded recovery does not create an uncontrolled restart loop.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.startVoice("chapterOneResponse");
    const first = journey.latestRecognition();
    journey.emitError("no-speech", first);
    journey.emitEnd(first);
    const second = journey.latestRecognition();
    journey.emitError("no-speech", second);
    journey.emitEnd(second);
    const third = journey.latestRecognition();
    journey.emitError("no-speech", third);
    journey.emitEnd(third);
    assert.equal(journey.recognitionInstances.length, 3);
  });

  await runScenario("Existing Career Journey state-transition tests pass.", async () => {
    const chapterOneDraftJourney = createJourneyHarness();
    chapterOneDraftJourney.setChapterOneDraft("I have a rough Chapter 1 draft that should stay intact.");
    chapterOneDraftJourney.render();
    assert.ok(chapterOneDraftJourney.journeyHtml.includes("Current Chapter"));
    chapterOneDraftJourney.click("[data-start-career-journey-current]");
    assert.equal(chapterOneDraftJourney.statusNode.textContent, "Career Journey started. Chapter 1 is ready for guided reflection.");
    assert.ok(chapterOneDraftJourney.journeyHtml.includes("Focused Workspace"));
    assert.ok(chapterOneDraftJourney.journeyHtml.includes("I have a rough Chapter 1 draft that should stay intact."));

    const journey = createJourneyHarness();
    journey.render();
    assert.ok(journey.journeyHtml.includes("Chapter 1 of 5"));
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("");
    assert.equal(journey.statusNode.textContent, "You can keep going when you are ready.");
    journey.submitChapterOne("I am ready to reconnect my operations work with roles that value calmer leadership.");
    assert.equal(journey.statusNode.textContent, "Chapter 1 reflection captured for this session.");
    journey.click("[data-career-journey-toggle-navigation]");
    journey.click('[data-career-journey-open-chapter="2"]');
    journey.click("[data-career-journey-close-workspace]");
    assert.equal(journey.statusNode.textContent, "Returned to the Career Journey overview.");
    journey.click("[data-start-career-journey]");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
      endYear: "2024",
      seasonReflection: "Built calmer systems after a volatile stretch.",
    });
    assert.equal(journey.statusNode.textContent, "Chapter 2 career season captured for this session.");
    assert.ok(journey.journeyHtml.includes('data-career-journey-voice-start="initialResponse"'));

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

    journey.appendTranscript("initialResponse", "I kept a launch handoff from falling apart when everyone was overloaded.");
    journey.click("[data-career-journey-explore-story]");
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(journey.statusNode.textContent, "NextMove reflected on this moment and asked one follow-up question.");
    journey.appendTranscript("followUpResponse", "I was trying to keep the customer impact from getting worse while the team regrouped.");
    journey.click("[data-career-journey-save-moment]");
    assert.equal(journey.statusNode.textContent, "Chapter 3 story moment saved for this session.");
    journey.click('[data-career-journey-view-moment="journey_moment_1"]');
    assert.equal(journey.statusNode.textContent, "Saved moment opened.");
    journey.click("[data-career-journey-back-to-moments]");
    journey.click("[data-career-journey-add-moment]");
    assert.equal(journey.statusNode.textContent, "Chapter 3 is ready for another moment.");
    journey.click('[data-career-journey-toggle-context="different"]');
    assert.equal(journey.statusNode.textContent, "This moment is marked as a different experience.");
    journey.click('[data-career-journey-toggle-context="timeline"]');
    assert.equal(journey.statusNode.textContent, "This moment is connected to your Chapter 2 career season.");
    journey.click('[data-career-journey-toggle-context="different"]');
    journey.input('textarea[name="chapterThreeInitialResponse"]', "A malformed retry should preserve what I typed.");
    journey.click("[data-career-journey-explore-story]");
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(journey.statusNode.dataset.actionState, "failure");
    assert.ok(journey.journeyHtml.includes("Malformed AI response."));

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
    journey.click('[data-career-journey-edit-moment="journey_moment_1"]');
    journey.input('textarea[name="chapterThreeInitialResponse"]', "I kept a launch handoff from falling apart and rewired the escalation path.");
    journey.click("[data-career-journey-explore-story]");
    await new Promise((resolve) => setImmediate(resolve));
    journey.input('textarea[name="chapterThreeFollowUpResponse"]', "I was protecting the customer handoff and the team's ability to recover quickly.");
    journey.click("[data-career-journey-save-moment]");
    assert.equal(countMatches(journey.journeyHtml, 'data-career-journey-view-moment="journey_moment_1"'), 1);
    journey.click("[data-career-journey-done-for-now]");
    assert.equal(journey.statusNode.textContent, "Chapter 3 marked complete for now.");
    journey.click("[data-career-journey-add-moment]");
    journey.input('textarea[name="chapterThreeInitialResponse"]', "A fresh unsaved draft should clear without touching saved moments.");
    journey.render();
    journey.click("[data-career-journey-start-over]");
    assert.equal(journey.statusNode.textContent, "The active Chapter 3 draft was cleared. Saved moments were preserved.");

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
  });
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
