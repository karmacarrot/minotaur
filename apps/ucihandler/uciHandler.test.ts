import { spawn } from 'child_process';
import { uciToBitMoves } from './uciHandler.ts';
import { BoardArrangements, MinotaurEngineController } from '@karmacarrot/minotaur-chess-engine';

async function runEngineWithInput(inputs: string[]): Promise<string[]> {
  const child = spawn('node', ['uciHandler.ts']);

  const finalOutput = await new Promise<string>((resolve, reject) => {
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    child.on('error', reject);
    child.on('spawn', () => {
      for (const input of inputs) {
        child.stdin.write(input + '\n');
      }
      child.stdin.end();
    });
    child.on('close', () => {
      resolve(output);
    });
  });
  console.log('Raw output:', JSON.stringify(finalOutput));
  return finalOutput.split(/\r?\n/).filter((line) => line.trim().length > 0);
}

describe('UCI Wrapper basic CLI functionality', () => {
  it('starts the engine', async () => {
    const responses = await runEngineWithInput(['quit']);
    expect(responses).toContain('UCI handler started.');
  });

  it('responds to uci command', async () => {
    const responses = await runEngineWithInput(['uci', 'quit']);
    expect(responses).toContain('uciok');
    expect(responses.some((r) => r.startsWith('id name'))).toBe(true);
  });

  it('responds to isready command', async () => {
    const responses = await runEngineWithInput(['isready', 'quit']);
    expect(responses).toContain('readyok');
  });

  it('calculates a best move from start position', async () => {
    const responses = await runEngineWithInput(['ucinewgame', 'position startpos', 'go', 'quit']);
    console.log(`responses ${responses}`);
    const bestMoveLine = responses.find((r) => r.startsWith('bestmove'));
    expect(bestMoveLine).toBe('bestmove e2e4');
  });
});

describe('Chess Rule Coverage via UCI Handler', () => {
  // Helpers
  const run = (inputs: string[]) => runEngineWithInput([...inputs, 'quit']);

  it('handles en passant correctly', async () => {
    const responses = await run([
      'ucinewgame',
      'position startpos moves e2e4 e7e5 e4e5 d7d5 e5d6',
      'go',
    ]);
    // expect something that proves en passant occurred (e.g., captured pawn missing)
  });

  it('handles castling kingside', async () => {
    const responses = await run([
      'ucinewgame',
      'position startpos moves e2e4 e7e5 g1f3 b8c6 f1e2 g8f6 e1g1',
      'go',
    ]);
    // expect king to be on g1, rook on f1
  });

  it('handles castling queenside', async () => {
    const responses = await run([
      'ucinewgame',
      'position startpos moves d2d4 d7d5 c1d2 e7e6 d1e2 g8f6 e1c1',
      'go',
    ]);
    // expect king on c1, rook on d1
  });

  it('handles pawn promotion', async () => {
    const responses = await run([
      'ucinewgame',
      'position startpos moves e2e4 d7d5 e4d5 c7c5 d5c6 c5c4 c6b7 c4c3 b7a8q',
      'go',
    ]);
    // expect promoted piece to be a queen at a8
  });

  it('handles check', async () => {
    const responses = await run([
      'ucinewgame',
      'position startpos moves e2e4 e7e5 d1h5 b8c6 f1c4 g8f6 h5f7',
      'go',
    ]);
    // expect check or mate response
  });

  it('handles checkmate', async () => {
    const responses = await run([
      'ucinewgame',
      'position startpos moves f2f3 e7e5 g2g4 d8h4',
      'go',
    ]);
    // expect "bestmove (none)" or some indication of checkmate
  });

  it('handles stalemate', async () => {
    // Load a known stalemate position
    const responses = await run(['position fen 7k/5Q2/6K1/8/8/8/8/8 w - - 0 1', 'go']);
    // expect bestmove to be (none) or similar
  });

  it('handles insufficient material draw', async () => {
    const responses = await run(['position fen 8/8/8/8/8/2k5/8/3K4 w - - 0 1', 'go']);
    // expect no legal move or draw response
  });
});

describe('uciToBitMoves basic functionality', () => {
  it('correctly applies the moves to the board', () => {
    let controller = new MinotaurEngineController(2);
    controller.resetGame(BoardArrangements.StartingPositions);

    const fourMoves = 'position startpos moves e2e4 e7e5 g1f3 b8c6';
    const bitMoves = uciToBitMoves(fourMoves, controller.currentBoard);

    expect(bitMoves.length).toBe(4);

    expect(bitMoves[0].piece).toBe('whitePawn');
    expect(bitMoves[1].piece).toBe('blackPawn');
    expect(bitMoves[2].piece).toBe('whiteKnight');
    expect(bitMoves[3].piece).toBe('blackKnight');
  });
});

describe('uciToBitMoves - Special Rule Coverage', () => {
  let controller: MinotaurEngineController;

  beforeEach(() => {
    controller = new MinotaurEngineController(2);
    controller.resetGame(BoardArrangements.StartingPositions);
  });

  it('parses en passant capture', () => {
    const moves = 'position startpos moves e2e4 e7e5 e4e5 d7d5 e5d6';
    const bitMoves = uciToBitMoves(moves, controller.currentBoard);
    // expect bitMoves to contain en passant flag or missing captured pawn
  });

  it('parses kingside castling', () => {
    const moves = 'position startpos moves g1f3 e7e5 f1c4 g8f6 e1g1';
    const bitMoves = uciToBitMoves(moves, controller.currentBoard);
    // expect move from e1 to g1 and rook moved
  });

  it('parses promotion to queen', () => {
    const customBoard = 'position fen 7P/8/8/8/8/8/8/k6K w - - 0 1';
    const move = 'h8q'; // H-pawn promotes to queen
    const bitMoves = uciToBitMoves(
      `position fen ${customBoard} moves ${move}`,
      controller.currentBoard
    );
    // expect promotionPiece to be 'queen'
  });

  it('ignores illegal move', () => {
    const bitMoves = uciToBitMoves('position startpos moves e2e5', controller.currentBoard);
    expect(bitMoves.length).toBe(0);
  });
});
