import { COLS, ROWS } from './constants.js';

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function getShape(piece) {
  return piece.shapes[piece.rotation];
}

export function isValid(board, piece, x, y, rotation = piece.rotation) {
  const shape = piece.shapes[rotation];

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;

      const boardX = x + c;
      const boardY = y + r;

      if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
        return false;
      }

      if (boardY >= 0 && board[boardY][boardX]) {
        return false;
      }
    }
  }

  return true;
}

export function lockPiece(board, piece) {
  const shape = getShape(piece);

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;

      const boardY = piece.y + r;
      const boardX = piece.x + c;

      if (boardY >= 0) {
        board[boardY][boardX] = piece.color;
      }
    }
  }
}

export function clearLines(board) {
  let linesCleared = 0;

  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every((cell) => cell !== null)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(null));
      linesCleared++;
      r++;
    }
  }

  return linesCleared;
}
