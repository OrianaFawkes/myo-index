import { loadAnatomyData } from "./dataLoader.js";
import { findMatches, isExactMatch } from "./search.js";
import { renderMuscle, renderSuggestions, renderGuidance } from "./render.js";
import { clearSuggestions, renderPlaceholder } from "./utils.js";

const MYO_INDEX_VERSION = "0.1.0";

let anatomyData = [];
let baseQuery = "";
let selectedIndex = -1;

const inputEl = document.getElementById("search-input");
const inputWrapperEl = inputEl.closest(".input-wrapper");
const suggestionsEl = document.getElementById("suggestions");
const outputEl = document.getElementById("output");

async function init() {
  anatomyData = await loadAnatomyData();
  renderPlaceholder(outputEl);
}

init();

inputEl.addEventListener("input", () => {
  const query = inputEl.value.trim().toLowerCase();

  baseQuery = inputEl.value;

  if (!query) {
    clearSuggestions(suggestionsEl, inputWrapperEl);
    renderPlaceholder(outputEl);
    selectedIndex = -1;
    return;
  }

  const matches = findMatches(query, anatomyData);

  if (matches.length === 1 && isExactMatch(query, matches[0])) {
    clearSuggestions(suggestionsEl, inputWrapperEl);
    renderMuscle(matches[0], outputEl);
  } else {
    selectedIndex = -1; // reset keyboard navigation
    renderSuggestions(
      matches,
      query,
      inputEl,
      suggestionsEl,
      inputWrapperEl,
      outputEl
    );
    renderGuidance(matches, outputEl);
  }
});

inputEl.addEventListener("keydown", (e) => {
  const items = suggestionsEl.querySelectorAll("li");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();

    selectedIndex++;

    if (selectedIndex >= items.length) {
      selectedIndex = -1;
      inputEl.value = baseQuery;
    } else {
      inputEl.value = items[selectedIndex].dataset.value;
    }

    updateHighlight(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();

    selectedIndex--;

    if (selectedIndex < -1) {
      selectedIndex = items.length - 1;
      inputEl.value = items[selectedIndex].dataset.value;
    } else if (selectedIndex === -1) {
      inputEl.value = baseQuery;
    } else {
      inputEl.value = items[selectedIndex].dataset.value;
    }

    updateHighlight(items);
  } else if (e.key === "Enter") {
    e.preventDefault();

    if (selectedIndex === -1) selectedIndex = 0;

    items[selectedIndex].click();
    selectedIndex = -1;
  } else if (e.key === "Escape") {
    e.preventDefault();

    inputEl.value = "";
    selectedIndex = -1;

    clearSuggestions(suggestionsEl, inputWrapperEl);
    renderPlaceholder(outputEl);
  }
});

function updateHighlight(items) {
  items.forEach((li, idx) => {
    li.classList.toggle("highlighted", idx === selectedIndex);
  });
}
