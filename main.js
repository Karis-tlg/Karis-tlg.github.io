let board = ['', '', '', '', '', '', '', '', ''];
let human = 'X';
let computer = 'O';
let currentPlayer = human;

function updateBoard(index) {
  board[index] = currentPlayer;
  document.getElementById(index).innerText = currentPlayer;
  document.getElementById(index).removeEventListener('click', handleClick);
  checkForWinner();
  currentPlayer = currentPlayer === human ? computer : human;
  if (currentPlayer === computer) {
    setTimeout(computerMove, 300);
  }
}

function handleClick(event) {
  updateBoard(event.target.id);
}

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkForWinner() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      alert(`${board[a]} wins!`);
      resetBoard();
      return;
    }
  }
  if (board.every((cell) => cell !== '')) {
    alert("It's a tie!");
    resetBoard();
  }
}

function resetBoard() {
  board = ['', '', '', '', '', '', '', '', ''];
  document.querySelectorAll('.square').forEach((square) => {
    square.innerText = '';
    square.addEventListener('click', handleClick);
  });
}

function computerMove() {
  const emptySquares = board.reduce((acc, value, index) => {
    if (value === '') {
      acc.push(index);
    }
    return acc;
  }, []);
  const bestMoves = findBestMoves(emptySquares);
  const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  updateBoard(move);
}

function findBestMoves(emptySquares) {
  let bestMoves = [];
  let bestScore = -Infinity;
  for (let i = 0; i < emptySquares.length; i++) {
    board[emptySquares[i]] = computer;
    const score = minimax(0, false);
    board[emptySquares[i]] = '';
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [emptySquares[i]];
    } else if (score === bestScore) {
      bestMoves.push(emptySquares[i]);
    }
  }
  return bestMoves;
}

function minimax(depth, isMaximizing) {
  const result = checkForMinimaxWinner();
  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = computer;
        const score = minimax(depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = human;
        const score = minimax(depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkForMinimaxWinner() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if (board[a] === computer) {
        return 10;
      } else {
        return -10;
      }
    }
  }
  if (board.every((cell) => cell !== '')) {
    return 0;
  }
  return null;
}

document.querySelectorAll('.square').forEach((square) => {
  square.addEventListener('click', handleClick);
});
