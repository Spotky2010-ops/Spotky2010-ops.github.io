let previousBoard = [];

function renderBoard() {
  if (!boardElement) return;

  const currentBoard = board.map((row) => [...row]);
  boardElement.innerHTML = '';

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const value = board[row][col];
      const previousValue = previousBoard[row]?.[col] ?? 0;

      const cell = document.createElement('div');
      cell.className = 'game-2048-cell';
      cell.dataset.value = String(value);

      if (value !== 0) {
        cell.textContent = String(value);
      }

      if (value !== 0 && previousValue === 0) {
        cell.classList.add('is-new');
      }

      if (value !== 0 && previousValue !== 0 && value > previousValue && previousValue * 2 === value) {
        cell.classList.add('is-merged');
      }

      boardElement.appendChild(cell);
    }
  }

  previousBoard = currentBoard;
  if (scoreElement) scoreElement.textContent = String(score);
  updateBestScore();
}
