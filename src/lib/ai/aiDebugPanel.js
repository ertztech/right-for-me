(function attachAIDebugPanel(root) {
  function initializeAIDebugPanel() {
    const panel = document.createElement("details");
    panel.className = "ai-debug-panel";
    panel.innerHTML = `
      <summary>
        <span>AI Debug</span>
        <strong data-ai-debug-mode>mode unknown</strong>
      </summary>
      <div class="ai-debug-panel-body" data-ai-debug-body>
        <p class="helper-copy">AI debug details are available when the app is opened through the local server.</p>
      </div>
    `;

    document.body.appendChild(panel);
    panel.addEventListener("toggle", () => {
      if (panel.open) {
        refreshAIDebugPanel();
      }
    });

    root.addEventListener("nextmove:ai-debug-updated", refreshAIDebugPanel);
    refreshAIDebugPanel();
  }

  async function refreshAIDebugPanel() {
    const panel = document.querySelector(".ai-debug-panel");
    if (!panel) {
      return;
    }

    const modeNode = panel.querySelector("[data-ai-debug-mode]");
    const bodyNode = panel.querySelector("[data-ai-debug-body]");

    try {
      const response = await fetch("/api/ai-debug");
      if (!response.ok) {
        throw new Error("Debug endpoint unavailable.");
      }

      const payload = await response.json();
      const latest = payload.latestRequest;
      modeNode.textContent = `${payload.aiMode}${payload.aiTestMode ? " test mode" : ""}`;
      panel.dataset.aiMode = payload.aiMode || "live";

      if (!latest) {
        bodyNode.innerHTML = `
          <p class="helper-copy">No AI request has been captured yet.</p>
          ${debugRow("AI mode", payload.aiMode || "live")}
          ${debugRow("AI Test Mode", payload.aiTestMode ? "enabled" : "disabled")}
        `;
        return;
      }

      bodyNode.innerHTML = `
        <div class="ai-debug-grid">
          ${debugRow("AI mode", latest.mode)}
          ${debugRow("AI Test Mode", latest.testModeEnabled ? "enabled" : "disabled")}
          ${debugRow("Timestamp", latest.timestamp)}
          ${debugRow("Flow", latest.flowName)}
          ${debugRow("Duration", latest.durationMs === null ? "" : `${latest.durationMs}ms`)}
          ${debugRow("Error", latest.errorMessage)}
        </div>
        ${debugBlock("Input summary", latest.inputSummary)}
        ${debugBlock("Raw response", latest.rawResponse)}
        ${debugBlock("Parsed response", latest.parsedResponse)}
      `;
    } catch (error) {
      modeNode.textContent = "server unavailable";
      bodyNode.innerHTML = `
        <p class="helper-copy">Open the app from <code>http://localhost:4173</code> to inspect AI debug details.</p>
      `;
    }
  }

  function debugRow(label, value) {
    return `
      <div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(formatValue(value))}</dd>
      </div>
    `;
  }

  function debugBlock(label, value) {
    return `
      <section class="ai-debug-block">
        <h3>${escapeHtml(label)}</h3>
        <pre>${escapeHtml(formatPayload(value))}</pre>
      </section>
    `;
  }

  function formatPayload(value) {
    if (value === null || value === undefined || value === "") {
      return "None captured.";
    }

    if (typeof value === "string") {
      return value;
    }

    return JSON.stringify(value, null, 2);
  }

  function formatValue(value) {
    if (value === null || value === undefined || value === "") {
      return "None";
    }

    return String(value);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const api = {
    initializeAIDebugPanel,
    refreshAIDebugPanel,
  };

  root.RightForMeAIDebugPanel = api;
})(window);
