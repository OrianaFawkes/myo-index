export function findMatches(query, anatomyData) {
  return anatomyData.filter(
    (muscle) =>
      muscle.id.startsWith(query) || muscle.name.toLowerCase().startsWith(query)
  );
}

export function isExactMatch(query, muscle) {
  return query === muscle.id || query === muscle.name.toLowerCase();
}
