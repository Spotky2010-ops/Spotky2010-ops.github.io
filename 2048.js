const GRID_SIZE = 4;
const boardElement = document.getElementById('game2048Board');
const scoreElement = document.getElementById('game2048Score');
const bestElement = document.getElementById('game2048Best');
const messageElement = document.getElementById('game2048Message');
const modal = document.getElementById('game2048Overlay');
const openButton = document.getElementById('game2048Tile');
const closeButton = document.getElementById('game2048Close');
const restartButton = document.getElementById('game2048Restart');
const picker = document.getElementById('gamePicker');
const game2048View = document.getElementById('game2048View');
const ticTacToeView = document.getElementById('ticTacToeView');
const ticTacToeButton = document.getElementById('ticTacToeTile');
const ticTacToeBoard = document.getElementById('ticTacToeBoard');
const ticTacToeMessage = document.getElementById('ticTacToeMessage');
const gamesButtons = [document.getElementById('gamesTile'), document.getElementById('dockGamesButton')];

let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem('spotky-2048-best') || 0);
let won = false;
let activeGame = null;
let ticTacToeState = Array(9).fill('');
let ticTacToeTurn = 'X';
let ticTacToeFinished = false;

function showGameView(gameName) {
  if (!picker || !game2048View || !ticTacToeView) return;
  activeGame = gameName;
  picker.hidden = true;
  game2048View.hidden = gameName !== '2048';
  ticTacToeView.hidden = gameName !== 'tic-tac-toe';
}

function updateBestScore() {
  bestElement.textContent = String(bestScore);
}

function createEmptyBoard() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function getEmptyCells() {
  const emptyCells = [];
  board.forEach((row, rowIndex) => {
    row.forEach((value, cellIndex) => {
      if (value === 0) {
        emptyCells.push({ row: rowIndex, col: cellIndex });
      }
    });
  });
  return emptyCells;
}

function addRandomTile() {
  const emptyCells = getEmptyCells();
  if (!emptyCells.length) return false;
  const nextCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[nextCell.row][nextCell.col] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function startGame() {
  board = createEmptyBoard();
  score = 0;
  won = false;
  if (messageElement) {
    messageElement.textContent = 'Use arrow keys to play.';
  }
  addRandomTile();
  addRandomTile();
  renderBoard();
}

function renderBoard() {
  if (!boardElement) return;

  boardElement.innerHTML = '';

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement('div');
      const value = board[row][col];
      cell.className = 'game-2048-cell';
      cell.dataset.value = String(value);
      cell.textContent = value === 0 ? '' : String(value);
      boardElement.appendChild(cell);
    }
  }

  if (scoreElement) {
    scoreElement.textContent = String(score);
  }
  updateBestScore();
}

function slideLine(line) {
  const values = line.filter((value) => value !== 0);
  const merged = [];

  for (let index = 0; index < values.length; index += 1) {
    const current = values[index];
    const next = values[index + 1];

    if (next !== undefined && next === current) {
      const mergedValue = current * 2;
      merged.push(mergedValue);
      score += mergedValue;
      if (mergedValue >= 2048 && !won) {
        won = true;
        if (messageElement) {
          messageElement.textContent = 'You made 2048! Keep going.';
        }
      }
      index += 1;
    } else {
      merged.push(current);
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.push(0);
  }

  return merged;
}

function rotateBoardClockwise(currentBoard) {
  return currentBoard[0].map((_, index) => currentBoard.map((row) => row[index]).reverse());
}

function moveBoard(direction) {
  const previousBoard = board.map((row) => [...row]);
  let nextBoard = board.map((row) => [...row]);

  if (direction === 'left') {
    nextBoard = nextBoard.map((row) => slideLine(row));
  } else if (direction === 'right') {
    nextBoard = nextBoard.map((row) => slideLine([...row].reverse()).reverse());
  } else if (direction === 'up') {
    nextBoard = Array.from({ length: GRID_SIZE }, (_, colIndex) => {
      const column = board.map((row) => row[colIndex]);
      return slideLine(column);
    });
    nextBoard = Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
      Array.from({ length: GRID_SIZE }, (_, colIndex) => nextBoard[colIndex][rowIndex])
    );
  } else if (direction === 'down') {
    nextBoard = Array.from({ length: GRID_SIZE }, (_, colIndex) => {
      const column = board.map((row) => row[colIndex]).reverse();
      return slideLine(column).reverse();
    });
    nextBoard = Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
      Array.from({ length: GRID_SIZE }, (_, colIndex) => nextBoard[colIndex][rowIndex])
    );
  }

  if (JSON.stringify(previousBoard) === JSON.stringify(nextBoard)) {
    if (!getEmptyCells().length && !canMove()) {
      if (messageElement) {
        messageElement.textContent = 'No moves left. Start a new game!';
      }
    }
    return;
  }

  board = nextBoard;
  addRandomTile();
  renderBoard();

  if (!getEmptyCells().length && !canMove()) {
    if (messageElement) {
      messageElement.textContent = 'No moves left. Start a new game!';
    }
  }

  if (score > bestScore) {
    bestScore = score;
    try {
      localStorage.setItem('spotky-2048-best', String(bestScore));
    } catch (error) {
      // Ignore storage errors in restricted environments.
    }
  }
}

