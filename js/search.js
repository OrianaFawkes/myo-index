import { REGION_TO_GROUP } from "./filter.js";

export function findMatches(query, anatomyData, activeRegionGroup) {
  return anatomyData
    .filter((muscle) => {
      if (!activeRegionGroup || activeRegionGroup === "All") return true;

      const group = REGION_TO_GROUP[muscle.region] ?? "Unknown";
      return group === activeRegionGroup;
    })
    .map((muscle) => ({
      muscle,
      score: getMatchScore(query, muscle),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.muscle);
}

export function isExactMatch(query, muscle) {
  return query === muscle.id || query === muscle.name.toLowerCase();
}

function getMatchScore(query, muscle) {
  const name = muscle.name.toLowerCase();
  const id = muscle.id.toLowerCase();
  const words = name.split(" ");

  if (query === id || query === name) return 100;

  if (id.startsWith(query) || name.startsWith(query)) return 90;

  if (words.some((w) => w.startsWith(query))) return 80;

  if (words.some((w) => w.endsWith(query))) return 60;

  if (name.includes(query)) return 40;

  return 0;
}
