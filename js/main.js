import { loadAnatomyData } from "./dataLoader.js";
import { findMatches, isExactMatch } from "./search.js";
import {
  renderRegionFilters,
  renderMuscle,
  renderSuggestions,
  renderGuidance,
} from "./render.js";
import { clearSuggestions, renderPlaceholder } from "./utils.js";

const MYO_INDEX_VERSION = "0.1.0";

let activeRegion = "All";
let anatomyData = [];
let baseQuery = "";
let selectedIndex = -1;

const rootEl = document.documentElement;
const regionFiltersEl = document.getElementById("regionFilters");
const inputEl = document.getElementById("search-input");
const inputWrapperEl = inputEl.closest(".input-wrapper");
const suggestionsEl = document.getElementById("suggestions");
const outputEl = document.getElementById("output");
const themeToggleEl = document.getElementById("themeToggle");
const themePopoverEl = document.getElementById("themePopover");

const savedColor = localStorage.getItem("mainColor");
if (savedColor) {
  rootEl.style.setProperty("--main-color", savedColor);
}

async function init() {
  anatomyData = await loadAnatomyData();
  renderPlaceholder(outputEl);
  renderRegionFilters(regionFiltersEl, activeRegion, handleRegionSelect);
}

init();

document.querySelectorAll("#themePopover [data-color]").forEach((btn) => {
  btn.style.backgroundColor = btn.dataset.color;

  btn.addEventListener("click", () => {
    const color = btn.dataset.color;
    rootEl.style.setProperty("--main-color", color);
    localStorage.setItem("mainColor", color);

    themePopoverEl.classList.add("hidden");
  });
});

document.addEventListener("click", () => {
  themePopoverEl.classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
  const isAlt = e.altKey; // Alt (Win) or Option (Mac)
  const isShift = e.shiftKey; // Shift pressed
  const items = suggestionsEl.querySelectorAll("li");
  const isTyping = document.activeElement === inputEl;

  if (isAlt && !isShift && e.key.toLocaleLowerCase() === "r") {
    e.preventDefault();
    cycleRegion(1);
  }

  if (isAlt && isShift && e.key.toLocaleLowerCase() === "r") {
    e.preventDefault();
    cycleRegion(-1);
  }

  if (e.key === "t" && !isTyping) {
    e.preventDefault();
    inputEl.focus();
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    moveSelection(1);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    moveSelection(-1);
  }

  if (!items.length) return;

  if (e.key === "Enter") {
    if (!isTyping) return;

    e.preventDefault();
    if (selectedIndex === -1) selectedIndex = 0;

    items[selectedIndex].click();
    selectedIndex = -1;
  }

  if (e.key === "Escape") {
    e.preventDefault();

    inputEl.value = "";
    selectedIndex = -1;

    clearSuggestions(suggestionsEl, inputWrapperEl);
    renderPlaceholder(outputEl);
  }
});

inputEl.addEventListener("input", () => {
  const query = inputEl.value.trim().toLowerCase();

  baseQuery = inputEl.value;

  if (!query) {
    clearSuggestions(suggestionsEl, inputWrapperEl);
    renderPlaceholder(outputEl);
    selectedIndex = -1;
    return;
  }

  const matches = findMatches(query, anatomyData, activeRegion);

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
      outputEl,
    );
    renderGuidance(matches, outputEl);
  }
});

themeToggleEl.addEventListener("click", (e) => {
  e.stopPropagation();
  themePopoverEl.classList.toggle("hidden");
});

function handleRegionSelect(group) {
  activeRegion = group;

  // Re-run search with current input
  const query = inputEl.value.trim().toLowerCase();
  if (!query) return;

  const matches = findMatches(query, anatomyData, activeRegion);
  if (matches.length === 1 && isExactMatch(query, matches[0])) {
    clearSuggestions(suggestionsEl, inputWrapperEl);
    renderMuscle(matches[0], outputEl);
  } else {
    selectedIndex = -1;
    renderSuggestions(
      matches,
      query,
      inputEl,
      suggestionsEl,
      inputWrapperEl,
      outputEl,
    );
    renderGuidance(matches, outputEl);
  }
}

function cycleRegion(delta) {
  const chips = Array.from(regionFiltersEl.querySelectorAll(".region-chip"));
  if (!chips.length) return;

  const activeIndex = chips.findIndex((chip) =>
    chip.classList.contains("active"),
  );

  let nextIndex = (activeIndex + delta + chips.length) % chips.length;

  // Update UI
  chips.forEach((chip) => chip.classList.remove("active"));
  chips[nextIndex].classList.add("active");

  // Update state + rerun search
  handleRegionSelect(chips[nextIndex].dataset.group);
}

function moveSelection(delta) {
  const items = suggestionsEl.querySelectorAll("li");
  if (!items.length) return;

  selectedIndex += delta;

  if (selectedIndex >= items.length) {
    selectedIndex = -1;
    inputEl.value = baseQuery;
  } else if (selectedIndex < -1) {
    selectedIndex = items.length - 1;
    inputEl.value = items[selectedIndex].dataset.value;
  } else if (selectedIndex === -1) {
    inputEl.value = baseQuery;
  } else {
    inputEl.value = items[selectedIndex].dataset.value;
  }

  items.forEach((li, idx) => {
    li.classList.toggle("highlighted", idx === selectedIndex);
  });
}
