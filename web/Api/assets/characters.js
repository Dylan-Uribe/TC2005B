import { fetchFromApi } from "./api.js";

export async function fetchCharacters(url) {
    const data = await fetchFromApi(url);
    return {
        characters: Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
                ? data
                : [],
        links: data?.links || {},
        meta: data?.meta || {}
    };
}

export function renderCharacters(characters) {
    const container = document.getElementById("character-container");
    if (!characters || characters.length === 0) {
        container.innerHTML = "<p>No characters found.</p>";
    } else {
        container.innerHTML = characters.map(character => `
            <div class="character-card">
                <h3>${character.name}</h3>
                <img src="${character.image}" alt="${character.name}"/>
                <p><strong>Race:</strong> ${character.race}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
            </div>
        `).join("");
    }
}


export function renderPagination(links, meta, onPageChange) {
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
            if (onPageChange) onPageChange(btn.dataset.url);
        });
    });
}