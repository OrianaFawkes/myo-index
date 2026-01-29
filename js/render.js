import { clearSuggestions } from "./utils.js";

export function renderMuscle(muscle, outputEl) {
  outputEl.className = "output";
  outputEl.innerHTML = `
    <h2>${muscle.name}</h2>
    ${muscle.region ? `<p class="muscle-meta">(${formatRegion(muscle.region)})</p>` : ""}
    ${renderList("Origin", muscle.origin)}
    ${renderList("Insertion", muscle.insertion)}
    ${renderList("Innervation", muscle.innervation)}
    ${renderList("Action", muscle.action)}
  `;
}

export function renderList(label, items) {
  if (!items || items.length === 0) return "";
  return `
    <div class="field">
      <strong>${label}</strong>
      <ul>
        ${items.map((i) => `<li>${sentenceCase(i)}</li>`).join("")}
      </ul>
    </div>
  `;
}

export function renderGuidance(matches, outputEl) {
  outputEl.className = "output error";
  outputEl.textContent =
    matches.length === 0
      ? "No matching muscles found."
      : "Keep typing or press Enter to select.";
}

export function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return text;
  return `
    ${text.slice(0, index)}<strong>${text.slice(index, index + query.length)}</strong>${text.slice(
      index + query.length,
    )}
  `;
}

export function renderSuggestions(
  matches,
  query,
  inputEl,
  suggestionsEl,
  inputWrapperEl,
  outputEl,
) {
  const hasMatches = matches.length > 0;
  const maxSuggestions = query.length <= 1 ? 5 : query.length === 2 ? 8 : 12;

  suggestionsEl.innerHTML = "";
  suggestionsEl.classList.toggle("hidden", !hasMatches);
  inputWrapperEl.classList.toggle("is-open", hasMatches);

  matches.slice(0, maxSuggestions).forEach((muscle) => {
    const li = document.createElement("li");

    li.innerHTML = highlightMatch(muscle.name, query);
    li.dataset.value = muscle.name;
    li.addEventListener("click", () => {
      inputEl.value = muscle.name;
      inputWrapperEl.classList.remove("is-open");
      clearSuggestions(suggestionsEl, inputWrapperEl);
      renderMuscle(muscle, outputEl);
    });

    suggestionsEl.appendChild(li);
  });
}

function formatRegion(region) {
  return region.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function sentenceCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
