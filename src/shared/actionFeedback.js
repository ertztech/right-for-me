(function attachActionFeedback(root) {
  function createActionFeedback({ button, statusNode, idleText = "", workingText, successText, failureText }) {
    const originalText = idleText || button?.textContent || "";

    function setState(state, message) {
      if (button) {
        button.dataset = button.dataset || {};
        button.dataset.actionState = state;
        button.disabled = state === "working";
        button.textContent = state === "working" && workingText ? workingText : originalText;
      }

      if (statusNode) {
        statusNode.dataset = statusNode.dataset || {};
        statusNode.dataset.actionState = state;
        statusNode.textContent = message || "";
      }
    }

    async function run(action) {
      if (button?.disabled) {
        return undefined;
      }

      setState("working", workingText || "Working...");

      try {
        const result = await action();
        const message = result?.message || successText || "Done.";
        setState("success", message);
        return result;
      } catch (error) {
        const message = error?.message || failureText || "Something went wrong.";
        setState("failure", message);
        return { error, message };
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    }

    setState("idle", "");

    return {
      run,
      setIdle: (message = "") => setState("idle", message),
      setWorking: (message = workingText || "Working...") => setState("working", message),
      setSuccess: (message = successText || "Done.") => setState("success", message),
      setFailure: (message = failureText || "Something went wrong.") => setState("failure", message),
    };
  }

  const api = {
    createActionFeedback,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.NextMoveActionFeedback = api;
})(typeof window !== "undefined" ? window : globalThis);
