(function attachNextMoveVoiceSession(root) {
  const DEFAULT_LANGUAGE = "en-US";
  const DEFAULT_MAX_NO_SPEECH_RETRIES = 2;
  const RECOVERABLE_ERRORS = new Set(["no-speech"]);
  const DENIED_ERRORS = new Set(["not-allowed", "service-not-allowed"]);

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function buildTranscriptChunk(results, lastCommittedIndex) {
    const committed = [];
    let nextIndex = lastCommittedIndex;

    for (let index = lastCommittedIndex; index < results.length; index += 1) {
      const result = results[index];
      if (!result || !result.isFinal) {
        continue;
      }

      const transcript = normalizeText(result[0]?.transcript || "");
      if (!transcript) {
        nextIndex = index + 1;
        continue;
      }

      committed.push(transcript);
      nextIndex = index + 1;
    }

    return {
      text: committed.join(" ").trim(),
      nextIndex,
    };
  }

  function createVoiceSession(options = {}) {
    const maxNoSpeechRetries = Number.isInteger(options.maxNoSpeechRetries)
      ? options.maxNoSpeechRetries
      : DEFAULT_MAX_NO_SPEECH_RETRIES;

    let recognition = null;
    let sessionRequested = false;
    let explicitStop = false;
    let disposed = false;
    let noSpeechRetries = 0;
    let lastFinalResultIndex = 0;
    let committedDuringAttempt = false;
    let lastError = "";
    let lastMessage = "";
    let state = "idle";

    function notifyState(nextState, message = "") {
      state = nextState;
      lastMessage = message;
      options.onStateChange?.(nextState, message);
    }

    function createRecognition() {
      const factory = options.createRecognition
        || (() => {
          const Recognition = root.SpeechRecognition || root.webkitSpeechRecognition;
          return Recognition ? new Recognition() : null;
        });
      return factory();
    }

    function shouldRestartForNormalEnd() {
      return sessionRequested
        && !explicitStop
        && !disposed
        && lastError === ""
        && options.shouldContinueSession?.() !== false;
    }

    function shouldRestartForNoSpeech() {
      return sessionRequested
        && !explicitStop
        && !disposed
        && options.shouldContinueSession?.() !== false
        && noSpeechRetries < maxNoSpeechRetries;
    }

    function detachRecognition() {
      if (!recognition) {
        return;
      }

      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition = null;
    }

    function finalizeAttempt() {
      detachRecognition();
      lastFinalResultIndex = 0;
      committedDuringAttempt = false;
    }

    function startAttempt() {
      if (!sessionRequested || explicitStop || disposed) {
        return;
      }

      const nextRecognition = createRecognition();
      if (!nextRecognition) {
        sessionRequested = false;
        notifyState("unsupported", options.messages?.unsupported || "");
        return;
      }

      recognition = nextRecognition;
      lastFinalResultIndex = 0;
      committedDuringAttempt = false;
      lastError = "";

      nextRecognition.lang = options.lang || DEFAULT_LANGUAGE;
      nextRecognition.interimResults = true;
      nextRecognition.continuous = true;
      nextRecognition.maxAlternatives = 1;

      nextRecognition.onstart = () => {
        noSpeechRetries = 0;
        notifyState("listening", options.messages?.listening || "");
      };

      nextRecognition.onresult = (event) => {
        const results = Array.from(event.results || []);
        const chunk = buildTranscriptChunk(results, lastFinalResultIndex);
        lastFinalResultIndex = chunk.nextIndex;

        if (!chunk.text) {
          return;
        }

        committedDuringAttempt = true;
        notifyState("processing", options.messages?.processing || "");
        options.onFinalTranscript?.(chunk.text);
      };

      nextRecognition.onerror = (event = {}) => {
        lastError = String(event.error || "").trim() || "error";

        if (DENIED_ERRORS.has(lastError)) {
          sessionRequested = false;
          notifyState("denied", options.messages?.denied || "");
          return;
        }

        if (!RECOVERABLE_ERRORS.has(lastError)) {
          sessionRequested = false;
          notifyState("error", options.messages?.error || "");
        }
      };

      nextRecognition.onend = () => {
        finalizeAttempt();

        if (disposed) {
          notifyState("idle", options.messages?.idle || "");
          return;
        }

        if (explicitStop) {
          sessionRequested = false;
          explicitStop = false;
          notifyState(committedDuringAttempt ? "complete" : "idle", committedDuringAttempt ? options.messages?.complete || "" : options.messages?.idle || "");
          return;
        }

        if (lastError === "no-speech") {
          if (shouldRestartForNoSpeech()) {
            noSpeechRetries += 1;
            notifyState("restarting", "");
            startAttempt();
            return;
          }

          sessionRequested = false;
          notifyState("no-speech", options.messages?.["no-speech"] || "");
          return;
        }

        if (lastError) {
          return;
        }

        if (shouldRestartForNormalEnd()) {
          notifyState("restarting", "");
          startAttempt();
          return;
        }

        sessionRequested = false;
        notifyState(committedDuringAttempt ? "complete" : "idle", committedDuringAttempt ? options.messages?.complete || "" : options.messages?.idle || "");
      };

      notifyState("requesting", options.messages?.requesting || "");
      nextRecognition.start();
    }

    return {
      start() {
        disposed = false;
        explicitStop = false;
        sessionRequested = true;
        noSpeechRetries = 0;
        startAttempt();
      },
      stop() {
        if (!recognition) {
          sessionRequested = false;
          explicitStop = false;
          notifyState("idle", options.messages?.idle || "");
          return;
        }

        explicitStop = true;
        notifyState("processing", options.messages?.processing || "");
        try {
          recognition.stop();
        } catch (error) {
          finalizeAttempt();
          sessionRequested = false;
          explicitStop = false;
          notifyState("idle", options.messages?.idle || "");
        }
      },
      dispose() {
        disposed = true;
        sessionRequested = false;
        explicitStop = false;
        lastError = "";

        if (recognition) {
          try {
            recognition.stop();
          } catch (error) {
            finalizeAttempt();
          }
        }

        notifyState("idle", options.messages?.idle || "");
      },
      getState() {
        return state;
      },
      getMessage() {
        return lastMessage;
      },
      isSessionRequested() {
        return sessionRequested;
      },
    };
  }

  const api = { createVoiceSession };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.NextMoveVoiceSession = api;
})(typeof window !== "undefined" ? window : globalThis);
