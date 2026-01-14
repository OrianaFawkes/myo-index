export function clearSuggestions(suggestionsEl, inputWrapperEl) {
  suggestionsEl.innerHTML = "";
  suggestionsEl.classList.add("hidden");
  inputWrapperEl.classList.remove("is-open");
}

export function renderPlaceholder(outputEl) {
  outputEl.className = "output placeholder";
  outputEl.textContent = "Start typing to see anatomy details.";
}
