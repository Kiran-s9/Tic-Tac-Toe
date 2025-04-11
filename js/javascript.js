let board = Array.from({ length: 9 }, (_, i) => i);
let visiter = "O";
let ai = "X";
let aiPlayer = ai;
let huPlayer = visiter;
let round = 0;
let playerImage = "circle";
let AIImage = "cross";
let gameOver = false;
let gameStarted = false;

$(document).ready(function () {
  initGame();
});

$("#reset").click(function () {
  reset();
});

function initGame() {
  $("#start").click(function () {
    $(".modal").css("display", "flex");
    $("#start").css("display", "none");
  });

  $(".X").click(function () {
    visiter = "X";
    ai = "O";
    aiPlayer = ai;
    huPlayer = visiter;
    playerImage = "cross";
    AIImage = "circle";
    $(".modal").hide();
    gameStarted = true;
  });

  $(".O").click(function () {
    visiter = "O";
    ai = "X";
    aiPlayer = ai;
    huPlayer = visiter;
    playerImage = "circle";
    AIImage = "cross";
    $(".modal").hide();
    gameStarted = true;
  });

  $(".cell").click(function () {
    mark(this);
  });

  $("#reset").click(function () {
    reset();
  });
}

function mark(block) {
  if (!gameStarted || gameOver) return;
  const id = block.id;
  if (board[id] !== "X" && board[id] !== "O") {
    board[id] = visiter;
    if (playerImage == "cross") {
      block.textContent = "❌";
    } else {
      block.textContent = "⭕";
    }

    round++;

    if (checkWin(board, visiter)) {
      showEndMessage("You Win!");
      gameOver = true;
      return;
    } else if (round > 8) {
      showEndMessage("Draw!");
      gameOver = true;
      return;
    }
    let aiMove;
    const availableSpots = board.filter((s) => s !== "X" && s !== "O");
    if (Math.random() < 0.5) {
      aiMove = minimax(board, aiPlayer).index;
    } else {
      aiMove =
        availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
    board[aiMove] = ai;

    if (AIImage == "cross") {
      $("#" + aiMove).text("❌");
    } else {
      $("#" + aiMove).text("⭕");
    }
    round++;

    if (checkWin(board, ai)) {
      showEndMessage("You Lose!");
      gameOver = true;
    }
  }
}

function showEndMessage(message) {
  $("h3").text(message).show();
  $(".playagain").show();
}

function reset() {
  board = Array.from({ length: 9 }, (_, i) => i);
  round = 0;
  gameOver = false;
  gameStarted = false;
  $(".cell").text("");
  $("h3").hide().text("");
  $(".playagain").hide();
  $(".modal").show();
}

function minimax(newBoard, player) {
  const availSpots = newBoard.filter((s) => s !== "X" && s !== "O");

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    let result;
    if (player === aiPlayer) {
      result = minimax(newBoard, huPlayer);
    } else {
      result = minimax(newBoard, aiPlayer);
    }

    move.score = result.score;
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) =>
    pattern.every((index) => board[index] === player)
  );
}
