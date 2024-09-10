document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 9;
    const sudokuGrid = document.getElementById('sudoku-grid');
    let puzzle = [];

    function createGrid() {
        sudokuGrid.innerHTML = '';
        for (let row = 0; row < gridSize; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < gridSize; col++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.addEventListener('input', validateInput);
                td.appendChild(input);
                tr.appendChild(td);
            }
            sudokuGrid.appendChild(tr);
        }
    }

    function validateInput(event) {
        const input = event.target;
        const value = input.value;
        if (value && !/^[1-9]$/.test(value)) {
            input.value = '';
        }
    }

    function generatePuzzle() {
        puzzle = generateValidPuzzle();
        fillGrid(puzzle);
    }

    function fillGrid(puzzle) {
        const inputs = document.querySelectorAll('#sudoku-grid input');
        inputs.forEach((input, index) => {
            input.value = puzzle[Math.floor(index / gridSize)][index % gridSize] || '';
        });
    }

    function generateValidPuzzle() {
        const puzzle = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        solveSudoku(puzzle);
        for (let i = 0; i < gridSize * gridSize * 0.5; i++) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            puzzle[row][col] = 0;
        }
        return puzzle;
    }

    function solveSudoku(board) {
        function isValid(board, row, col, num) {
            for (let i = 0; i < gridSize; i++) {
                if (board[row][i] === num || board[i][col] === num) {
                    return false;
                }
            }
            const startRow = row - (row % 3);
            const startCol = col - (col % 3);
            for (let i = startRow; i < startRow + 3; i++) {
                for (let j = startCol; j < startCol + 3; j++) {
                    if (board[i][j] === num) {
                        return false;
                    }
                }
            }
            return true;
        }

        function solve(board) {
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (board[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (solve(board)) {
                                    return true;
                                }
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }
        solve(board);
    }

    function getPuzzleFromGrid() {
        const inputs = document.querySelectorAll('#sudoku-grid input');
        return Array.from({ length: gridSize }, (_, i) => 
            Array.from({ length: gridSize }, (_, j) => 
                parseInt(inputs[i * gridSize + j].value) || 0
            )
        );
    }

    function solveSudokuPuzzle() {
        const puzzle = getPuzzleFromGrid();
        solveSudoku(puzzle);
        fillGrid(puzzle);
    }

    createGrid();
    generatePuzzle(); // Generate puzzle on initial load

    document.getElementById('generate-btn').addEventListener('click', generatePuzzle);
    document.getElementById('solve-btn').addEventListener('click', solveSudokuPuzzle);
});
