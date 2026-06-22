# Tetris

The classic block-stacking puzzle, rebuilt for the web with vanilla JavaScript and an HTML5 canvas — wrapped in a playful macOS-style landing page.

![Tech](https://img.shields.io/badge/built%20with-vanilla%20JS-f7df1e) ![No build](https://img.shields.io/badge/build%20step-none-brightgreen)

## How to play

Tetrominoes fall into a 10×20 well. Move and rotate them to form complete horizontal lines — each completed line clears and scores points. Clear several lines at once for bigger bonuses. The game ends when a new piece can no longer enter the board.

### Controls

| Key | Action |
| --- | --- |
| `←` / `→` | Move left / right |
| `↓` | Soft drop |
| `↑` or `X` | Rotate |
| `Space` | Hard drop |
| `R` | Restart (after Game Over) |

### Scoring

| Lines cleared at once | Points |
| --- | --- |
| 1 | 100 |
| 2 | 300 |
| 3 | 500 |
| 4 (Tetris) | 800 |

## Running locally

The game uses native ES modules (`<script type="module">`), so it must be served over HTTP — opening the file directly with `file://` will be blocked by the browser. Start any static server from the project root:

```bash
# Python 3
python3 -m http.server 8000
```

Then open <http://localhost:8000/> for the landing page, or jump straight to <http://localhost:8000/game.html> to play.

## Project structure

```
.
├── index.html        # macOS-styled landing page with a Play button
├── game.html         # The game screen (canvas + score + controls)
├── style.css         # All styling for both pages
└── js/
    ├── main.js       # Entry point — wires up the DOM and starts the game
    ├── game.js       # Game class: loop, input handling, scoring, game over
    ├── board.js      # Board creation, line clearing, locking pieces
    ├── piece.js      # Piece spawning, movement, rotation, hard drop
    └── constants.js  # Grid/timing config, tetromino shapes, canvas drawing
```

## How it works

- **`Game`** runs a `requestAnimationFrame` loop. A drop accumulator advances the active piece by one row every `DROP_INTERVAL` (800 ms).
- **Pieces** are the seven standard tetrominoes (I, O, T, S, Z, J, L), each with four precomputed rotation states and a signature color.
- **Collision and line logic** live in `board.js`; movement and rotation validity in `piece.js`.
- **Rendering** is done cell-by-cell onto a 300×600 canvas (30 px cells, 10 columns × 20 rows).

## License

This project is provided as-is for learning and fun.
