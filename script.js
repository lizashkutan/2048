let board = Array(16).fill(0);
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
const cells = document.querySelectorAll('.grid-cell');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const gameOver = document.querySelector('.game-over');
const gameMessage = document.getElementById('game-message');
const restartBtnContainer = document.querySelector('.restart-btn-container');
const restartBtn = document.getElementById('restart-btn');

function updateBoard() {
    cells.forEach((cell, index) => {
        const value = board[index];
        cell.textContent = value === 0 ? '' : value;
        cell.dataset.value = value;
        cell.className = `grid-cell tile-${value}`;
    });
    scoreDisplay.textContent = `Счет: ${score}`;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    bestScoreDisplay.textContent = `Лучший: ${bestScore}`;
}

function generateNewNumber() {
    const emptyIndices = board.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
    if (emptyIndices.length === 0) {
        checkGameOver();
        return;
    }
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    updateBoard();
}

function checkGameOver() {
    if (!board.includes(0) && !canMove()) {
        gameMessage.textContent = "Игра окончена!";
        gameOver.style.display = 'flex';
        restartBtnContainer.style.display = 'block';
    }
}


function restartGame() {
    board = Array(16).fill(0);
    score = 0;

    gameOver.style.display = 'none';
    gameMessage.textContent = "";
    restartBtnContainer.style.display = 'none';

    generateNewNumber();
    generateNewNumber();
    updateBoard();
}
restartBtn.addEventListener('click', restartGame);

function canMove() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let idx = i * 4 + j;
            if (board[idx] === 0) return true;
            if (j < 3 && board[idx] === board[idx + 1]) return true;
            if (i < 3 && board[idx] === board[idx + 4]) return true;
        }
    }
    return false;
}

function merge(row) {
    row = row.filter(num => num !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = row.filter(num => num !== 0);
    while (row.length < 4) row.push(0);
    return row;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = board.slice(i * 4, (i + 1) * 4);
        let newRow = merge(row);
        if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
        board.splice(i * 4, 4, ...newRow);
    }
    if (moved) {
        generateNewNumber();
        updateBoard();
    } else {
        checkGameOver();
    }
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = board.slice(i * 4, (i + 1) * 4).reverse();
        let newRow = merge(row).reverse();
        if (JSON.stringify(row.reverse()) !== JSON.stringify(newRow)) moved = true;
        board.splice(i * 4, 4, ...newRow);
    }
    if (moved) {
        generateNewNumber();
        updateBoard();
    } else {
        checkGameOver();
    }
}

function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let column = [board[col], board[col + 4], board[col + 8], board[col + 12]];
        let newColumn = merge(column);
        if (JSON.stringify(column) !== JSON.stringify(newColumn)) moved = true;
        [board[col], board[col + 4], board[col + 8], board[col + 12]] = newColumn;
    }
    if (moved) {
        generateNewNumber();
        updateBoard();
    } else {
        checkGameOver();
    }
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let column = [board[col], board[col + 4], board[col + 8], board[col + 12]].reverse();
        let newColumn = merge(column).reverse();
        if (JSON.stringify(column.reverse()) !== JSON.stringify(newColumn)) moved = true;
        [board[col], board[col + 4], board[col + 8], board[col + 12]] = newColumn;
    }
    if (moved) {
        generateNewNumber();
        updateBoard();
    } else {
        checkGameOver();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
    if (e.key === 'ArrowUp') moveUp();
    if (e.key === 'ArrowDown') moveDown();
});

generateNewNumber();
generateNewNumber();
updateBoard();