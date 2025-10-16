document.addEventListener('DOMContentLoaded', () => {

    const gardenGrid = document.getElementById('garden-grid');
    const plantModal = document.getElementById('plant-modal');
    const plantForm = document.getElementById('plant-form');
    const cancelBtn = document.getElementById('cancel-btn');

    const waterBtn = document.getElementById('water-btn');
    const harvestBtn = document.getElementById('harvest-btn');
    const plantedCountSpan = document.getElementById('planted-count');
    const matureCountSpan = document.getElementById('mature-count');
    const harvestedCountSpan = document.getElementById('harvested-count');

    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');

    const plantListUl = document.getElementById('plant-list');

    function saveState(){
        localStorage.setItem('gardenState', JSON.stringify(state));
    }

    function loadState(){
        const savedState = localStorage.getItem('gardenState');
        if(savedState){
            state = JSON.parse(savedState);
        }
    }

    const plantTypes = {
        seedling: {planted: '&#127793;', mature: '&#127807;'},
        tulip: {planted: '&#127799;', mature: '&#127799;'},
        cactus: {planted: '&#127797;', mature: '&#127797;'},
        strawberry: {planted: '&#127825;', mature: '&#127825;'}
    };

    let state = {
        grid: [],
        plantingCellId: null,
        counters:{
            planted: 0,
            mature: 0,
            harvested: 0
        },

        filters: {
            searchTerm: '',
            filterBy: 'all'
        }
    };

    function createGrid(){
        for(let i = 0; i< 64; i++){
            state.grid.push({
                id: i,
                status: 'empty'
            });
        }
    }

    function handleGridClick(event){

        const clickedCell = event.target.closest('.cell');

        if(!clickedCell) return;

        const cellId = parseInt(clickedCell.dataset.id, 10);
        const cellState = state.grid.find(cell => cell.id === cellId);

        if(cellState.status === 'empty'){
            state.plantingCellId = cellId;
            toggleModal(true);
        }
    }

    function handleFormSubmit(event){
        event.preventDefault();

        const plantType = document.getElementById('plant-type').value;
        const plantName = document.getElementById('plant-name').value;

        if(state.plantingCellId !== null){
            plantSeed(state.plantingCellId, plantType, plantName);
            renderGrid();
            renderStats();
            renderSidebar();
            saveState();
        }

        toggleModal(false);
    }

    function toggleModal(show){
        if(show){
            plantModal.classList.add('visible');
            plantModal.setAttribute('aria-hidden', 'false');
        }
        else{
            plantModal.classList.remove('visible');
            plantModal.setAttribute('aria-hidden', 'true');
            state.plantingCellId = null;
            plantForm.reset();
        }
    }

    function plantSeed(cellId, type, name) {
        const cellToPlant = state.grid.find(cell => cell.id === cellId);
        if (cellToPlant) {
            cellToPlant.status = 'planted';
            cellToPlant.plantType = type;
            cellToPlant.name = name;
            cellToPlant.plantEmoji = plantTypes[type].planted;
            cellToPlant.matureEmoji = plantTypes[type].mature;
            cellToPlant.harvestEmoji = plantTypes[type].harvested;
            state.counters.planted++;
        }
    }

    function waterPlants() {
        state.grid.forEach(cell => {
            if(cell.status === 'planted'){
                cell.status = 'mature';
                cell.plantEmoji = cell.matureEmoji;

                state.counters.planted--;
                state.counters.mature++;
            }
        });
    }

    function harvestPlants() {
        state.grid.forEach(cell => {
            if (cell.status === 'mature') {
                cell.status = 'empty';
                cell.plantType = null;
                cell.name = null;
                cell.plantEmoji = null;
                cell.matureEmoji = null;

                state.counters.mature--;
                state.counters.harvested++;
            }
        });
    }
    function renderGrid() {
        gardenGrid.innerHTML = '';

        state.grid.forEach(cellState => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            
            cellElement.dataset.id = cellState.id;
            cellElement.dataset.status = cellState.status;

            if(cellState.status != 'empty'){
                cellElement.innerHTML = cellState.plantEmoji;
                cellElement.style.fontSize = '2rem';
                cellElement.style.textAlign = 'center';
            }

            gardenGrid.appendChild(cellElement);
        });
    }

    function renderSidebar() {
        plantListUl.innerHTML = '';

        let filteredPlants = state.grid.filter(cell => cell.status !== 'empty');

        if (state.filters.filterBy !== 'all') {
            filteredPlants = filteredPlants.filter(plant => plant.status === state.filters.filterBy);
        }

        if (state.filters.searchTerm) {
            const searchTermLower = state.filters.searchTerm.toLowerCase();
            filteredPlants = filteredPlants.filter(plant =>
                plant.name.toLowerCase().includes(searchTermLower)
            );
        }

        if (filteredPlants.length === 0) {
            plantListUl.innerHTML = '<li>No se encontraron plantas con esos filtros.</li>';
            return;
        }

        filteredPlants.forEach(plant => {
            const listItem = document.createElement('li');
            
            const plantName = plant.name ? `"${plant.name}"` : '(Sin nombre)';
            
            const plantStatus = plant.status === 'planted' ? 'Plantado' : 'Maduro';

            listItem.innerHTML = `${plant.plantEmoji} ${plantName} - <i>(${plantStatus})</i>`;
            plantListUl.appendChild(listItem);
        });
    }

    function renderStats() {
        plantedCountSpan.textContent = state.counters.planted;
        matureCountSpan.textContent = state.counters.mature;
        harvestedCountSpan.textContent = state.counters.harvested;
    }

    function init() {
        loadState();

        if(state.grid.length === 0){
            createGrid();
        }

        renderGrid();
        renderStats();
        renderSidebar();
        gardenGrid.addEventListener('click', handleGridClick);
        plantForm.addEventListener('submit', handleFormSubmit);
        cancelBtn.addEventListener('click', () => toggleModal(false));
        
        waterBtn.addEventListener('click', () => {
            waterPlants();
            renderGrid();
            renderStats();
            renderSidebar();
            saveState();
        });

        harvestBtn.addEventListener('click', () => {
            harvestPlants();
            renderGrid();
            renderStats();
            renderSidebar();
            saveState();
        });

        searchInput.addEventListener('input', (event) => {
            state.filters.searchTerm = event.target.value;
            renderSidebar();
        });

        filterSelect.addEventListener('change', (event) => {
            state.filters.filterBy = event.target.value;
            renderSidebar();
        });
    }

    init();
});