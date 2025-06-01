/**
 * @jest-environment node
 */

import {
  StartingBoard,
  InitialGameStatus,
  GameNode,
  generateNodeId,
  generateLegalMoves,
  CastleForBlackGameBoard,
  StartingNode,
  createEvalLogs,
  blackKingShortCastleDestination,
  blackKingShortCastleRookDestination,
  PromoteForBlackGameBoard,
} from '@karmacarrot/minotaur-chess-engine';
import { LogBoardPositions } from '../../testHelper';

describe('generateLegalMoves', () => {
  it('generates the correct possible starting moves for white', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode: GameNode = {
      boardState: startBoard,
      gameState: startStatus,
      id: generateNodeId(),
      parentId: '',
    };
    const possibleMoves = generateLegalMoves(currentNode);
    expect(possibleMoves.length).toBe(20);
  });

  it('includes a castling move for black when castling is possible', () => {
    const startingBoard = { ...CastleForBlackGameBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;

    const potentialMoves = generateLegalMoves(startNode);

    const castleMove = potentialMoves.find(
      (x) =>
        x.boardState.blackKing === blackKingShortCastleDestination &&
        x.boardState.blackRook == blackKingShortCastleRookDestination
    );
    expect(castleMove).toBeTruthy;

    castleMove && LogBoardPositions(castleMove.boardState);
  });

  it('includes a promotion move for black when promotion is possible', () => {
    const startingBoard = { ...PromoteForBlackGameBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;

    const potentialMoves = generateLegalMoves(startNode);

    const promotionMove = potentialMoves.find((x) => x.boardState.blackQueen > 0);
    expect(promotionMove).toBeTruthy;

    promotionMove && LogBoardPositions(promotionMove.boardState);
  });
});

describe('generateNodeId', () => {
  it('returns a string of 36 characters that are different each time', () => {
    const idOne = generateNodeId();
    const idTwo = generateNodeId();

    expect(idOne.length).toBe(36);
    expect(idOne === idTwo).toBeFalsy;
  });
});
