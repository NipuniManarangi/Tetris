import { DROP_INTERVAL, LINE_SCORES, drawBoard } from './constants.js';
import { createBoard, clearLines, lockPiece } from './board.js';
import {
  canSpawn,
  hardDrop,
  rotatePiece,
  spawnPiece,
  tryMove,
} from './piece.js';

export class Game {
  constructor(canvas, scoreEl, gameOverEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scoreEl = scoreEl;
    this.gameOverEl = gameOverEl;

    this.board = null;
    this.piece = null;
    this.score = 0;
    this.gameOver = false;
    this.lastTime = 0;
    this.dropAccumulator = 0;
    this.animationId = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  start() {
    this.board = createBoard();
    this.piece = spawnPiece();
    this.score = 0;
    this.gameOver = false;
    this.lastTime = 0;
    this.dropAccumulator = 0;

    this.updateScore();
    this.gameOverEl.classList.add('hidden');

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.animationId = requestAnimationFrame((time) => this.loop(time));
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  handleKeyDown(event) {
    if (this.gameOver) {
      if (event.key === 'r' || event.key === 'R') {
        this.start();
      }
      return;
    }

    const actionKeys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
      'x',
      'X',
      ' ',
    ];

    if (actionKeys.includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowLeft':
        tryMove(this.piece, this.board, -1, 0);
        break;
      case 'ArrowRight':
        tryMove(this.piece, this.board, 1, 0);
        break;
      case 'ArrowDown':
        if (tryMove(this.piece, this.board, 0, 1)) {
          this.dropAccumulator = 0;
        }
        break;
      case 'ArrowUp':
      case 'x':
      case 'X':
        rotatePiece(this.piece, this.board);
        break;
      case ' ':
        hardDrop(this.piece, this.board);
        this.lockAndSpawn();
        break;
      default:
        break;
    }

    drawBoard(this.ctx, this.board, this.piece);
  }

  loop(time) {
    if (this.gameOver) return;

    const delta = this.lastTime ? time - this.lastTime : 0;
    this.lastTime = time;
    this.dropAccumulator += delta;

    if (this.dropAccumulator >= DROP_INTERVAL) {
      this.dropAccumulator = 0;

      if (!tryMove(this.piece, this.board, 0, 1)) {
        this.lockAndSpawn();
      }
    }

    drawBoard(this.ctx, this.board, this.piece);
    this.animationId = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  lockAndSpawn() {
    lockPiece(this.board, this.piece);

    const linesCleared = clearLines(this.board);
    if (linesCleared > 0) {
      this.score += LINE_SCORES[linesCleared] || 0;
      this.updateScore();
    }

    this.piece = spawnPiece();

    if (!canSpawn(this.board, this.piece)) {
      this.endGame();
    }
  }

  updateScore() {
    this.scoreEl.textContent = `Score: ${this.score}`;
  }

  endGame() {
    this.gameOver = true;
    this.gameOverEl.classList.remove('hidden');
    drawBoard(this.ctx, this.board, null);

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
