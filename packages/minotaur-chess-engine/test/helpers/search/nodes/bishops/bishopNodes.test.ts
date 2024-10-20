/**
 * @jest-environment node
 */

import {
  StartingBoard,
  movePiece,
  StartingNode,
  createEvalLogs,
  bishopNodes,
} from '@karmacarrot/minotaur-chess-engine';

describe('bishopNodes', () => {
  it('returns all legal white bishop nodes after moving d and e pawns', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'whitePawn', 2, 'e', 4, 'e');

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    const evalLogs = createEvalLogs();
    const potentialMoves = bishopNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(5);

    const secondPositions = movePiece(newPositions.BoardState, 'whitePawn', 2, 'd', 4, 'd');

    startNode.boardState = secondPositions.BoardState;
    const secondBishopPositions = bishopNodes(startNode, evalLogs);
    expect(secondBishopPositions.length).toBe(10);
  });

  it('returns all legal black bishop nodes after moving d and e pawns', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'e', 5, 'e');

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = bishopNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(5);

    const secondPositions = movePiece(newPositions.BoardState, 'blackPawn', 7, 'd', 5, 'd');

    startNode.boardState = secondPositions.BoardState;
    const secondBishopPositions = bishopNodes(startNode, evalLogs);
    expect(secondBishopPositions.length).toBe(10);
  });
});
