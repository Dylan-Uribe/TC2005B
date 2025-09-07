import { fetchCharacters, renderCharacters, renderPagination } from './characters.js';

const CHARACTER_ENDPOINT = "https://dragonball-api.com/api/characters";
const LIMIT = 10;

async function loadAndRender(url) {
    const { characters, links, meta } = await fetchCharacters(url);
    console.log(url)
    renderCharacters(characters);
    renderPagination(links, meta, loadAndRender);
}

document.addEventListener('DOMContentLoaded', function() {
    const DEFAULT_URL = `${CHARACTER_ENDPOINT}?limit=${LIMIT}`;
    loadAndRender(DEFAULT_URL);

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', function() {
        const name = searchInput.value.trim();
        let url = `${CHARACTER_ENDPOINT}?limit=${LIMIT}`;
        if (name) url += `&name=${encodeURIComponent(name)}`;
        loadAndRender(url);
    });
});