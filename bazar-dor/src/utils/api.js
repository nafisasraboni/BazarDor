const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export async function fetchAllProducts() {
    try {
        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function fetchCategories() {
    try {
        const res = await fetch(`${BASE_URL}/categories`);
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}