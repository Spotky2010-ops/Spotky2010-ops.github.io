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
const snakeView = document.getElementById('snakeView');
const memoryView = document.getElementById('memoryView');
const photoMemoryView = document.getElementById('photoMemoryView');
const puzzleView = document.getElementById('puzzleView');
const cookieClickerView = document.getElementById('cookieClickerView');
const idleGardenView = document.getElementById('idleGardenView');
const reactionView = document.getElementById('reactionView');
const numberGuessView = document.getElementById('numberGuessView');
const ticTacToeButton = document.getElementById('ticTacToeTile');
const ticTacToeBoard = document.getElementById('ticTacToeBoard');
const ticTacToeMessage = document.getElementById('ticTacToeMessage');
const snakeBoard = document.getElementById('snakeBoard');
const snakeMessage = document.getElementById('snakeMessage');
const snakeScoreElement = document.getElementById('snakeScore');
const memoryBoard = document.getElementById('memoryBoard');
const memoryMessage = document.getElementById('memoryMessage');
const toysTile = document.getElementById('toysTile');
const toysOverlay = document.getElementById('toysOverlay');
const gamesButtons = [document.getElementById('gamesTile'), document.getElementById('dockGamesButton')];

let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem('spotky-2048-best') || 0);
let won = false;
let activeGame = null;
let ticTacToeState = Array(9).fill('');
let ticTacToeTurn = 'X';
let ticTacToeFinished = false;
let snakeBody = [];
let snakeDirection = 'right';
let snakeNextDirection = 'right';
let snakeFood = null;
let snakeScore = 0;
let snakeTimer = null;
let memoryCards = [];
let memoryFirstCard = null;
let memoryLocked = false;
let memoryMatches = 0;
let memoryTimer = null;
let photoMemoryCards = [];
let photoMemoryFirstCard = null;
let photoMemoryLocked = false;
let photoMemoryMatches = 0;
let photoMemoryTimer = null;
let puzzleTiles = [];
let puzzleMoveCount = 0;
let incrementalTimer = null;
let cookieCount = 0;
let bakerCount = 0;
let bakerCost = 10;
let petalCount = 0;
let plotCount = 0;
let plotCost = 15;
let bubbleCount = 0;
let clickCount = 0;
let reactionTimer = null;
let reactionStartedAt = 0;
let numberToGuess = 0;
let numberGuessCount = 0;

