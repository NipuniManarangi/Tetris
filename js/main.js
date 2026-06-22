import { Game } from './game.js';

const canvas = document.getElementById('board');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('game-over');

const game = new Game(canvas, scoreEl, gameOverEl);
game.start();
