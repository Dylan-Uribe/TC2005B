document.addEventListener('DOMContentLoaded', () => {

    let state = {
        grid: []
    };

    const gardenGrid = document.getElementById('garden-grid');

    function createGrid(){
        for(let i = 0; i< 64; i++){
            state.grid.push({
                id: i,
                status: 'empty'
            });
        }
    }

    function renderGrid() {
        gardenGrid.innerHTML = '';

        state.grid.forEach(cellState => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            
            cellElement.dataset.id = cellState.id;
            cellElement.dataset.status = cellState.status;

            gardenGrid.appendChild(cellElement);
        });
    }

    function init() {
        createGrid();
        renderGrid();
        console.log("Initial State:", state);
    }

    init();
});