function showGameView(gameName) {
  if (!picker) return;
  activeGame = gameName;
  picker.hidden = true;
  const gameViewIds = {
    '2048': 'game2048View',
    'tic-tac-toe': 'ticTacToeView',
    snake: 'snakeView',
    memory: 'memoryView',
    'photo-memory': 'photoMemoryView',
    puzzle: 'puzzleView',
    'cookie-clicker': 'cookieClickerView',
    'idle-garden': 'idleGardenView',
    reaction: 'reactionView',
    'number-guess': 'numberGuessView'
  };
  document.querySelectorAll('#game2048Overlay .game-view').forEach((view) => {
    view.hidden = view.id !== gameViewIds[gameName];
  });
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
  stopSnake();
  window.clearTimeout(memoryTimer);
  window.clearTimeout(photoMemoryTimer);
  window.clearInterval(incrementalTimer);
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  activeGame = null;
  picker.hidden = false;
  document.querySelectorAll('#game2048Overlay .game-view').forEach((view) => { view.hidden = true; });
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

function renderSnake() {
  if (!snakeBoard) return;
  const snakeCells = new Set(snakeBody.map((part) => `${part.x},${part.y}`));
  snakeBoard.innerHTML = '';

  for (let y = 0; y < 12; y += 1) {
    for (let x = 0; x < 12; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'snake-cell';
      if (snakeCells.has(`${x},${y}`)) cell.classList.add('is-snake');
      if (snakeFood && snakeFood.x === x && snakeFood.y === y) cell.classList.add('is-food');
      snakeBoard.appendChild(cell);
    }
  }

  if (snakeScoreElement) snakeScoreElement.textContent = String(snakeScore);
}

function placeSnakeFood() {
  const emptyCells = [];
  for (let y = 0; y < 12; y += 1) {
    for (let x = 0; x < 12; x += 1) {
      if (!snakeBody.some((part) => part.x === x && part.y === y)) emptyCells.push({ x, y });
    }
  }
  snakeFood = emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function stopSnake() {
  window.clearInterval(snakeTimer);
  snakeTimer = null;
}

function setSnakeDirection(direction) {
  const oppositeDirections = { up: 'down', down: 'up', left: 'right', right: 'left' };
  if (direction !== oppositeDirections[snakeDirection] && direction !== oppositeDirections[snakeNextDirection]) {
    snakeNextDirection = direction;
  }
}

function moveSnake() {
  snakeDirection = snakeNextDirection;
  const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const [dx, dy] = moves[snakeDirection];
  const head = { x: snakeBody[0].x + dx, y: snakeBody[0].y + dy };
  const eatsFood = snakeFood && head.x === snakeFood.x && head.y === snakeFood.y;
  const bodyToCheck = eatsFood ? snakeBody : snakeBody.slice(0, -1);

  if (head.x < 0 || head.x >= 12 || head.y < 0 || head.y >= 12 || bodyToCheck.some((part) => part.x === head.x && part.y === head.y)) {
    stopSnake();
    snakeMessage.textContent = `Game over. Score: ${snakeScore}. Start a new game to try again.`;
    return;
  }

  snakeBody.unshift(head);
  if (eatsFood) {
    snakeScore += 1;
    if (snakeBody.length === 144) {
      stopSnake();
      snakeMessage.textContent = 'You filled the board. You win!';
    } else {
      placeSnakeFood();
      snakeMessage.textContent = 'Nice! Keep going.';
    }
  } else {
    snakeBody.pop();
  }
  renderSnake();
}

function startSnake() {
  stopSnake();
  snakeBody = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  snakeDirection = 'right';
  snakeNextDirection = 'right';
  snakeScore = 0;
  snakeMessage.textContent = 'Use arrow keys or the direction controls.';
  placeSnakeFood();
  renderSnake();
  snakeTimer = window.setInterval(moveSnake, 170);
}

function startMemoryGame() {
  window.clearTimeout(memoryTimer);
  memoryCards = ['🍋', '🍓', '🍉', '🍇', '🍊', '🥝', '🍒', '🍍']
    .flatMap((symbol) => [{ symbol, matched: false }, { symbol, matched: false }]);
  for (let index = memoryCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [memoryCards[index], memoryCards[randomIndex]] = [memoryCards[randomIndex], memoryCards[index]];
  }
  memoryFirstCard = null;
  memoryLocked = false;
  memoryMatches = 0;
  memoryMessage.textContent = 'Find all eight matching pairs.';
  renderMemoryCards();
}

function renderMemoryCards() {
  if (!memoryBoard) return;
  memoryBoard.innerHTML = '';
  memoryCards.forEach((card, index) => {
    const button = document.createElement('button');
    button.className = 'memory-card';
    button.type = 'button';
    button.dataset.memoryIndex = String(index);
    button.textContent = card.matched || card.flipped ? card.symbol : '?';
    button.setAttribute('aria-label', card.matched || card.flipped ? card.symbol : `Hidden card ${index + 1}`);
    button.disabled = card.matched || Boolean(card.flipped);
    if (card.matched) button.classList.add('is-matched');
    if (card.flipped) button.classList.add('is-flipped');
    memoryBoard.appendChild(button);
  });
}

function chooseMemoryCard(index) {
  const card = memoryCards[index];
  if (!card || card.matched || card.flipped || memoryLocked) return;
  card.flipped = true;

  if (memoryFirstCard === null) {
    memoryFirstCard = index;
    renderMemoryCards();
    return;
  }

  const firstCardIndex = memoryFirstCard;
  const firstCard = memoryCards[firstCardIndex];
  memoryFirstCard = null;
  if (firstCard.symbol === card.symbol) {
    firstCard.matched = true;
    card.matched = true;
    memoryMatches += 1;
    memoryMessage.textContent = memoryMatches === 8 ? 'You found every pair!' : `${memoryMatches} of 8 pairs found.`;
    renderMemoryCards();
    return;
  }

  memoryLocked = true;
  renderMemoryCards();
  memoryTimer = window.setTimeout(() => {
    firstCard.flipped = false;
    card.flipped = false;
    memoryLocked = false;
    renderMemoryCards();
  }, 700);
}

function renderPhotoMemoryCards() {
  const photoMemoryBoard = document.getElementById('photoMemoryBoard');
  if (!photoMemoryBoard) return;
  photoMemoryBoard.replaceChildren();
  photoMemoryCards.forEach((card, index) => {
    const button = document.createElement('button');
    button.className = 'photo-memory-card';
    button.type = 'button';
    button.dataset.photoMemoryIndex = String(index);
    button.setAttribute('aria-label', card.matched || card.flipped ? `Photo ${index + 1}` : `Hidden photo ${index + 1}`);
    if (card.matched || card.flipped) {
      const image = document.createElement('img');
      image.src = card.src;
      image.alt = `Photo pair ${card.pair + 1}`;
      button.append(image);
    } else {
      button.textContent = '?';
    }
    button.disabled = card.matched || Boolean(card.flipped);
    if (card.matched) button.classList.add('is-matched');
    photoMemoryBoard.append(button);
  });
}

function startPhotoMemoryGame() {
  window.clearTimeout(photoMemoryTimer);
  const sources = [...new Set(Array.from(document.querySelectorAll('.thumb-photo'), (image) => image.currentSrc || image.src))];
  for (let index = sources.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [sources[index], sources[randomIndex]] = [sources[randomIndex], sources[index]];
  }
  const pairs = sources.slice(0, 8);
  photoMemoryCards = pairs.flatMap((src, pair) => [{ src, pair, matched: false }, { src, pair, matched: false }]);
  for (let index = photoMemoryCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [photoMemoryCards[index], photoMemoryCards[randomIndex]] = [photoMemoryCards[randomIndex], photoMemoryCards[index]];
  }
  photoMemoryFirstCard = null;
  photoMemoryLocked = false;
  photoMemoryMatches = 0;
  document.getElementById('photoMemoryMessage').textContent = 'Match the photo pairs.';
  renderPhotoMemoryCards();
}

function choosePhotoMemoryCard(index) {
  const card = photoMemoryCards[index];
  if (!card || card.matched || card.flipped || photoMemoryLocked) return;
  card.flipped = true;
  if (photoMemoryFirstCard === null) {
    photoMemoryFirstCard = index;
    renderPhotoMemoryCards();
    return;
  }
  const firstIndex = photoMemoryFirstCard;
  const firstCard = photoMemoryCards[firstIndex];
  photoMemoryFirstCard = null;
  if (firstCard.pair === card.pair) {
    firstCard.matched = true;
    card.matched = true;
    photoMemoryMatches += 1;
    document.getElementById('photoMemoryMessage').textContent = photoMemoryMatches === 8 ? 'You found every photo pair!' : `${photoMemoryMatches} of 8 pairs found.`;
    renderPhotoMemoryCards();
    return;
  }
  photoMemoryLocked = true;
  renderPhotoMemoryCards();
  photoMemoryTimer = window.setTimeout(() => {
    firstCard.flipped = false;
    card.flipped = false;
    photoMemoryLocked = false;
    renderPhotoMemoryCards();
  }, 800);
}

function renderPuzzle() {
  const puzzleBoard = document.getElementById('puzzleBoard');
  if (!puzzleBoard) return;
  puzzleBoard.replaceChildren();
  puzzleTiles.forEach((value, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'puzzle-cell';
    button.dataset.puzzleIndex = String(index);
    button.textContent = value ? String(value) : '';
    button.setAttribute('aria-label', value ? `Tile ${value}` : 'Empty space');
    button.disabled = !value || !canMovePuzzleTile(index);
    if (!value) button.classList.add('is-empty');
    puzzleBoard.append(button);
  });
  document.getElementById('puzzleMoves').textContent = `Moves: ${puzzleMoveCount}`;
}

function canMovePuzzleTile(index) {
  const emptyIndex = puzzleTiles.indexOf(0);
  return Math.abs(Math.floor(index / 4) - Math.floor(emptyIndex / 4)) + Math.abs((index % 4) - (emptyIndex % 4)) === 1;
}

function movePuzzleTile(index) {
  if (!canMovePuzzleTile(index)) return;
  const emptyIndex = puzzleTiles.indexOf(0);
  [puzzleTiles[index], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[index]];
  puzzleMoveCount += 1;
  renderPuzzle();
  if (puzzleTiles.every((value, tileIndex) => value === (tileIndex === 15 ? 0 : tileIndex + 1))) {
    document.getElementById('puzzleMessage').textContent = `Solved in ${puzzleMoveCount} moves!`;
  }
}

function startPuzzle() {
  puzzleTiles = Array.from({ length: 16 }, (_, index) => index === 15 ? 0 : index + 1);
  let previousEmpty = -1;
  for (let move = 0; move < 100; move += 1) {
    const emptyIndex = puzzleTiles.indexOf(0);
    const candidates = puzzleTiles.map((_, index) => index).filter((index) => canMovePuzzleTile(index) && index !== previousEmpty);
    const nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    previousEmpty = emptyIndex;
    [puzzleTiles[nextIndex], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[nextIndex]];
  }
  puzzleMoveCount = 0;
  document.getElementById('puzzleMessage').textContent = 'Arrange the tiles in order.';
  renderPuzzle();
}

function renderIncrementalGames() {
  document.getElementById('cookieCount').textContent = String(Math.floor(cookieCount));
  document.getElementById('cookieRate').textContent = `${bakerCount} baker${bakerCount === 1 ? '' : 's'} per second`;
  document.getElementById('buyBaker').textContent = `Hire baker · ${bakerCost} cookies`;
  document.getElementById('petalCount').textContent = String(Math.floor(petalCount));
  document.getElementById('gardenRate').textContent = `${plotCount} plot${plotCount === 1 ? '' : 's'} per second`;
  document.getElementById('buyPlot').textContent = `Add plot · ${plotCost} petals`;
}

function startIncrementalGame(gameName) {
  window.clearInterval(incrementalTimer);
  renderIncrementalGames();
  incrementalTimer = window.setInterval(() => {
    if (gameName === 'cookie-clicker') cookieCount += bakerCount;
    if (gameName === 'idle-garden') petalCount += plotCount;
    renderIncrementalGames();
  }, 1000);
}

function initToysPanel() {
  const closeButton = document.getElementById('toysClose');
  const toyGrid = document.getElementById('toyGrid');
  if (!toysTile || !toysOverlay || !closeButton || !toyGrid) return;

  const closePanel = () => {
    toysOverlay.classList.remove('is-open');
    toysOverlay.setAttribute('aria-hidden', 'true');
  };

  toysTile.addEventListener('click', () => {
    toysOverlay.classList.add('is-open');
    toysOverlay.setAttribute('aria-hidden', 'false');
  });
  closeButton.addEventListener('click', closePanel);
  toysOverlay.addEventListener('click', (event) => {
    if (event.target === toysOverlay) closePanel();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toysOverlay.classList.contains('is-open')) closePanel();
  });

  toyGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-toy]');
    if (!button) return;
    const result = toyGrid.querySelector(`[data-toy-result="${button.dataset.toy}"]`);
    if (!result) return;

    const choices = {
      die: () => `You rolled ${Math.floor(Math.random() * 6) + 1}`,
      coin: () => Math.random() < 0.5 ? 'Heads!' : 'Tails!',
      magic: () => ['Yes, definitely.', 'Ask again soon.', 'The outlook is bright.', 'Not today.', 'Trust your instincts.'][Math.floor(Math.random() * 5)],
      spin: () => 'Wheee!',
      mood: () => ['Curious', 'Focused', 'Playful', 'Calm', 'Bold', 'Dreamy'][Math.floor(Math.random() * 6)],
      number: () => `Your number is ${Math.floor(Math.random() * 100) + 1}`,
      rps: () => {
        const moves = ['Rock', 'Paper', 'Scissors'];
        const player = moves[Math.floor(Math.random() * moves.length)];
        const opponent = moves[Math.floor(Math.random() * moves.length)];
        const outcome = player === opponent ? 'It\'s a tie' :
          (moves[(moves.indexOf(opponent) + 1) % moves.length] === player ? 'You win' : 'You lose');
        return `${player} vs ${opponent}. ${outcome}!`;
      },
      compliment: () => ['You bring great energy.', 'Your curiosity is a strength.', 'You make things better.', 'You have a knack for bright ideas.'][Math.floor(Math.random() * 4)],
      emoji: () => ['🌈', '🦋', '🍉', '🚀', '🌻', '🎈', '🐙', '⭐'][Math.floor(Math.random() * 8)],
      math: () => {
        const left = Math.floor(Math.random() * 12) + 1;
        const right = Math.floor(Math.random() * 12) + 1;
        return `${left} + ${right} = ${left + right}`;
      }
    };
    if (button.dataset.toy === 'bubble') {
      bubbleCount += 1;
      result.textContent = `${bubbleCount} popped`;
    } else if (button.dataset.toy === 'counter') {
      clickCount += 1;
      result.textContent = `${clickCount} click${clickCount === 1 ? '' : 's'}`;
    } else if (button.dataset.toy === 'color') {
      const color = `hsl(${Math.floor(Math.random() * 360)} 75% 62%)`;
      result.textContent = color;
      button.closest('.toy-choice').style.setProperty('--toy-color', color);
      button.closest('.toy-choice').classList.add('has-toy-color');
    } else if (button.dataset.toy === 'fortune') {
      result.textContent = ['A little curiosity goes a long way.', 'Good things are growing nearby.', 'Today is a fine day to begin.', 'Your next idea will surprise you.'][Math.floor(Math.random() * 4)];
    } else {
      result.textContent = choices[button.dataset.toy]();
      if (button.dataset.toy === 'spin') {
        const spinner = toyGrid.querySelector('[data-toy-icon="spinner"]');
        spinner.style.transform = `rotate(${Math.floor(Math.random() * 360) + 720}deg)`;
      }
    }
  });
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

  document.getElementById('snakeTile')?.addEventListener('click', () => {
    showGameView('snake');
    startSnake();
  });

  document.getElementById('memoryTile')?.addEventListener('click', () => {
    showGameView('memory');
    startMemoryGame();
  });

  document.getElementById('photoMemoryTile')?.addEventListener('click', () => {
    showGameView('photo-memory');
    startPhotoMemoryGame();
  });

  document.getElementById('puzzleTile')?.addEventListener('click', () => {
    showGameView('puzzle');
    startPuzzle();
  });

  document.getElementById('cookieClickerTile')?.addEventListener('click', () => {
    showGameView('cookie-clicker');
    startIncrementalGame('cookie-clicker');
  });

  document.getElementById('idleGardenTile')?.addEventListener('click', () => {
    showGameView('idle-garden');
    startIncrementalGame('idle-garden');
  });

  document.getElementById('reactionTile')?.addEventListener('click', () => {
    showGameView('reaction');
    document.getElementById('reactionMessage').textContent = 'Press start when you\'re ready.';
    document.getElementById('reactionStart').textContent = 'Start test';
    document.getElementById('reactionStart').disabled = false;
    reactionStartedAt = 0;
    window.clearTimeout(reactionTimer);
    reactionTimer = null;
  });

  document.getElementById('numberGuessTile')?.addEventListener('click', () => {
    showGameView('number-guess');
    startNumberGuess();
  });

  document.getElementById('reactionStart')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const message = document.getElementById('reactionMessage');
    if (reactionStartedAt) {
      message.textContent = `Your reaction time: ${Math.round(performance.now() - reactionStartedAt)} ms.`;
      reactionStartedAt = 0;
      button.textContent = 'Try again';
      return;
    }
    if (reactionTimer) {
      window.clearTimeout(reactionTimer);
      reactionTimer = null;
      button.disabled = false;
      button.textContent = 'Try again';
      message.textContent = 'Too soon! Press try again when you\'re ready.';
      return;
    }
    message.textContent = 'Wait for it...';
    reactionTimer = window.setTimeout(() => {
      reactionTimer = null;
      reactionStartedAt = performance.now();
      button.disabled = false;
      button.textContent = 'Click now!';
      message.textContent = 'Now!';
    }, 1200 + Math.random() * 2200);
  });

  document.getElementById('numberGuessForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('numberGuessInput');
    const guess = Number(input.value);
    numberGuessCount += 1;
    const message = guess === numberToGuess ? `Correct! You got it in ${numberGuessCount} guesses.` :
      guess < numberToGuess ? 'Too low. Try a higher number.' : 'Too high. Try a lower number.';
    document.getElementById('numberGuessMessage').textContent = message;
    if (guess === numberToGuess) input.disabled = true;
  });
  document.getElementById('numberGuessRestart')?.addEventListener('click', startNumberGuess);

  document.querySelectorAll('[data-game-back]').forEach((button) => {
    button.addEventListener('click', () => {
      stopSnake();
      window.clearTimeout(memoryTimer);
      window.clearTimeout(photoMemoryTimer);
      window.clearTimeout(reactionTimer);
      reactionTimer = null;
      reactionStartedAt = 0;
      window.clearInterval(incrementalTimer);
      activeGame = null;
      picker.hidden = false;
      document.querySelectorAll('#game2048Overlay .game-view').forEach((view) => { view.hidden = true; });
    });
  });

  ticTacToeBoard?.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-cell]');
    if (cell) playTicTacToeCell(Number(cell.dataset.cell));
  });

  document.getElementById('ticTacToeRestart')?.addEventListener('click', startTicTacToe);
  document.getElementById('snakeRestart')?.addEventListener('click', startSnake);
  document.getElementById('memoryRestart')?.addEventListener('click', startMemoryGame);

  document.querySelectorAll('[data-snake-dir]').forEach((button) => {
    button.addEventListener('click', () => setSnakeDirection(button.dataset.snakeDir));
  });

  memoryBoard?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-memory-index]');
    if (card) chooseMemoryCard(Number(card.dataset.memoryIndex));
  });

  document.getElementById('photoMemoryBoard')?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-photo-memory-index]');
    if (card) choosePhotoMemoryCard(Number(card.dataset.photoMemoryIndex));
  });
  document.getElementById('photoMemoryRestart')?.addEventListener('click', startPhotoMemoryGame);
  document.getElementById('puzzleBoard')?.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-puzzle-index]');
    if (tile) movePuzzleTile(Number(tile.dataset.puzzleIndex));
  });
  document.getElementById('puzzleRestart')?.addEventListener('click', startPuzzle);
  document.getElementById('bakeCookie')?.addEventListener('click', () => {
    cookieCount += 1;
    renderIncrementalGames();
  });
  document.getElementById('buyBaker')?.addEventListener('click', () => {
    if (cookieCount < bakerCost) {
      document.getElementById('cookieMessage').textContent = `Need ${bakerCost - Math.floor(cookieCount)} more cookies.`;
      return;
    }
    cookieCount -= bakerCost;
    bakerCount += 1;
    bakerCost = Math.ceil(bakerCost * 1.65);
    document.getElementById('cookieMessage').textContent = 'Your baker is on the job.';
    renderIncrementalGames();
  });
  document.getElementById('growPetal')?.addEventListener('click', () => {
    petalCount += 1;
    renderIncrementalGames();
  });
  document.getElementById('buyPlot')?.addEventListener('click', () => {
    if (petalCount < plotCost) {
      document.getElementById('gardenMessage').textContent = `Need ${plotCost - Math.floor(petalCount)} more petals.`;
      return;
    }
    petalCount -= plotCost;
    plotCount += 1;
    plotCost = Math.ceil(plotCost * 1.6);
    document.getElementById('gardenMessage').textContent = 'Your plot is growing on its own.';
    renderIncrementalGames();
  });

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
    if (!modal || !modal.classList.contains('is-open')) return;

    const keyMap = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };

    const direction = keyMap[event.key];
    if (!direction) return;

    if (activeGame === 'snake') {
      event.preventDefault();
      setSnakeDirection(direction);
      return;
    }
    if (activeGame === 'puzzle') {
      const emptyIndex = puzzleTiles.indexOf(0);
      const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 };
      const tileIndex = emptyIndex + offsets[event.key];
      if (tileIndex >= 0 && tileIndex < puzzleTiles.length) {
        event.preventDefault();
        movePuzzleTile(tileIndex);
      }
      return;
    }
    if (activeGame !== '2048') return;

    event.preventDefault();
    moveBoard(direction);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeGamePanel();
    }
  });
}

function startNumberGuess() {
  numberToGuess = Math.floor(Math.random() * 100) + 1;
  numberGuessCount = 0;
  document.getElementById('numberGuessInput').value = '';
  document.getElementById('numberGuessInput').disabled = false;
  document.getElementById('numberGuessMessage').textContent = 'I picked a number from 1 to 100.';
  document.getElementById('numberGuessInput').focus();
}

function init2048Game() {
  initToysPanel();
  if (!boardElement) return;
  updateBestScore();
  attachControls();
  renderIncrementalGames();
  startGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init2048Game);
} else {
  init2048Game();
}
