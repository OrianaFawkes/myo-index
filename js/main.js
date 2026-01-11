import { loadAnatomyData } from "./dataLoader.js";
import { findMatches, isExactMatch } from "./search.js";
import { renderMuscle, renderSuggestions, renderGuidance } from "./render.js";
import { clearSuggestions, renderPlaceholder } from "./utils.js";

const MYO_INDEX_VERSION = "0.1.0";

let anatomyData = [];
const inputEl = document.getElementById("inputText");
const suggestionsEl = document.getElementById("suggestions");
const outputEl = document.getElementById("output");

let selectedIndex = -1;

async function init() {
  anatomyData = await loadAnatomyData();
  renderPlaceholder(outputEl);
}

init();

/* ---------- Input Handling ---------- */
inputEl.addEventListener("input", () => {
  const query = inputEl.value.trim().toLowerCase();

  if (!query) {
    clearSuggestions(suggestionsEl);
    renderPlaceholder(outputEl);
    selectedIndex = -1;
    return;
  }

  const matches = findMatches(query, anatomyData);

  if (matches.length === 1 && isExactMatch(query, matches[0])) {
    clearSuggestions(suggestionsEl);
    renderMuscle(matches[0], outputEl);
  } else {
    selectedIndex = -1; // reset keyboard navigation
    renderSuggestions(matches, query, inputEl, suggestionsEl, outputEl);
    renderGuidance(matches, outputEl);
  }
});

/* ---------- Keyboard Navigation ---------- */
inputEl.addEventListener("keydown", (e) => {
  const items = suggestionsEl.querySelectorAll("li");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % items.length;
    updateHighlight(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateHighlight(items);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (selectedIndex === -1) selectedIndex = 0;
    items[selectedIndex].click();
    selectedIndex = -1;
  } else if (e.key === "Escape") {
    inputEl.value = "";
    clearSuggestions(suggestionsEl);
    renderPlaceholder(outputEl);
    selectedIndex = -1;
  }
});

function updateHighlight(items) {
  items.forEach((li, idx) => {
    li.classList.toggle("highlighted", idx === selectedIndex);
  });
}
