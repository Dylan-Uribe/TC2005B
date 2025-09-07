const API_URL = "https://dragonball-api.com/api";
const CHARACTER_ENDPOINT = `${API_URL}/characters`;

async function fetchCharacters(name = "") {
    try {
      let url = CHARACTER_ENDPOINT;
      if (name) {
          url += `?name=${encodeURIComponent(name)}`;
          console.log("Fetching characters with name:", url);
      }
      const response = await fetch(url);
      const data = await response.json();
      
      if (Array.isArray(data.items)) {
          return data.items;
      }

      if (Array.isArray(data)) {
          return data;
      }
      return [];
    }
    catch (error) {
      console.error("Error fetching characters:", error);
    }
}

async function renderCharacters(name = "") {
    const characters = await fetchCharacters(name);
    const container = document.getElementById("character-container");
    if (!characters || characters.length === 0) {
        container.innerHTML = "<p>No characters found.</p>";
        return;
    }
    container.innerHTML = characters.map(character => `
        <div class="character-card">
            <h3>${character.name}</h3>
            <img src="${character.image}" alt="${character.name}" width="150"/>
            <p><strong>Race:</strong> ${character.race}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
        </div>
    `).join("");
}

document.addEventListener('DOMContentLoaded', function() {
    renderCharacters();

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', function() {
        const name = searchInput.value.trim();
        renderCharacters(name);
    });
});