const API_BASE_URL = "https://dragonball-api.com/api";
const CHARACTER_ENDPOINT = `${API_BASE_URL}/characters`;
const LIMIT = 10;

let currentName = "";
const DEFAULT_URL = `${CHARACTER_ENDPOINT}?limit=${LIMIT}`;

async function fetchCharacters(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            characters: Array.isArray(data.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [],
            links: data.links || {},
            meta: data.meta || {}
        };
    } catch (error) {
        console.error("Error fetching characters:", error);
        return { characters: [], links: {}, meta: {} };
    }
}

async function renderCharacters(url = DEFAULT_URL) {
    const { characters, links, meta } = await fetchCharacters(url);
    const container = document.getElementById("character-container");
    if (!characters || characters.length === 0) {
        container.innerHTML = "<p>No characters found.</p>";
    } else {
        container.innerHTML = characters.map(character => `
            <div class="character-card">
                <h3>${character.name}</h3>
                <img src="${character.image}" alt="${character.name}" width="150"/>
                <p><strong>Race:</strong> ${character.race}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
            </div>
        `).join("");
    }
    renderPagination(links, meta);
}

function renderPagination(links, meta) {
    const pagination = document.getElementById("pagination");
    let buttons = "";

    if (links.first) {
        buttons += `<button data-url="${links.first}">First</button>`;
    }
    if (links.previous) {
        buttons += `<button data-url="${links.previous}">Previous</button>`;
    }
    if (links.next) {
        buttons += `<button data-url="${links.next}">Next</button>`;
    }
    if (links.last) {
        buttons += `<button data-url="${links.last}">Last</button>`;
    }
    if (meta.currentPage && meta.totalPages) {
        buttons += `<span> Page ${meta.currentPage} of ${meta.totalPages} </span>`;
    }

    pagination.innerHTML = buttons;

    pagination.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            renderCharacters(btn.dataset.url);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderCharacters();

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', function() {
        currentName = searchInput.value.trim();
        let url = `${CHARACTER_ENDPOINT}?page=1&limit=${LIMIT}`;
        if (currentName) {
            url += `&name=${encodeURIComponent(currentName)}`;
        }
        renderCharacters(url);
    });
});