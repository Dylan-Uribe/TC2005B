export async function fetchFromApi(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("API error:", error);
        return null;
    }
}