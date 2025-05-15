import {
  FindBestMoveMiniMax,
  moveToUciFormat,
  StartingNode,
} from '@karmacarrot/minotaur-chess-engine';

describe('moveToUciFormat', () => {
  it('converts a single move into UCI format', async () => {
    let gameNode = StartingNode();
    const bestMove = await FindBestMoveMiniMax(gameNode.boardState, gameNode.gameState, 2);

    const result = moveToUciFormat(bestMove);

    expect(result).toBe('e2e4');
  });
});
