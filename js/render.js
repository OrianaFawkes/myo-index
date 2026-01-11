import { clearSuggestions } from "./utils.js";

export function renderMuscle(muscle, outputEl) {
  outputEl.className = "output";
  outputEl.innerHTML = `
    <h3>${muscle.name}</h3>
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
        ${items.map((i) => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;
}

export function renderGuidance(matches, outputEl) {
  outputEl.className = "output error";
  outputEl.textContent =
    matches.length === 0
      ? "No matching muscles found."
      : "Keep typing to select a muscle.";
}

export function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return text;
  return `
    ${text.slice(0, index)}
    <strong>${text.slice(index, index + query.length)}</strong>
    ${text.slice(index + query.length)}
  `;
}

export function renderSuggestions(
  matches,
  query,
  inputEl,
  suggestionsEl,
  outputEl
) {
  suggestionsEl.innerHTML = "";
  suggestionsEl.classList.toggle("hidden", matches.length === 0);

  // reset navigation index
  let selectedIndex = -1;

  matches.forEach((muscle, idx) => {
    const li = document.createElement("li");
    li.innerHTML = highlightMatch(muscle.name, query);

    li.addEventListener("click", () => {
      inputEl.value = muscle.name.toLowerCase();
      selectedIndex = -1;
      clearSuggestions(suggestionsEl);
      renderMuscle(muscle, outputEl);
    });

    suggestionsEl.appendChild(li);
  });

  return { selectedIndex }; // return index to allow keyboard navigation tracking
}
