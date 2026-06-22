import { COLS, TETROMINOES } from './constants.js';
import { isValid } from './board.js';

export function spawnPiece() {
  const type = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  const shape = type.shapes[0];
  const width = shape[0].length;

  return {
    name: type.name,
    color: type.color,
    shapes: type.shapes,
    rotation: 0,
    x: Math.floor(COLS / 2) - Math.ceil(width / 2),
    y: 0,
  };
}

export function rotatePiece(piece, board) {
  const nextRotation = (piece.rotation + 1) % piece.shapes.length;

  if (isValid(board, piece, piece.x, piece.y, nextRotation)) {
    piece.rotation = nextRotation;
    return true;
  }

  return false;
}

export function tryMove(piece, board, dx, dy) {
  if (isValid(board, piece, piece.x + dx, piece.y + dy)) {
    piece.x += dx;
    piece.y += dy;
    return true;
  }

  return false;
}

export function hardDrop(piece, board) {
  while (isValid(board, piece, piece.x, piece.y + 1)) {
    piece.y += 1;
  }
}

export function canSpawn(board, piece) {
  return isValid(board, piece, piece.x, piece.y);
}
