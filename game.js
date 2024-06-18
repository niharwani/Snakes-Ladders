const boardSize = 10;
let playerPositions = Array(8).fill(0);
let currentPlayer = 0;

// Create the board
const board = document.getElementById('board');
for (let i = boardSize - 1; i >= 0; i--) {
    for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const cellNumber = i % 2 === 0 ? i * boardSize + j + 1 : i * boardSize + (boardSize - j);
        cell.innerText = cellNumber;
        cell.id = `cell-${cellNumber}`;
        board.appendChild(cell);
    }
}

// Snakes and Ladders positions (key: start position, value: end position)
const snakes = {
    17: 7,
    54: 34,
    62: 19,
    98: 79
};

const ladders = {
    3: 38,
    24: 33,
    42: 93,
    72: 84
};

// Move player function
function movePlayer() {
    const diceValue = parseInt(document.getElementById('diceValue').value);
    if (isNaN(diceValue) || diceValue < 1 || diceValue > 6) {
        alert('Please enter a valid dice value (1-6).');
        return;
    }

    let newPosition = playerPositions[currentPlayer] + diceValue;

    if (newPosition > 100) {
        newPosition = 100;
    }

    // Check for snakes or ladders
    if (snakes[newPosition]) {
        newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
        newPosition = ladders[newPosition];
    }

    // Update the player position
    document.getElementById(`cell-${playerPositions[currentPlayer]}`).innerHTML = document.getElementById(`cell-${playerPositions[currentPlayer]}`).innerText;
    playerPositions[currentPlayer] = newPosition;
    const playerDiv = document.createElement('div');
    playerDiv.className = `player player${currentPlayer + 1}`;
    document.getElementById(`cell-${playerPositions[currentPlayer]}`).appendChild(playerDiv);

    // Check for win condition
    if (playerPositions[currentPlayer] === 100) {
        document.getElementById('status').innerText = `Player ${currentPlayer + 1} wins!`;
    } else {
        document.getElementById('status').innerText = `Player ${currentPlayer + 1} is on square ${playerPositions[currentPlayer]}.`;
        currentPlayer = (currentPlayer + 1) % 8;
    }
}
