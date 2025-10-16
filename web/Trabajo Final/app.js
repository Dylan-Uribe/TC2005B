document.addEventListener('DOMContentLoaded', () => {

    const gardenGrid = document.getElementById('garden-grid');
    const plantModal = document.getElementById('plant-modal');
    const plantForm = document.getElementById('plant-form');
    const cancelBtn = document.getElementById('cancel-btn');

    const plantTypes = {
        seedling: {planted: '&#127793;', harvested: '&#127807;'},
        tulip: {planted: '&#127799;', harvested: '&#127799;'},
        cactus: {planted: '&#127797;', harvested: '&#127797;'},
        strawberry: {planted: '&#127825;', harvested: '&#127825;'}
    };

    let state = {
        grid: [],
        plantingCellId: null
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
        }
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

    function init() {
        createGrid();
        renderGrid();
        
        gardenGrid.addEventListener('click', handleGridClick);
        plantForm.addEventListener('submit', handleFormSubmit);
        cancelBtn.addEventListener('click', () => toggleModal(false));
    }

    init();
});