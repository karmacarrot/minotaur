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
  boardMapping,
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

    const secondPositions = movePiece(
      currentNode.boardState,
      'whiteKing',
      1,
      'e',
      2,
      'e',
      startStatus
    );

    currentNode.boardState = secondPositions.BoardState;
    const secondKingPositions = kingNodes(currentNode, evalLogs);
    expect(secondKingPositions.length).toBe(4);
  });

  it('returns all legal black king nodes after executing a bong cloud', () => {
    const startingBoard = { ...StartingBoard };
    const startNode = StartingNode();
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'e', 5, 'e', startNode.gameState);

    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(1);

    const secondPositions = movePiece(
      newPositions.BoardState,
      'blackKing',
      8,
      'e',
      7,
      'e',
      startNode.gameState
    );

    startNode.boardState = secondPositions.BoardState;
    const secondKingPositions = kingNodes(startNode, evalLogs);
    expect(secondKingPositions.length).toBe(4);
  });

  it('does not make the black King charge the white Queen when checked(!!)', () => {
    const startingBoard = { ...EndGameBoard };
    const startNode = StartingNode();
    const newPositions = movePiece(
      startingBoard,
      'whiteQueen',
      1,
      'd',
      2,
      'e',
      startNode.gameState
    );

    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(3);

    const secondPositions = movePiece(
      newPositions.BoardState,
      'blackKing',
      8,
      'e',
      7,
      'd',
      startNode.gameState
    );

    const thirdPositions = movePiece(
      secondPositions.BoardState,
      'whiteQueen',
      2,
      'e',
      2,
      'd',
      startNode.gameState
    );

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

  it("doesn't generate a move when it's possible to castle short except that the king is checked", () => {
    const startingBoard = { ...CastleForBlackGameBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    startNode.gameState.blackKingChecked = true;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(0);
  });

  it("doesn't generate a move when it looks possible to castle short but the calling function tells us it no longer is", () => {
    const startingBoard = { ...CastleForBlackGameBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    startNode.gameState.blackKingCanCastleShort = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(0);
  });

  it("doesn't generates a move when castling would move the king through check", () => {
    let startingBoard = { ...CastleForBlackGameBoard };
    const startNode = StartingNode();

    startNode.boardState = startingBoard;
    startNode.boardState.whiteQueen = BigInt(boardMapping.f1);
    startNode.boardState.blackPawn = BigInt(0);
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(0);
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

  it("doesn't generate a move when it seems possible to castle long but the caller is saying it no longer is possible", () => {
    const startingBoard = { ...CastleForBlackGameLongBoard };
    const startNode = StartingNode();
    startNode.boardState = startingBoard;
    startNode.gameState.isWhitesTurn = false;
    startNode.gameState.blackKingCanCastleShort = false;
    startNode.gameState.blackKingCanCastleLong = false;

    const evalLogs = createEvalLogs();
    const potentialMoves = kingCastlingNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(0);
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
