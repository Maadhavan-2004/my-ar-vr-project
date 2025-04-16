// Default difficulty mode
let difficulty = 'medium';
let rows = 3, cols = 3; // Default grid size

// Function to set difficulty
function setDifficulty(mode) {
    difficulty = mode;
    console.log(`Difficulty set to: ${difficulty}`);
}

// Function to get AI move based on difficulty
function getAIMove(board) {
    switch (difficulty) {
        case 'easy':
            return getRandomMove(board);
        case 'medium':
            return getMediumMove(board);
        case 'hard':
            return getBestMove(board); // Minimax Algorithm
        default:
            return getMediumMove(board);
    }
}

// Easy Mode: Random Move
function getRandomMove(board) {
    let availableMoves = board
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium Mode: Simple Heuristic Move
function getMediumMove(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') return i;
    }
    return getRandomMove(board);
}

// Hard Mode: Minimax Algorithm
function getBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let scores = { X: -1, O: 1, tie: 0 };
    let result = checkWinner(board);
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    let size = rows * cols;
    let winPatterns = [];

    // Rows
    for (let i = 0; i < size; i += cols) {
        winPatterns.push([...Array(cols).keys()].map(x => x + i));
    }

    // Columns
    for (let i = 0; i < cols; i++) {
        winPatterns.push([...Array(rows).keys()].map(x => x * cols + i));
    }

    // Diagonals
    winPatterns.push([...Array(rows).keys()].map(x => x * (cols + 1)));
    winPatterns.push([...Array(rows).keys()].map(x => (x + 1) * (cols - 1)));

    for (let pattern of winPatterns) {
        if (pattern.every(i => board[i] === 'X')) return 'X';
        if (pattern.every(i => board[i] === 'O')) return 'O';
    }

    return board.includes('') ? null : 'tie';
}

// Function to dynamically update grid size
function updateGridSize() {
    let inputRows = parseInt(prompt("Enter number of rows (max 8):", rows));
    let inputCols = parseInt(prompt("Enter number of columns (max 8):", cols));
    if (!isNaN(inputRows) && !isNaN(inputCols) && inputRows > 0 && inputRows <= 8 && inputCols > 0 && inputCols <= 8) {
        rows = inputRows;
        cols = inputCols;
        console.log(`Grid size set to ${rows}x${cols}`);
        generateARBoard(rows, cols);
    } else {
        alert("Invalid input! Please enter values between 1 and 8.");
    }
}

// Function to generate AR board dynamically
function generateARBoard(rows, cols) {
    const marker = document.querySelector(".hiro");
    marker.innerHTML = ''; // Clear previous tiles
    let spacing = 1.5;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let plane = document.createElement("a-plane");
            plane.setAttribute("id", `${r * cols + c}`);
            plane.setAttribute("color", "#CCC");
            plane.setAttribute("height", "1.5");
            plane.setAttribute("width", "1.5");
            plane.setAttribute("position", `${c * spacing - (cols * spacing) / 2} 0 ${-r * spacing}`);
            plane.setAttribute("rotation", "-90 0 0");
            plane.setAttribute("material", "opacity: 0.5");
            plane.setAttribute("marker", "");
            marker.appendChild(plane);
        }
    }
}

document.getElementById("ar-mode-btn")?.addEventListener("click", () => {
    let selectedDifficulty = difficulty;
    setDifficulty(selectedDifficulty);
    updateGridSize();
});
