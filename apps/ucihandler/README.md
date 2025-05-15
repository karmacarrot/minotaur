## Terminology

- UCI: Universal Chess Interface. A contract for playing a game between engines facilitated by a GUI app of some sort.
- FEN: Forsyth-Edwards Notation. A universal way of representing board state.

## Sample FEN

Taken from https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

##### Starting position

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Field 1: Piece placement (ranks 8 to 1, '/'-separated)
Field 2: Active color ("w" or "b")
Field 3: Castling rights ("KQkq" or "-")
Field 4: En passant target square ("e3", "d6", or "-")
Field 5: Halfmove clock (for 50-move rule)
Field 6: Fullmove number (starts at 1, incremented after Black's move)

## UCI Commands

- uci: Initialize the engine. Must return id name, id author, and uciok.
- isready: Ask if the engine is ready. Must return readyok.
- ucinewgame: (Optional) Signals a new game is starting. Can reset -internal caches.
- position: Sets up the board. Can be startpos or fen ... + optional moves ...
- go: Tells the engine to start thinking and return a move
- bestmove: Your engine’s response — required even if engine fails (use 0000)
- quit: Cleanly shuts down the engine

## Sample UCI Game

- IN uci
- OUT id name MinotaurEngine
- OUT id author Mark Luxon
- OUT uciok

- IN isready
- OUT readyok

- IN ucinewgame # optional: indicates a new game is starting
- IN isready
- OUT readyok

- IN position startpos # sets up initial position
- IN go
- OUT bestmove e2e4 # engine picks 1. e4

- IN position startpos moves e2e4
- IN go
- OUT bestmove e7e5 # engine plays 1... e5

- IN position startpos moves e2e4 e7e5
- IN go
- OUT bestmove g1f3 # 2. Nf3

- IN position startpos moves e2e4 e7e5 g1f3 b8c6
- IN go
- OUT bestmove f1c4 # 3. Bc4

- IN quit
