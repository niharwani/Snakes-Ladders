const boardSize = 10;
let totalPlayers;
let playerPositions = [];
let currentPlayer = 0;
let playerNames = [];
let moveHistory = [];

const snakes = {
    17: 7,
    54: 34,
    62: 19,
    98: 79,
    96: 35
};

const ladders = {
    3: 38,
    24: 33,
    42: 93,
    72: 84,
    36: 77
};

function setPlayerCount() {
    totalPlayers = parseInt(document.getElementById('numPlayers').value);
    if (isNaN(totalPlayers) || totalPlayers < 2 || totalPlayers > 8) {
        alert('Please enter a valid number of players (2-8).');
        return;
    }
    
    const playerNamesDiv = document.getElementById('player-names');
    playerNamesDiv.innerHTML = '';
    
    for (let i = 0; i < totalPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Enter name for Player ${i + 1}`;
        input.id = `player${i + 1}Name`;
        playerNamesDiv.appendChild(input);
        playerNamesDiv.appendChild(document.createElement('br'));
    }
    
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.onclick = startGame;
    playerNamesDiv.appendChild(startButton);
}

function startGame() {
    playerNames = [];
    for (let i = 0; i < totalPlayers; i++) {
        const playerName = document.getElementById(`player${i + 1}Name`).value;
        if (!playerName) {
            alert('Please enter names for all players.');
            return;
        }
        playerNames.push(playerName);
    }
    
    playerPositions = Array(totalPlayers).fill(1);
    moveHistory = [];
    
    document.getElementById('player-input-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear the board
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

    addSnakesAndLadders();
    initializePlayers();
    updatePlayerInfo();
    updatePlayerLegend();
    populateNextPlayerSelect();
}

function addSnakesAndLadders() {
    for (const [start, end] of Object.entries(snakes)) {
        const snake = document.createElement('div');
        snake.className = 'snake';
        positionElement(snake, start, end);
        document.getElementById('board').appendChild(snake);
    }

    for (const [start, end] of Object.entries(ladders)) {
        const ladder = document.createElement('div');
        ladder.className = 'ladder';
        positionElement(ladder, start, end);
        document.getElementById('board').appendChild(ladder);
    }
}

function positionElement(element, start, end) {
    const startCell = document.getElementById(`cell-${start}`);
    const endCell = document.getElementById(`cell-${end}`);
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    element.style.left = `${(startRect.left + endRect.left) / 2}px`;
    element.style.top = `${(startRect.top + endRect.top) / 2}px`;
    element.style.width = `${Math.abs(startRect.left - endRect.left)}px`;
    element.style.height = `${Math.abs(startRect.top - endRect.top)}px`;
}

function initializePlayers() {
    for (let i = 0; i < totalPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player player${i + 1}`;
        playerDiv.id = `player${i + 1}`;
        document.getElementById('cell-1').appendChild(playerDiv);
    }

    positionPlayersInCell(1);
    document.getElementById('player1').classList.add('flashing');
}

function updatePlayerInfo() {
    document.getElementById('status').innerText = `It's ${playerNames[currentPlayer]}'s turn.`;
}

function updatePlayerLegend() {
    const playerLegendDiv = document.getElementById('player-legend');
    playerLegendDiv.innerHTML = '';
    
    for (let i = 0; i < totalPlayers; i++) {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        const legendBox = document.createElement('div');
        legendBox.className = `legend-box player${i + 1}-legend`;
        legendItem.appendChild(legendBox);
        legendItem.appendChild(document.createTextNode(playerNames[i]));
        playerLegendDiv.appendChild(legendItem);
    }
}

function movePlayer() {
    const diceValue = parseInt(document.getElementById('diceValue').value);
    if (isNaN(diceValue) || diceValue < 1 || diceValue > 6) {
        alert('Please enter a valid dice value (1-6).');
        return;
    }

    let newPosition = playerPositions[currentPlayer] + diceValue;
    
    if (newPosition > 100) {
        alert(`${playerNames[currentPlayer]} rolled too high!`);
    } else {
        if (snakes[newPosition]) {
            newPosition = snakes[newPosition];
            alert(`${playerNames[currentPlayer]} got bitten by a snake!`);
        } else if (ladders[newPosition]) {
            newPosition = ladders[newPosition];
            alert(`${playerNames[currentPlayer]} climbed a ladder!`);
        }

        moveHistory.push({
            player: currentPlayer,
            from: playerPositions[currentPlayer],
            to: newPosition
        });

        const currentCell = document.getElementById(`cell-${playerPositions[currentPlayer]}`);
        const playerDiv = document.getElementById(`player${currentPlayer + 1}`);
        currentCell.removeChild(playerDiv);
        
        const newCell = document.getElementById(`cell-${newPosition}`);
        newCell.appendChild(playerDiv);
        playerPositions[currentPlayer] = newPosition;

        positionPlayersInCell(newPosition);

        if (newPosition === 100) {
            alert(`${playerNames[currentPlayer]} wins!`);
            return;
        }

        playerDiv.classList.remove('flashing');
    }

    document.getElementById('diceValue').value = '';
}

function undoMove() {
    if (moveHistory.length === 0) {
        alert('No moves to undo.');
        return;
    }

    const lastMove = moveHistory.pop();
    const player = lastMove.player;
    const fromPosition = lastMove.to;
    const toPosition = lastMove.from;

    const currentCell = document.getElementById(`cell-${fromPosition}`);
    const playerDiv = document.getElementById(`player${player + 1}`);
    currentCell.removeChild(playerDiv);

    const previousCell = document.getElementById(`cell-${toPosition}`);
    previousCell.appendChild(playerDiv);

    playerPositions[player] = toPosition;

    positionPlayersInCell(toPosition);

    updatePlayerInfo();
    document.querySelectorAll('.player').forEach(player => player.classList.remove('flashing'));
    document.getElementById(`player${player + 1}`).classList.add('flashing');
}

function setNextPlayer() {
    currentPlayer = parseInt(document.getElementById('nextPlayer').value);
    updatePlayerInfo();
    document.querySelectorAll('.player').forEach(player => player.classList.remove('flashing'));
    document.getElementById(`player${currentPlayer + 1}`).classList.add('flashing');
}

function populateNextPlayerSelect() {
    const nextPlayerSelect = document.getElementById('nextPlayer');
    nextPlayerSelect.innerHTML = '';
    for (let i = 0; i < totalPlayers; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = playerNames[i];
        nextPlayerSelect.appendChild(option);
    }
}

function positionPlayersInCell(cellNumber) {
    const cell = document.getElementById(`cell-${cellNumber}`);
    const playersInCell = cell.getElementsByClassName('player');
    const numPlayersInCell = playersInCell.length;

    if (numPlayersInCell > 1) {
        for (let i = 0; i < numPlayersInCell; i++) {
            playersInCell[i].style.left = `${20 + 30 * (i % 2)}%`;
            playersInCell[i].style.top = `${20 + 30 * Math.floor(i / 2)}%`;
        }
    } else if (numPlayersInCell === 1) {
        playersInCell[0].style.left = '50%';
        playersInCell[0].style.top = '50%';
    }
}
