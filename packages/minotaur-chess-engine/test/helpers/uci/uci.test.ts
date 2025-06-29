import {
  BoardArrangements,
  FindBestMoveMiniMax,
  MinotaurEngineController,
  moveToUciFormat,
  StartingNode,
  uciToBitMoves,
} from '@karmacarrot/minotaur-chess-engine';

describe('moveToUciFormat', () => {
  it('converts a single move into UCI format', async () => {
    let gameNode = StartingNode();
    const bestMove = await FindBestMoveMiniMax(gameNode.boardState, gameNode.gameState, 2);

    const result = moveToUciFormat(bestMove[0]);

    expect(result).toBe('e2e4');
  });
});

describe('uciToBitMoves basic functionality', () => {
  it('correctly applies the moves to the board', () => {
    let controller = new MinotaurEngineController(2);
    controller.resetGame(BoardArrangements.StartingPositions);

    const fourMoves = 'position startpos moves e2e4 e7e5 g1f3 b8c6';
    const bitMoves = uciToBitMoves(fourMoves, controller.currentBoard, () => {
      return;
    });

    expect(bitMoves.length).toBe(4);

    expect(bitMoves[0].piece).toBe('whitePawn');
    expect(bitMoves[1].piece).toBe('blackPawn');
    expect(bitMoves[2].piece).toBe('whiteKnight');
    expect(bitMoves[3].piece).toBe('blackKnight');
  });
});
