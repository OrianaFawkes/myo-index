export function clearSuggestions(suggestionsEl) {
  suggestionsEl.innerHTML = "";
  suggestionsEl.classList.add("hidden");
}

export function renderPlaceholder(outputEl) {
  outputEl.className = "output placeholder";
  outputEl.textContent = "Start typing to see anatomy details.";
}
