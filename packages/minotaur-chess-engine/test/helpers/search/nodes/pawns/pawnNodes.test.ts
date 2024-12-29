/**
 * @jest-environment node
 */

import {
  allPositions,
  applyMove,
  binaryMask64,
  bitCount,
  blackPawnNodes,
  blackPawnTwoSquareNodes,
  createEvalLogs,
  DuellingPawnsBoard,
  EmptyBoard,
  EnPassantBoard,
  generateNodeId,
  getBitBoardPosition,
  InitialGameStatus,
  LoggerConfig,
  outputEvalLogsHtml,
  StartingBoard,
  whitePawnNodes,
  whitePawnEnPassantCaptureNodes,
  blackPawnEnPassantCaptureNodes,
} from '@karmacarrot/minotaur-chess-engine';
import { LogBoardPositions } from '../../../testHelper';

describe('whitePawnNodes', () => {
  it('returns 16 possible nodes from a starting board', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const whitePawnNodeArray = whitePawnNodes(currentNode);
    expect(whitePawnNodeArray.length).toBe(16);
  });

  it('returns 14 possible white nodes from duelling pawns board', () => {
    const duellingBoard = { ...DuellingPawnsBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: duellingBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const whitePawnNodeArray = whitePawnNodes(currentNode);
    expect(whitePawnNodeArray.length).toBe(14);
    for (let pawnNode of whitePawnNodeArray) {
      const countBlackPawns = bitCount(pawnNode.boardState.blackPawn);
      const countWhitePawns = bitCount(pawnNode.boardState.whitePawn);
      expect(countBlackPawns).toBeLessThan(countWhitePawns);
    }
  });

  it('returns 16 possible nodes for black pawns from a starting row', () => {
    const startBoard = { ...EmptyBoard };
    startBoard.blackPawn = StartingBoard.blackPawn;
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    expect(blackPawnNodeArray.length).toBe(16);
  });

  it('returns 16 possible nodes for black pawns from a starting row after white d4', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };

    const newBoard = applyMove(startBoard, 12, 28, 'whitePawn');
    startStatus.isWhitesTurn = false;

    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    expect(blackPawnNodeArray.length).toBe(16);
  });

  it('returns 14 possible black pawn nodes from duelling pawns board', () => {
    const duellingBoard = { ...DuellingPawnsBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: duellingBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    expect(blackPawnNodeArray.length).toBe(14);
    for (let pawnNode of blackPawnNodeArray) {
      const countBlackPawns = bitCount(pawnNode.boardState.blackPawn);
      const countWhitePawns = bitCount(pawnNode.boardState.whitePawn);
      expect(countWhitePawns).toBeLessThan(countBlackPawns);
    }
  });
});

describe('whitePawnEnPassantCaptureNodes', () => {
  it("returns a possible en passant capture for white from a board where black moves to h5 while white's pawn is on g5", () => {
    const enPassantBoard = { ...EnPassantBoard };
    const startStatus = { ...InitialGameStatus };
    const lastBlackDoubleSquareMove = binaryMask64(
      getBitBoardPosition('h', 5),
      'all_zeroes_with_position_as_one'
    );
    startStatus.isWhitesTurn = false;
    startStatus.lastBlackDoublePawnMove = lastBlackDoubleSquareMove;
    const moveBlackPawn = applyMove(enPassantBoard, 56, 40, 'blackPawn');
    LogBoardPositions(moveBlackPawn);
    const currentNode = {
      boardState: moveBlackPawn,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const moves = whitePawnEnPassantCaptureNodes(currentNode);
    LogBoardPositions(moves[0].boardState);
    expect(moves.length).toBe(1);
    expect(moves[0].boardState.blackPawn & lastBlackDoubleSquareMove).toBe(BigInt(0));
  });
});

describe('blackPawnEnPassantCaptureNodes', () => {
  it("returns a possible en passant capture for black from a board where white moves to c4 while black's pawn is on d4", () => {
    const enPassantBoard = { ...EnPassantBoard };
    const startStatus = { ...InitialGameStatus };
    const lastWhiteDoubleSquareMove = binaryMask64(
      getBitBoardPosition('c', 4),
      'all_zeroes_with_position_as_one'
    );
    startStatus.isWhitesTurn = true;
    startStatus.lastWhiteDoublePawnMove = lastWhiteDoubleSquareMove;
    const moveWhitePawn = applyMove(enPassantBoard, 11, 27, 'whitePawn');
    LogBoardPositions(moveWhitePawn);
    const currentNode = {
      boardState: moveWhitePawn,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const moves = blackPawnEnPassantCaptureNodes(currentNode);
    LogBoardPositions(moves[0].boardState);
    expect(moves.length).toBe(2);
    expect(moves[0].boardState.whitePawn & lastWhiteDoubleSquareMove).toBe(BigInt(0));
  });
});

describe('blackPawnTwoSquareNodes', () => {
  it('returns 8 possible 2 step moves from white d4 opening', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };

    const newBoard = applyMove(startBoard, 12, 28, 'whitePawn');
    startStatus.isWhitesTurn = false;

    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const allOccupiedPositions = allPositions(currentNode.boardState);

    const blackPawnNodeArray = blackPawnTwoSquareNodes(currentNode, allOccupiedPositions);
    expect(blackPawnNodeArray.length).toBe(8);
  });

  it('cannot move onto occupied squares in the same file', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const firstMove = applyMove(startBoard, 10, 26, 'whitePawn');
    const secondMove = applyMove(firstMove, 53, 37, 'blackPawn');
    const thirdMove = applyMove(secondMove, 26, 34, 'whitePawn');
    startStatus.isWhitesTurn = false;

    const currentNode = {
      boardState: thirdMove,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    const illegalMove = applyMove(thirdMove, 50, 34, 'blackPawn');

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    const foundNode = blackPawnNodeArray.find((node) => {
      return node.boardState.blackPawn === illegalMove.blackPawn;
    });

    if (LoggerConfig.enableEvaluationLogs) {
      evalLogs.evalAddNode(currentNode, 1);
      blackPawnNodeArray.forEach((pawnNode) => {
        evalLogs.evalAddNode(pawnNode, 0);
      });
      outputEvalLogsHtml(evalLogs, 'cannot move onto occupied squares in the same file');
    }

    expect(foundNode).toBeFalsy();
  });
});
