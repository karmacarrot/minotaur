/**
 * @jest-environment node
 */

import {
  StartingBoard,
  InitialGameStatus,
  applyMove,
  generateNodeId,
  createEvalLogs,
  kingNodes,
  outputEvalLogsHtml,
  movePiece,
  StartingNode,
  EndGameBoard,
  getBitBoardPosition,
  binaryMask64,
  CastleForBlackGameBoard,
  kingCastlingNodes,
  blackKingShortCastleDestination,
  blackKingShortRook,
  CastleForBlackAfterGameBoard,
  clearPosition,
  blackKingShortCastleRookDestination,
  CastleForBlackGameLongBoard,
  blackKingLongCastleDestination,
  blackKingLongCastleRookDestination,
  bitCount,
  bigIntToBinaryString,
} from '@karmacarrot/minotaur-chess-engine';
import { LogBoardPositions } from '../../../testHelper';

describe('kingNodes', () => {
  it('returns all legal white king nodes after executing a bong cloud', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };

    const newBoard = applyMove(startBoard, 13, 29, 'whitePawn');
    startStatus.isWhitesTurn = true;

    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const evalLogs = createEvalLogs();
    const potentialMoves = kingNodes(currentNode, evalLogs);

    outputEvalLogsHtml(evalLogs, 'returns all legal white king nodes after executing a bong cloud');

    expect(potentialMoves.length).toBe(1);

    const secondPositions = movePiece(currentNode.boardState, 'whiteKing', 1, 'e', 2, 'e');

    currentNode.boardState = secondPositions.BoardState;
    const secondKingPositions = kingNodes(currentNode, evalLogs);
    expect(secondKingPositions.length).toBe(4);
  });

  it('returns all legal black king nodes after executing a bong cloud', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'e', 5, 'e');

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(1);

    const secondPositions = movePiece(newPositions.BoardState, 'blackKing', 8, 'e', 7, 'e');

    startNode.boardState = secondPositions.BoardState;
    const secondKingPositions = kingNodes(startNode, evalLogs);
    expect(secondKingPositions.length).toBe(4);
  });

  it('does not make the black King charge the white Queen when checked(!!)', () => {
    const startingBoard = { ...EndGameBoard };
    const newPositions = movePiece(startingBoard, 'whiteQueen', 1, 'd', 2, 'e');

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(3);

    const secondPositions = movePiece(newPositions.BoardState, 'blackKing', 8, 'e', 7, 'd');

    const thirdPositions = movePiece(secondPositions.BoardState, 'whiteQueen', 2, 'e', 2, 'd');

    startNode.boardState = thirdPositions.BoardState;
    const secondKingPositions = kingNodes(startNode, evalLogs);
    expect(secondKingPositions.length).toBe(6);

    const kingDsixPosition = getBitBoardPosition('d', 6);
    const kingDsixMask = binaryMask64(kingDsixPosition, 'all_zeroes_with_position_as_one');

    expect(secondKingPositions.find((x) => x.boardState.blackKing === kingDsixMask)).toBeNull;
  });
});

describe('kingCastlingNodes', () => {
  it("generates a move when it's possible to castle short", () => {
    const startingBoard = { ...CastleForBlackGameBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(1);

    LogBoardPositions(startingBoard);
    LogBoardPositions(potentialMoves[0].boardState);
  });
  it('moves the king and rook to the correct positions when castling short', () => {
    const startingBoard = { ...CastleForBlackGameBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    const move = potentialMoves[0];

    expect(move.boardState.blackKing & blackKingShortCastleDestination).toBe(
      blackKingShortCastleDestination
    );
    expect(move.boardState.blackRook & blackKingShortCastleRookDestination).toBe(
      blackKingShortCastleRookDestination
    );
  });
  it("generates a move when it's possible to castle long", () => {
    const startingBoard = { ...CastleForBlackGameLongBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    startNode.gameState.blackKingCanCastleShort = false;
    startNode.gameState.blackKingCanCastleLong = true;

    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(1);

    LogBoardPositions(startingBoard);
    LogBoardPositions(potentialMoves[0].boardState);
  });

  it('moves the king and rook to the correct positions when castling long', () => {
    const startingBoard = { ...CastleForBlackGameLongBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    startNode.gameState.blackKingCanCastleShort = false;
    startNode.gameState.blackKingCanCastleLong = true;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    const move = potentialMoves[0];

    expect(bitCount(move.boardState.blackRook)).toEqual(1);
    expect(move.boardState.blackKing & blackKingLongCastleDestination).toBe(
      blackKingLongCastleDestination
    );
    expect(move.boardState.blackRook & blackKingLongCastleRookDestination).toBe(
      blackKingLongCastleRookDestination
    );
  });
});