function canMove() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const value = board[row][col];
      if (value === 0) return true;
      if (row < GRID_SIZE - 1 && board[row + 1][col] === value) return true;
      if (col < GRID_SIZE - 1 && board[row][col + 1] === value) return true;
    }
  }
  return false;
}

function openGamePanel() {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeGamePanel() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  activeGame = null;
  picker.hidden = false;
  game2048View.hidden = true;
  ticTacToeView.hidden = true;
}

function startTicTacToe() {
  ticTacToeState = Array(9).fill('');
  ticTacToeTurn = 'X';
  ticTacToeFinished = false;
  ticTacToeBoard.querySelectorAll('[data-cell]').forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('is-winner');
  });
  ticTacToeMessage.textContent = "X's turn";
}

function playTicTacToeCell(index) {
  if (ticTacToeFinished || ticTacToeState[index]) return;
  ticTacToeState[index] = ticTacToeTurn;
  const cell = ticTacToeBoard.querySelector(`[data-cell="${index}"]`);
  cell.textContent = ticTacToeTurn;
  cell.disabled = true;

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  const winningLine = winningLines.find((line) => line.every((cellIndex) => ticTacToeState[cellIndex] === ticTacToeTurn));

  if (winningLine) {
    ticTacToeFinished = true;
    ticTacToeMessage.textContent = `${ticTacToeTurn} wins!`;
    winningLine.forEach((cellIndex) => ticTacToeBoard.querySelector(`[data-cell="${cellIndex}"]`).classList.add('is-winner'));
    ticTacToeBoard.querySelectorAll('[data-cell]').forEach((boardCell) => { boardCell.disabled = true; });
  } else if (ticTacToeState.every(Boolean)) {
    ticTacToeFinished = true;
    ticTacToeMessage.textContent = "It's a draw.";
  } else {
    ticTacToeTurn = ticTacToeTurn === 'X' ? 'O' : 'X';
    ticTacToeMessage.textContent = `${ticTacToeTurn}'s turn`;
  }
}

function attachControls() {
  if (openButton) {
    openButton.addEventListener('click', () => {
      if (!board.length) startGame();
      showGameView('2048');
    });
  }

  gamesButtons.forEach((button) => button?.addEventListener('click', openGamePanel));

  ticTacToeButton?.addEventListener('click', () => {
    startTicTacToe();
    showGameView('tic-tac-toe');
  });

  document.querySelectorAll('[data-game-back]').forEach((button) => {
    button.addEventListener('click', () => {
      activeGame = null;
      picker.hidden = false;
      game2048View.hidden = true;
      ticTacToeView.hidden = true;
    });
  });

  ticTacToeBoard?.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-cell]');
    if (cell) playTicTacToeCell(Number(cell.dataset.cell));
  });

  document.getElementById('ticTacToeRestart')?.addEventListener('click', startTicTacToe);

  if (closeButton) {
    closeButton.addEventListener('click', closeGamePanel);
  }

  if (restartButton) {
    restartButton.addEventListener('click', () => {
      startGame();
    });
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeGamePanel();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!modal || !modal.classList.contains('is-open') || activeGame !== '2048') return;

    const keyMap = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };

    const direction = keyMap[event.key];
    if (!direction) return;

    event.preventDefault();
    moveBoard(direction);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeGamePanel();
    }
  });
}

function init2048Game() {
  if (!boardElement) return;
  updateBestScore();
  attachControls();
  startGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init2048Game);
} else {
  init2048Game();
}
