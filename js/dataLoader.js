export async function loadAnatomyData(url = "./data/muscles.json") {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to load anatomy data:", err);
    return [];
  }
}
