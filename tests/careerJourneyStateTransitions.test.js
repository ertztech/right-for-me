const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createJourneyHarness() {
  const nodes = new Map();
  let dynamicVersion = 0;
  const dynamicCache = new Map();
  const recognitionInstances = [];
  const confirmResponses = [];

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

  function extractSelectValue(html, name) {
    const match = html.match(new RegExp(`<select[^>]*name="${name}"[^>]*>([\\s\\S]*?)<\\/select>`));
    const selectHtml = match?.[1] || "";
    const selectedMatch = selectHtml.match(/<option[^>]*value="([^"]*)"[^>]*selected[^>]*>/);
    if (selectedMatch) {
      return decodeHtml(selectedMatch[1] || "");
    }

    const firstMatch = selectHtml.match(/<option[^>]*value="([^"]*)"[^>]*>/);
    return decodeHtml(firstMatch?.[1] || "");
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

  function createInputNode(selector, name) {
    return {
      selector,
      dataset: {},
      value: extractInputValue(ensureNode("#career-journey-content").innerHTML, name),
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

  function createSelectNode(selector, name) {
    return {
      selector,
      dataset: {},
      value: extractSelectValue(ensureNode("#career-journey-content").innerHTML, name),
      handlers: {},
      addEventListener(eventName, handler) {
        this.handlers[eventName] = handler;
      },
      dispatchChange(value) {
        this.value = value;
        this.handlers.change?.({ target: this });
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

      if (selector === "[data-add-career-journey-entry]") {
        return html.includes("data-add-career-journey-entry")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-career-journey-cancel-chapter-two]") {
        return html.includes("data-career-journey-cancel-chapter-two")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      if (selector === "[data-edit-career-journey-chapter-two]") {
        return html.includes("data-edit-career-journey-chapter-two")
          ? createDynamicNode(selector, () => createButton(selector))
          : null;
      }

      const editEntryMatch = selector.match(/^\[data-edit-career-journey-entry="([^"]+)"\]$/);
      if (editEntryMatch) {
        const entryId = editEntryMatch[1];
        return html.includes(`data-edit-career-journey-entry="${entryId}"`)
          ? createDynamicNode(`[data-edit-career-journey-entry]:${entryId}`, () => createButton(selector, { editCareerJourneyEntry: entryId }))
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

      if (selector === 'select[name="chapterThreeTimelineEntryId"]') {
        return html.includes('name="chapterThreeTimelineEntryId"')
          ? createDynamicNode(selector, () => createSelectNode(selector, "chapterThreeTimelineEntryId"))
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
          ? createDynamicNode(selector, () => createInputNode(selector, "timelineEntryId"))
          : null;
      }

      if (selector === '[name="seasonTitle"]') {
        return html.includes('name="seasonTitle"')
          ? createDynamicNode(selector, () => createInputNode(selector, "seasonTitle"))
          : null;
      }

      if (selector === '[name="organization"]') {
        return html.includes('name="organization"')
          ? createDynamicNode(selector, () => createInputNode(selector, "organization"))
          : null;
      }

      if (selector === '[name="startYear"]') {
        return html.includes('name="startYear"')
          ? createDynamicNode(selector, () => createInputNode(selector, "startYear"))
          : null;
      }

      if (selector === '[name="endYear"]') {
        return html.includes('name="endYear"')
          ? createDynamicNode(selector, () => createInputNode(selector, "endYear"))
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

      if (selector === "[data-edit-career-journey-entry]") {
        return [...html.matchAll(/data-edit-career-journey-entry="([^"]+)"/g)]
          .map((match) => createDynamicNode(`[data-edit-career-journey-entry]:${match[1]}`, () => createButton(selector, { editCareerJourneyEntry: match[1] })));
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
    confirm: () => (confirmResponses.length ? confirmResponses.shift() : true),
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
    change(selector, value) {
      const node = documentStub.querySelector(selector);
      assert.ok(node, `Expected control ${selector} to be present.`);
      node.dispatchChange(value);
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
    queueConfirmResponses(...responses) {
      confirmResponses.push(...responses);
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
    read(expression) {
      return vm.runInContext(expression, context);
    },
    setChapterOneDraft(value) {
      const serialized = JSON.stringify(String(value));
      vm.runInContext(`
        careerJourneyChapterOneResponse = ${serialized};
        careerJourneyChapterOneSubmitted = false;
        careerJourneyChapterOneEditing = true;
      `, context);
    },
    setLegacyChapterTwoEntry(entry) {
      const serialized = JSON.stringify(entry);
      vm.runInContext(`
        careerJourneyChapterOneSubmitted = true;
        careerJourneyChapterTwoStarted = true;
        careerJourneyFocusedChapterNumber = 2;
        careerJourneyChapterTwoEntry = ${serialized};
        careerJourneyChapterTwoEntries = [];
        careerJourneyChapterTwoMostRecentlySavedEntryId = "";
      `, context);
    },
    setChapterTwoEntries(entries) {
      const serialized = JSON.stringify(entries);
      vm.runInContext(`
        careerJourneyChapterOneSubmitted = true;
        careerJourneyChapterTwoStarted = true;
        careerJourneyChapterTwoEntries = ${serialized};
        careerJourneyChapterTwoEditing = false;
        careerJourneyChapterTwoMostRecentlySavedEntryId = "";
      `, context);
    },
    beginChapterTwoDraft(entryExpression = "emptyCareerJourneyChapterTwoEntry()", activeEntryId = "") {
      const serializedId = JSON.stringify(activeEntryId);
      vm.runInContext(`
        beginCareerJourneyChapterTwoDraft(${entryExpression}, ${serializedId});
        careerJourneyFocusedChapterNumber = 2;
        renderCareerJourney();
        bindCareerJourneyActions();
      `, context);
    },
    beginChapterThreeNewMoment() {
      vm.runInContext(`
        beginCareerJourneyNewMoment();
        careerJourneyFocusedChapterNumber = 3;
        renderCareerJourney();
        bindCareerJourneyActions();
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

  await runScenario("Chapter 2 migrates a legacy saved experience into the collection and preserves its stable ID.", async () => {
    const journey = createJourneyHarness();
    journey.setLegacyChapterTwoEntry({
      id: "legacy_experience_1",
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
      endYear: "2024",
      seasonReflection: "Built calmer systems after a volatile stretch.",
    });
    journey.render();
    assert.equal(journey.read("careerJourneyChapterTwoEntries.length"), 1);
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].id"), "legacy_experience_1");
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), "legacy_experience_1");
  });

  await runScenario("Chapter 2 supports multiple experiences, isolated drafts, duplicate-looking entries, and chronological cards.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
      endYear: "2024",
      seasonReflection: "Built calmer systems after a volatile stretch.",
    });
    assert.equal(journey.read("careerJourneyChapterTwoEntries.length"), 1);
    const firstId = journey.read("careerJourneyChapterTwoEntries[0].id");
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), firstId);

    journey.click('[data-career-journey-open-chapter="2"]');
    assert.ok(journey.journeyHtml.includes("data-add-career-journey-entry"));
    journey.beginChapterTwoDraft();
    journey.input('[name="seasonTitle"]', "Analyst");
    assert.equal(journey.read("careerJourneyChapterTwoEntries.length"), 1);
    journey.submitChapterTwo({
      seasonTitle: "Analyst",
      organization: "Southridge Health",
      endYear: "2019",
      seasonReflection: "Learned how to steady chaotic handoffs.",
    });
    assert.equal(journey.read("careerJourneyChapterTwoEntries.length"), 2);
    const secondId = journey.read("careerJourneyChapterTwoEntries[1].id");
    assert.notEqual(secondId, firstId);
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), secondId);

    journey.beginChapterTwoDraft();
    journey.submitChapterTwo({
      seasonTitle: "Analyst",
      organization: "Southridge Health",
      endYear: "2019",
      seasonReflection: "A duplicate-looking visible card is allowed.",
    });
    assert.equal(journey.read("careerJourneyChapterTwoEntries.length"), 3);
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), journey.read("careerJourneyChapterTwoEntries[2].id"));
    assert.notEqual(
      journey.read("careerJourneyChapterTwoEntries[1].seasonReflection"),
      journey.read("careerJourneyChapterTwoEntries[2].seasonReflection")
    );
    journey.click('[data-career-journey-open-chapter="2"]');
    assert.ok(journey.journeyHtml.includes("3 experiences saved."));

    const operationsIndex = journey.journeyHtml.indexOf("Operations Lead");
    const analystIndex = journey.journeyHtml.indexOf("Analyst");
    assert.ok(operationsIndex >= 0 && analystIndex >= 0 && operationsIndex < analystIndex);
  });

  await runScenario("Chapter 2 chronological ordering uses start year first, end-year fallback, and stable order for ties and undated entries.", async () => {
    const journey = createJourneyHarness();
    journey.setChapterTwoEntries([
      { id: "undated_1", seasonTitle: "Undated A", organization: "", startYear: "", endYear: "", seasonReflection: "" },
      { id: "tied_1", seasonTitle: "Tied Earlier", organization: "", startYear: "2020", endYear: "2021", seasonReflection: "" },
      { id: "end_only_1", seasonTitle: "End Only Newer", organization: "", startYear: "", endYear: "2023", seasonReflection: "" },
      { id: "start_newest", seasonTitle: "Start Newest", organization: "", startYear: "2024", endYear: "", seasonReflection: "" },
      { id: "tied_2", seasonTitle: "Tied Later", organization: "", startYear: "2020", endYear: "2021", seasonReflection: "" },
      { id: "undated_2", seasonTitle: "Undated B", organization: "", startYear: "", endYear: "", seasonReflection: "" },
    ]);
    const orderedIds = Array.from(journey.read("getCareerJourneyChapterTwoEntriesForDisplay().map((entry) => entry.id)"));
    assert.deepEqual(orderedIds, ["start_newest", "end_only_1", "tied_1", "tied_2", "undated_1", "undated_2"]);
  });

  await runScenario("Chapter 2 edit and cancel behavior preserve saved records until save and keep the stable ID.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
      endYear: "2024",
      seasonReflection: "Built calmer systems after a volatile stretch.",
    });
    journey.click('[data-career-journey-open-chapter="2"]');
    const entryId = journey.read("careerJourneyChapterTwoEntries[0].id");
    journey.beginChapterTwoDraft(`getCareerJourneyChapterTwoEntryById(${JSON.stringify(entryId)})`, entryId);
    assert.equal(journey.read("isCareerJourneyChapterTwoDirty()"), false);
    journey.input('[name="organization"]', "Northwind Logistics");
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].organization"), "Northwind Labs");
    journey.input('[name="organization"]', "Northwind Labs");
    assert.equal(journey.read("isCareerJourneyChapterTwoDirty()"), false);
    journey.input('[name="organization"]', "Northwind Logistics");
    journey.click("[data-career-journey-cancel-chapter-two]");
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].organization"), "Northwind Labs");
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), entryId);

    journey.beginChapterTwoDraft(`getCareerJourneyChapterTwoEntryById(${JSON.stringify(entryId)})`, entryId);
    journey.submitChapterTwo({
      organization: "Northwind Logistics",
      seasonReflection: "Built calmer systems and clearer handoffs.",
    });
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].id"), entryId);
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].organization"), "Northwind Logistics");
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), entryId);
    assert.ok(journey.journeyHtml.includes("Northwind Logistics"));
  });

  await runScenario("Chapter 2 dirty-exit prompts support save, discard, and cancel navigation.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
    });
    journey.click('[data-career-journey-open-chapter="2"]');
    const entryId = journey.read("careerJourneyChapterTwoEntries[0].id");

    journey.beginChapterTwoDraft(`getCareerJourneyChapterTwoEntryById(${JSON.stringify(entryId)})`, entryId);
    journey.input('[name="organization"]', "Northwind Logistics");
    journey.queueConfirmResponses(false, false);
    journey.click('[data-career-journey-open-chapter="1"]');
    assert.equal(journey.read("careerJourneyFocusedChapterNumber"), 2);
    assert.equal(journey.read("careerJourneyChapterTwoEditing"), true);

    journey.queueConfirmResponses(false, true);
    journey.click("[data-career-journey-close-workspace]");
    assert.equal(journey.read("careerJourneyWorkspaceOpen"), false);
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].organization"), "Northwind Labs");

    journey.click("[data-start-career-journey]");
    journey.click('[data-career-journey-open-chapter="2"]');
    journey.beginChapterTwoDraft(`getCareerJourneyChapterTwoEntryById(${JSON.stringify(entryId)})`, entryId);
    journey.input('[name="organization"]', "Northwind Logistics");
    journey.queueConfirmResponses(true);
    journey.click('[data-career-journey-open-chapter="1"]');
    assert.equal(journey.read("careerJourneyFocusedChapterNumber"), 1);
    assert.equal(journey.read("careerJourneyChapterTwoEntries[0].organization"), "Northwind Logistics");
    assert.equal(journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId"), entryId);

    journey.click('[data-career-journey-open-chapter="2"]');
    journey.beginChapterTwoDraft();
    journey.input('[name="seasonTitle"]', "Unfinished draft");
    journey.click("[data-career-journey-cancel-chapter-two]");
    assert.equal(journey.read("careerJourneyChapterTwoEntries.length"), 1);
    assert.equal(journey.read("careerJourneyChapterTwoEditing"), false);
  });

  await runScenario("Chapter 3 selector keeps the active draft context while new saves update the next linked default and saved labels.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
      seasonReflection: "Built calmer systems after a volatile stretch.",
    });
    const firstId = journey.read("careerJourneyChapterTwoEntries[0].id");
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), firstId);

    journey.change('select[name="chapterThreeTimelineEntryId"]', "");
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), "");
    journey.change('select[name="chapterThreeTimelineEntryId"]', firstId);
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), firstId);

    journey.click('[data-career-journey-open-chapter="2"]');
    journey.beginChapterTwoDraft();
    journey.submitChapterTwo({
      seasonTitle: "Program Manager",
      organization: "Fabrikam",
      startYear: "2024",
      seasonReflection: "Held cross-team launches together.",
    });
    const secondId = journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId");
    assert.notEqual(secondId, firstId);
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), firstId);

    journey.beginChapterThreeNewMoment();
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), "");
    assert.ok(journey.journeyHtml.includes("Program Manager · Fabrikam (2024)"));
    journey.change('select[name="chapterThreeTimelineEntryId"]', secondId);
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), secondId);

    journey.context.fetch = async () => ({
      ok: true,
      json: async () => ({
        analysis: {
          reflection: "You kept the moving parts aligned under pressure.",
          followUpQuestion: "What were you protecting most in that moment?",
          possibleSignal: "You may create steadiness when the path is unclear.",
        },
      }),
    });
    journey.input('textarea[name="chapterThreeInitialResponse"]', "I coordinated a fragile launch.");
    journey.click("[data-career-journey-explore-story]");
    await new Promise((resolve) => setImmediate(resolve));
    journey.input('textarea[name="chapterThreeFollowUpResponse"]', "I was protecting trust across teams.");
    journey.click("[data-career-journey-save-moment]");
    assert.equal(journey.read("careerJourneyChapterThree.savedMoments[0].timelineEntryId"), secondId);
    assert.ok(journey.journeyHtml.includes("Program Manager · Fabrikam"));

    journey.click('[data-career-journey-open-chapter="2"]');
    journey.beginChapterTwoDraft(`getCareerJourneyChapterTwoEntryById(${JSON.stringify(secondId)})`, secondId);
    journey.submitChapterTwo({
      organization: "Fabrikam Labs",
    });
    journey.click('[data-career-journey-open-chapter="3"]');
    assert.ok(journey.journeyHtml.includes("Program Manager · Fabrikam Labs"));
    assert.equal(journey.read("careerJourneyChapterThree.chapterCompletionConfirmed"), false);
  });

  await runScenario("Chapter 3 selector preserves typed and voice-entered draft state across selection changes.", async () => {
    const journey = createJourneyHarness();
    journey.render();
    journey.click("[data-start-career-journey]");
    journey.submitChapterOne("I am ready.");
    journey.click("[data-start-career-journey-chapter-two]");
    journey.submitChapterTwo({
      seasonTitle: "Operations Lead",
      organization: "Northwind Labs",
      startYear: "2022",
      endYear: "2024",
      seasonReflection: "Built calmer systems after a volatile stretch.",
    });
    const firstId = journey.read("careerJourneyChapterTwoEntries[0].id");

    journey.click('[data-career-journey-open-chapter="2"]');
    journey.beginChapterTwoDraft();
    journey.submitChapterTwo({
      seasonTitle: "Advisor",
      organization: "",
      endYear: "2021",
      seasonReflection: "Supported teams through difficult transitions.",
    });
    const secondId = journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId");

    journey.click('[data-career-journey-open-chapter="3"]');
    journey.context.fetch = async () => ({
      ok: true,
      json: async () => ({
        analysis: {
          reflection: "You kept things steady when the launch started to wobble.",
          followUpQuestion: "What were you protecting most in that moment?",
          possibleSignal: "You may notice fragile moments early and respond calmly.",
        },
      }),
    });
    journey.input('textarea[name="chapterThreeInitialResponse"]', "I steadied a launch while people were overwhelmed.");
    journey.click("[data-career-journey-explore-story]");
    await new Promise((resolve) => setImmediate(resolve));
    journey.startVoice("followUpResponse");
    const recognition = journey.latestRecognition();
    journey.emitStart(recognition);
    journey.emitResult([{ transcript: "I protected the customer handoff.", isFinal: true }], recognition);
    journey.stopVoice();
    journey.emitEnd(recognition);

    journey.change('select[name="chapterThreeTimelineEntryId"]', secondId);
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), secondId);
    assert.equal(journey.fieldValue('textarea[name="chapterThreeInitialResponse"]'), "I steadied a launch while people were overwhelmed.");
    assert.equal(journey.fieldValue('textarea[name="chapterThreeFollowUpResponse"]'), "I protected the customer handoff.");
    assert.ok(journey.journeyHtml.includes("Advisor (2021)"));

    journey.change('select[name="chapterThreeTimelineEntryId"]', "");
    assert.equal(journey.read("careerJourneyChapterThree.draft.timelineEntryId"), "");
    assert.equal(journey.fieldValue('textarea[name="chapterThreeInitialResponse"]'), "I steadied a launch while people were overwhelmed.");
    assert.equal(journey.fieldValue('textarea[name="chapterThreeFollowUpResponse"]'), "I protected the customer handoff.");
    assert.ok(journey.journeyHtml.includes("Different experience"));
    assert.ok(journey.journeyHtml.includes("Operations Lead · Northwind Labs (2022-2024)"));
    assert.equal(journey.statusNode.textContent, "This moment is marked as a different experience.");

    journey.change('select[name="chapterThreeTimelineEntryId"]', firstId);
    assert.ok(journey.journeyHtml.includes("Operations Lead at Northwind Labs"));
    assert.equal(journey.statusNode.textContent, "This moment is connected to Operations Lead · Northwind Labs (2022-2024).");
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
    journey.change('select[name="chapterThreeTimelineEntryId"]', "");
    assert.equal(journey.statusNode.textContent, "This moment is marked as a different experience.");
    const linkedTimelineId = journey.read("careerJourneyChapterTwoMostRecentlySavedEntryId");
    journey.change('select[name="chapterThreeTimelineEntryId"]', linkedTimelineId);
    assert.equal(journey.statusNode.textContent, "This moment is connected to Operations Lead · Northwind Labs (2022-2024).");
    journey.change('select[name="chapterThreeTimelineEntryId"]', "");
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
