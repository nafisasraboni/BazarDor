export async function getBazarData() {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor", {
      cache: "no-store", 
    });
    const data = await res.json();
    return data; 
  } catch (error) {
    console.error("Failed to fetch bazar data:", error);
    return null;
  }
}