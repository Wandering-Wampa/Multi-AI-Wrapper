const LABEL_TO_MODEL = {
  "ChatGPT": "chatgpt",
  "Claude": "claude",
  "Copilot": "copilot",
  "Gemini": "gemini",
  "Perplexity": "perplexity"
};

function injectActiveTabStyles() {
  // This guarantees a visible "blue active tab" even if your CSS isn't wired to our class names
  const style = document.createElement("style");
  style.id = "multi-ai-active-tab-style";
  style.textContent = `
    .multi-ai-tab-active {
      background: #2f6feb !important;
      color: #ffffff !important;
      border-color: #2f6feb !important;
    }
  `;
  document.head.appendChild(style);
}

function getTabButtons() {
  // Try common containers first, then fall back to all buttons
  const candidates =
    document.querySelectorAll("[data-model]")?.length
      ? Array.from(document.querySelectorAll("[data-model]"))
      : Array.from(document.querySelectorAll("button"));

  // Keep only the buttons that match our known tab labels
  return candidates.filter((btn) => {
    const label = (btn.textContent || "").trim();
    return !!LABEL_TO_MODEL[label];
  });
}

function setActiveTabUI(modelName) {
  const buttons = getTabButtons();

  buttons.forEach((btn) => {
    const label = (btn.textContent || "").trim();
    const btnModel = LABEL_TO_MODEL[label];
    const isActive = btnModel === modelName;

    // Hard guarantee: apply our own class that makes the button blue
    btn.classList.toggle("multi-ai-tab-active", isActive);
  });
}

function wireTabClicks() {
  const buttons = getTabButtons();

  buttons.forEach((btn) => {
    const label = (btn.textContent || "").trim();
    const modelName = LABEL_TO_MODEL[label];
    if (!modelName) return;

    btn.addEventListener("click", () => {
      window.electronAPI.switchModel(modelName);

      // Immediate visual feedback (main will also broadcast the official state)
      setActiveTabUI(modelName);
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  injectActiveTabStyles();
  wireTabClicks();

  // Default highlight at startup (main should also broadcast, but this prevents "no blue" state)
  setActiveTabUI("chatgpt");
});

// Main-process broadcasts (hotkeys / programmatic switches)
window.electronAPI.onActiveModelChanged((modelName) => {
  setActiveTabUI(modelName);
});
