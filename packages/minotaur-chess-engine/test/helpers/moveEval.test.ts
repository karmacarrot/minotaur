/**
 * @jest-environment node
 */

import {
  StartingBoard,
  FindBestMoves,
  InitialGameStatus,
  FindBestMoveMiniMax,
  allPositions,
  BlackPawnMovesComposite,
  getBitBoardPosition,
  DuellingPawnsBoard,
  allWhitePositions,
  BlackPawnCaptures,
  WhitePawnCaptures,
  WhitePawnMovesComposite,
  allBlackPositions,
  AllWhitePawnMovesComposite,
  occupiedBy,
  AllBlackPawnMovesComposite,
  bigIntToBinaryString,
  AllBlackPawnMovesOneSquare,
  AllBlackPawnMovesTwoSquare,
  applyMove,
  AllKnightMoves,
  bitCount,
  movePiece,
  AllBishopMoves,
  LoggerConfig,
  outputSinglePiecePositions,
  AllRookMoves,
  outputSingleBitboardHtml,
  AllKingMoves,
  AllQueenMoves,
} from '@karmacarrot/minotaur-chess-engine';

describe('FindBestMoves', () => {
  it('makes a legal move on opening for white', () => {
    const startingBoard = { ...StartingBoard };
    const bestMoves = FindBestMoves(startingBoard, true);
    expect(bestMoves.length).toBe(3);
    expect(bestMoves[0].move.to > 16 && bestMoves[0].move.to <= 32).toBeTruthy;
  });
  it('makes a legal first move for black', () => {
    const startingBoard = { ...StartingBoard };
    const bestMoves = FindBestMoves(startingBoard, false);
    //console.log(bestMoves);
    expect(bestMoves.length).toBe(3);
    expect(bestMoves[0].move.to).toBeLessThanOrEqual(48);
    expect(bestMoves[0].move.to).toBeGreaterThanOrEqual(32);
  });
});

describe('FindBestMoveMiniMax', () => {
  it('makes a legal move on opening for white', async () => {
    const startingBoard = { ...StartingBoard };
    const startingGameState = { ...InitialGameStatus };
    const bestMove = await FindBestMoveMiniMax(startingBoard, startingGameState, 1);

    expect(bestMove.to > 16 && bestMove.to <= 32).toBeTruthy;
    expect(bestMove.from > 11 && bestMove.from < 14).toBeTruthy;
  });
  it('makes a legal first move for black', async () => {
    const startingBoard = { ...StartingBoard };
    const startingGameState = { ...InitialGameStatus };
    startingGameState.isWhitesTurn = false;
    const bestMove = await FindBestMoveMiniMax(startingBoard, startingGameState, 1);

    expect(bestMove.to).toBeLessThanOrEqual(48);
    expect(bestMove.to).toBeGreaterThanOrEqual(32);
    expect(bestMove.from).toBeLessThanOrEqual(54);
    expect(bestMove.from).toBeGreaterThanOrEqual(51);
  });
});

describe('BlackPawnMovesComposite', () => {
  const testCases = [
    { file: 'a', startRank: 7, endRank: 6 },
    { file: 'b', startRank: 7, endRank: 6 },
    { file: 'c', startRank: 7, endRank: 6 },
    { file: 'b', startRank: 7, endRank: 6 },
    { file: 'd', startRank: 7, endRank: 6 },
    { file: 'e', startRank: 7, endRank: 6 },
    { file: 'f', startRank: 7, endRank: 6 },
    { file: 'g', startRank: 7, endRank: 6 },
    { file: 'h', startRank: 7, endRank: 6 },
    { file: 'a', startRank: 7, endRank: 5 },
    { file: 'b', startRank: 7, endRank: 5 },
    { file: 'c', startRank: 7, endRank: 5 },
    { file: 'd', startRank: 7, endRank: 5 },
    { file: 'e', startRank: 7, endRank: 5 },
    { file: 'f', startRank: 7, endRank: 5 },
    { file: 'g', startRank: 7, endRank: 5 },
    { file: 'h', startRank: 7, endRank: 5 },
  ];

  const captureTestCases = [
    { startFile: 'a', startRank: 5, endFile: 'b', endRank: 4 },
    { startFile: 'b', startRank: 5, endFile: 'c', endRank: 4 },
    { startFile: 'b', startRank: 5, endFile: 'a', endRank: 4 },
    { startFile: 'c', startRank: 5, endFile: 'd', endRank: 4 },
    { startFile: 'd', startRank: 5, endFile: 'c', endRank: 4 },
    { startFile: 'd', startRank: 5, endFile: 'e', endRank: 4 },
    { startFile: 'e', startRank: 5, endFile: 'f', endRank: 4 },
    { startFile: 'f', startRank: 5, endFile: 'g', endRank: 4 },
    { startFile: 'g', startRank: 5, endFile: 'h', endRank: 4 },
    { startFile: 'h', startRank: 5, endFile: 'g', endRank: 4 },
  ];

  it.each(testCases)(
    'can return moves containing a black pawn moving from $startRank to $endRank on file $file',
    ({ file, startRank, endRank }) => {
      const startingBoard = { ...StartingBoard };
      const allOccupiedPositions = allPositions(startingBoard);
      const moves = BlackPawnMovesComposite(startingBoard);
      const startPosition = getBitBoardPosition(file, startRank);
      const endPosition = getBitBoardPosition(file, endRank);

      //console.log(moves);
      const moveFound = moves.some(
        (move) => move.from === startPosition && move.to === endPosition
      );

      expect(moveFound).toBeTruthy();
    }
  );

  it.each(captureTestCases)(
    'can return moves containing black pawn capturing from $startFile$startRank to $endFile$endRank when in duelling positions',
    ({ startFile, startRank, endFile, endRank }) => {
      const duellingBoard = { ...DuellingPawnsBoard };
      const allOccupiedWhitePositions = allWhitePositions(duellingBoard);
      const moves = BlackPawnCaptures(duellingBoard, allOccupiedWhitePositions);

      const startPosition = getBitBoardPosition(startFile, startRank);
      const endPosition = getBitBoardPosition(endFile, endRank);
      //console.log(moves);
      const moveFound = moves.some(
        (move) => move.from === startPosition && move.to === endPosition
      );

      expect(moveFound).toBeTruthy();
    }
  );

  it.each(captureTestCases)(
    "can't return moves containing white pawn capturing from $startFile$startRank to $endFile$endRank when no black pawn exists in target square",
    ({ startFile, startRank, endFile, endRank }) => {
      const duellingBoard = { ...DuellingPawnsBoard };
      const allOccupiedPositions = BigInt(0);
      const moves = WhitePawnCaptures(duellingBoard, allOccupiedPositions);

      const startPosition = getBitBoardPosition(startFile, startRank);
      const endPosition = getBitBoardPosition(endFile, endRank);

      const moveFound = moves.some(
        (move) => move.from === startPosition && move.to === endPosition
      );

      expect(moveFound).toBeFalsy();
    }
  );
});

describe('WhitePawnMovesComposite', () => {
  const testCases = [
    { file: 'a', startRank: 2, endRank: 3 },
    { file: 'b', startRank: 2, endRank: 3 },
    { file: 'c', startRank: 2, endRank: 3 },
    { file: 'd', startRank: 2, endRank: 3 },
    { file: 'e', startRank: 2, endRank: 3 },
    { file: 'f', startRank: 2, endRank: 3 },
    { file: 'g', startRank: 2, endRank: 3 },
    { file: 'h', startRank: 2, endRank: 3 },
    { file: 'a', startRank: 2, endRank: 4 },
    { file: 'b', startRank: 2, endRank: 4 },
    { file: 'c', startRank: 2, endRank: 4 },
    { file: 'd', startRank: 2, endRank: 4 },
    { file: 'e', startRank: 2, endRank: 4 },
    { file: 'f', startRank: 2, endRank: 4 },
    { file: 'g', startRank: 2, endRank: 4 },
    { file: 'h', startRank: 2, endRank: 4 },
  ];

  const captureTestCases = [
    { startFile: 'a', startRank: 4, endFile: 'b', endRank: 5 },
    { startFile: 'b', startRank: 4, endFile: 'c', endRank: 5 },
    { startFile: 'b', startRank: 4, endFile: 'a', endRank: 5 },
    { startFile: 'c', startRank: 4, endFile: 'd', endRank: 5 },
    { startFile: 'd', startRank: 4, endFile: 'c', endRank: 5 },
    { startFile: 'd', startRank: 4, endFile: 'e', endRank: 5 },
    { startFile: 'e', startRank: 4, endFile: 'f', endRank: 5 },
    { startFile: 'f', startRank: 4, endFile: 'g', endRank: 5 },
    { startFile: 'g', startRank: 4, endFile: 'h', endRank: 5 },
    { startFile: 'h', startRank: 4, endFile: 'g', endRank: 5 },
  ];

  it.each(testCases)(
    'can return moves containing a white pawn moving from $startRank to $endRank on file $file',
    ({ file, startRank, endRank }) => {
      const startingBoard = { ...StartingBoard };
      const moves = WhitePawnMovesComposite(startingBoard);
      const startPosition = getBitBoardPosition(file, startRank);
      const endPosition = getBitBoardPosition(file, endRank);

      const moveFound = moves.some(
        (move) => move.from === startPosition && move.to === endPosition
      );

      expect(moveFound).toBeTruthy();
    }
  );

  it.each(captureTestCases)(
    'can return moves containing white pawn capturing from $startFile$startRank to $endFile$endRank when in duelling positions',
    ({ startFile, startRank, endFile, endRank }) => {
      const duellingBoard = { ...DuellingPawnsBoard };
      const allOccupiedPositions = allBlackPositions(duellingBoard);
      const moves = WhitePawnCaptures(duellingBoard, allOccupiedPositions);

      const startPosition = getBitBoardPosition(startFile, startRank);
      const endPosition = getBitBoardPosition(endFile, endRank);

      const moveFound = moves.some(
        (move) => move.from === startPosition && move.to === endPosition
      );

      expect(moveFound).toBeTruthy();
    }
  );

  it.each(captureTestCases)(
    "can't return moves containing white pawn capturing from $startFile$startRank to $endFile$endRank when no black pawn exists in target square",
    ({ startFile, startRank, endFile, endRank }) => {
      const duellingBoard = { ...DuellingPawnsBoard };
      const allOccupiedPositions = BigInt(0);
      const moves = WhitePawnCaptures(duellingBoard, allOccupiedPositions);

      const startPosition = getBitBoardPosition(startFile, startRank);
      const endPosition = getBitBoardPosition(endFile, endRank);

      const moveFound = moves.some(
        (move) => move.from === startPosition && move.to === endPosition
      );

      expect(moveFound).toBeFalsy();
    }
  );
});

describe('AllWhitePawnMovesComposite', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { file: 'a', startRank: 2, endRank: 3 },
    { file: 'b', startRank: 2, endRank: 3 },
    { file: 'c', startRank: 2, endRank: 3 },
    { file: 'd', startRank: 2, endRank: 3 },
    { file: 'e', startRank: 2, endRank: 3 },
    { file: 'f', startRank: 2, endRank: 3 },
    { file: 'g', startRank: 2, endRank: 3 },
    { file: 'h', startRank: 2, endRank: 3 },
    { file: 'a', startRank: 2, endRank: 4 },
    { file: 'b', startRank: 2, endRank: 4 },
    { file: 'c', startRank: 2, endRank: 4 },
    { file: 'd', startRank: 2, endRank: 4 },
    { file: 'e', startRank: 2, endRank: 4 },
    { file: 'f', startRank: 2, endRank: 4 },
    { file: 'g', startRank: 2, endRank: 4 },
    { file: 'h', startRank: 2, endRank: 4 },
  ];

  const captureTestCases = [
    { startFile: 'a', startRank: 4, endFile: 'b', endRank: 5 },
    { startFile: 'b', startRank: 4, endFile: 'c', endRank: 5 },
    { startFile: 'b', startRank: 4, endFile: 'a', endRank: 5 },
    { startFile: 'c', startRank: 4, endFile: 'd', endRank: 5 },
    { startFile: 'd', startRank: 4, endFile: 'c', endRank: 5 },
    { startFile: 'd', startRank: 4, endFile: 'e', endRank: 5 },
    { startFile: 'e', startRank: 4, endFile: 'f', endRank: 5 },
    { startFile: 'f', startRank: 4, endFile: 'g', endRank: 5 },
    { startFile: 'g', startRank: 4, endFile: 'h', endRank: 5 },
    { startFile: 'h', startRank: 4, endFile: 'g', endRank: 5 },
  ];

  it.each(captureTestCases)(
    'can return white pawn capturing from $startFile$startRank to $endFile$endRank when in duelling positions',
    ({ startFile, startRank, endFile, endRank }) => {
      const duellingBoard = { ...DuellingPawnsBoard };
      const boardWithCapturingWhitePawns = AllWhitePawnMovesComposite(duellingBoard);

      const startPosition = getBitBoardPosition(startFile, startRank);
      const endPosition = getBitBoardPosition(endFile, endRank);

      const foundStartPiece = occupiedBy(boardWithCapturingWhitePawns, startPosition);
      const foundEndPiece = occupiedBy(boardWithCapturingWhitePawns, endPosition);

      //LogBoardPositions(boardWithCapturingWhitePawns);

      expect(foundStartPiece).toBe(null);
      expect(foundEndPiece).toBe('whitePawn');
    }
  );

  it.each(testCases)(
    'can return white pawn moving from $file$startRank to $file$endRank',
    ({ file, startRank, endRank }) => {
      const startingBoard = { ...StartingBoard };
      const boardWithMovingWhitePawns = AllWhitePawnMovesComposite(startingBoard);

      const startPosition = getBitBoardPosition(file, startRank);
      const endPosition = getBitBoardPosition(file, endRank);

      const foundStartPiece = occupiedBy(boardWithMovingWhitePawns, startPosition);
      const foundEndPiece = occupiedBy(boardWithMovingWhitePawns, endPosition);

      //LogBoardPositions(boardWithMovingWhitePawns);

      expect(foundStartPiece).toBe(null);
      expect(foundEndPiece).toBe('whitePawn');
    }
  );
});

describe('AllBlackPawnMovesComposite', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { file: 'a', startRank: 7, endRank: 6 },
    { file: 'b', startRank: 7, endRank: 6 },
    { file: 'c', startRank: 7, endRank: 6 },
    { file: 'b', startRank: 7, endRank: 6 },
    { file: 'd', startRank: 7, endRank: 6 },
    { file: 'e', startRank: 7, endRank: 6 },
    { file: 'f', startRank: 7, endRank: 6 },
    { file: 'g', startRank: 7, endRank: 6 },
    { file: 'h', startRank: 7, endRank: 6 },
    { file: 'a', startRank: 7, endRank: 5 },
    { file: 'b', startRank: 7, endRank: 5 },
    { file: 'c', startRank: 7, endRank: 5 },
    { file: 'd', startRank: 7, endRank: 5 },
    { file: 'e', startRank: 7, endRank: 5 },
    { file: 'f', startRank: 7, endRank: 5 },
    { file: 'g', startRank: 7, endRank: 5 },
    { file: 'h', startRank: 7, endRank: 5 },
  ];

  const captureTestCases = [
    { startFile: 'a', startRank: 5, endFile: 'b', endRank: 4 },
    { startFile: 'b', startRank: 5, endFile: 'c', endRank: 4 },
    { startFile: 'b', startRank: 5, endFile: 'a', endRank: 4 },
    { startFile: 'c', startRank: 5, endFile: 'd', endRank: 4 },
    { startFile: 'd', startRank: 5, endFile: 'c', endRank: 4 },
    { startFile: 'd', startRank: 5, endFile: 'e', endRank: 4 },
    { startFile: 'e', startRank: 5, endFile: 'f', endRank: 4 },
    { startFile: 'f', startRank: 5, endFile: 'g', endRank: 4 },
    { startFile: 'g', startRank: 5, endFile: 'h', endRank: 4 },
    { startFile: 'h', startRank: 5, endFile: 'g', endRank: 4 },
  ];

  it.each(captureTestCases)(
    'can return black pawn capturing from $startFile$startRank to $endFile$endRank when in duelling positions',
    ({ startFile, startRank, endFile, endRank }) => {
      const duellingBoard = { ...DuellingPawnsBoard };
      const boardWithCapturingWhitePawns = AllBlackPawnMovesComposite(duellingBoard);

      const startPosition = getBitBoardPosition(startFile, startRank);
      const endPosition = getBitBoardPosition(endFile, endRank);

      const foundStartPiece = occupiedBy(boardWithCapturingWhitePawns, startPosition);
      const foundEndPiece = occupiedBy(boardWithCapturingWhitePawns, endPosition);

      //LogBoardPositions(boardWithCapturingWhitePawns);

      expect(foundStartPiece).toBe(null);
      expect(foundEndPiece).toBe('blackPawn');
    }
  );

  it.each(testCases)(
    'can return black pawn moving from $file$startRank to $file$endRank',
    ({ file, startRank, endRank }) => {
      const startingBoard = { ...StartingBoard };
      const boardWithMovingBlackPawns = AllBlackPawnMovesComposite(startingBoard);

      const startPosition = getBitBoardPosition(file, startRank);
      const endPosition = getBitBoardPosition(file, endRank);

      const foundStartPiece = occupiedBy(boardWithMovingBlackPawns, startPosition);
      const foundEndPiece = occupiedBy(boardWithMovingBlackPawns, endPosition);

      //LogBoardPositions(boardWithMovingBlackPawns);

      expect(foundStartPiece).toBe(null);
      expect(foundEndPiece).toBe('blackPawn');
    }
  );

  it('looks exactly like this for black pawns from a starting board', () => {
    const startingBoard = { ...StartingBoard };
    const boardWithMovingBlackPawns = AllBlackPawnMovesComposite(startingBoard);
    const boardString = bigIntToBinaryString(boardWithMovingBlackPawns.blackPawn);
    expect(boardString).toEqual('0000000000000000000000000000000011111111111111110000000000000000');
  });
});

describe('AllBlackPawnMovesOneSquare', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('looks exactly like this for black pawns from a starting board', () => {
    const startingBoard = { ...StartingBoard };
    const allOccupiedPositions = allPositions(startingBoard);
    const boardWithMovingBlackPawns = AllBlackPawnMovesOneSquare(
      startingBoard,
      allOccupiedPositions
    );
    const boardString = bigIntToBinaryString(boardWithMovingBlackPawns);
    expect(boardString).toEqual('0000000000000000000000000000000000000000111111110000000000000000');
  });
});

describe('AllBlackPawnMovesTwoSquare', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('looks exactly like this for black pawns from a starting board', () => {
    const startingBoard = { ...StartingBoard };
    const allOccupiedPositions = allPositions(startingBoard);
    const boardWithMovingBlackPawns = AllBlackPawnMovesTwoSquare(
      startingBoard,
      allOccupiedPositions
    );
    const boardString = bigIntToBinaryString(boardWithMovingBlackPawns);
    expect(boardString).toEqual('0000000000000000000000000000000011111111000000000000000000000000');
  });

  it("black can't move 2 squares into an occupied position", () => {
    const startingBoard = { ...StartingBoard };
    const firstMove = applyMove(startingBoard, 10, 26, 'whitePawn');
    const secondMove = applyMove(firstMove, 53, 37, 'blackPawn');
    const thirdMove = applyMove(secondMove, 26, 34, 'whitePawn');

    const allOccupiedPositions = allPositions(thirdMove);
    const boardWithMovingBlackPawns = AllBlackPawnMovesTwoSquare(thirdMove, allOccupiedPositions);
    const boardString = bigIntToBinaryString(boardWithMovingBlackPawns);

    expect(boardString).toEqual('0000000000000000000000000000000010110111000000000000000000000000');
  });

  it('looks exactly like this for black pawns after white d4 opening', () => {
    const startingBoard = { ...StartingBoard };
    const newBoard = applyMove(startingBoard, 12, 28, 'whitePawn');
    const allOccupiedPositions = allPositions(newBoard);
    const boardWithMovingBlackPawns = AllBlackPawnMovesTwoSquare(newBoard, allOccupiedPositions);
    const boardString = bigIntToBinaryString(boardWithMovingBlackPawns);
    expect(boardString).toEqual('0000000000000000000000000000000011111111000000000000000000000000');
  });
});

describe('AllKnightMoves', () => {
  it('finds 4 moves from a starting position for white', () => {
    const startingBoard = { ...StartingBoard };
    const friendlyPositions = allWhitePositions(startingBoard);
    const allKnightMoves = AllKnightMoves(startingBoard, friendlyPositions, true);
    expect(bitCount(allKnightMoves)).toBe(4);
  });
  it('after Nd3 finds 7 possible moves for white', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'whiteKnight', 1, 'b', 3, 'c');
    const friendlyPositions = allWhitePositions(newPositions.BoardState);
    const allKnightMoves = AllKnightMoves(newPositions.BoardState, friendlyPositions, true);
    // outputSingleBitboardHtml(
    //   newPositions.BoardState,
    //   null,
    //   "after Nd3 finds 7 possible moves for white"
    // );
    // outputSinglePiecePositions(
    //   allKnightMoves,
    //   "whiteKnight",
    //   "after Nd3 finds 7 possible moves for white"
    // );
    // outputSinglePiecePositions(
    //   friendlyPositions,
    //   "whitePawn",
    //   "friendly positions"
    // );

    expect(bitCount(allKnightMoves)).toBe(7);
  });
});

describe('AllBishopMoves', () => {
  it('returns all legal white queen moves after moving d and e pawns', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'whitePawn', 2, 'e', 4, 'e');

    const friendlyPositions = allWhitePositions(newPositions.BoardState);
    const enemyPositions = allBlackPositions(newPositions.BoardState);

    const allBishopMoves = AllBishopMoves(
      newPositions.BoardState,
      friendlyPositions,
      enemyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allBishopMoves,
        'whiteBishop',
        'returns all legal white bishop moves after moving e pawn'
      );
    }

    expect(bitCount(allBishopMoves)).toBe(5);

    const secondPositions = movePiece(newPositions.BoardState, 'whitePawn', 2, 'd', 4, 'd');
    const secondFriendlyPositions = allWhitePositions(secondPositions.BoardState);
    const secondBishopPositions = AllBishopMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      enemyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondBishopPositions,
        'whiteBishop',
        'returns all legal white bishop moves after moving d and e pawns'
      );
    }
    expect(bitCount(secondBishopPositions)).toBe(10);
  });

  it('returns all legal black bishop moves after moving d and e pawns', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'e', 5, 'e');

    const friendlyPositions = allBlackPositions(newPositions.BoardState);
    const enemyPositions = allWhitePositions(newPositions.BoardState);

    const allBishopMoves = AllBishopMoves(
      newPositions.BoardState,
      friendlyPositions,
      enemyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allBishopMoves,
        'blackBishop',
        'returns all legal black bishop moves after moving e pawn'
      );
    }

    expect(bitCount(allBishopMoves)).toBe(5);

    const secondPositions = movePiece(newPositions.BoardState, 'blackPawn', 7, 'd', 5, 'd');
    const secondFriendlyPositions = allBlackPositions(secondPositions.BoardState);
    const secondBishopPositions = AllBishopMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      enemyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondBishopPositions,
        'blackBishop',
        'returns all legal white bishop moves after moving d and e pawns'
      );
    }
    expect(bitCount(secondBishopPositions)).toBe(10);
  });
});

describe('AllRookMoves', () => {
  it('returns all legal white rook moves after moving a pawn and a rook', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'whitePawn', 2, 'a', 4, 'a');

    const friendlyPositions = allWhitePositions(newPositions.BoardState);
    const enemyPositions = allBlackPositions(newPositions.BoardState);

    const allRookMoves = AllRookMoves(
      newPositions.BoardState,
      friendlyPositions,
      enemyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allRookMoves,
        'whiteRook',
        'returns all legal white rook moves after moving e pawn'
      );
    }

    expect(bitCount(allRookMoves)).toBe(2);

    const secondPositions = movePiece(newPositions.BoardState, 'whiteRook', 1, 'a', 3, 'a');
    const secondFriendlyPositions = allWhitePositions(secondPositions.BoardState);
    const secondRookPositions = AllRookMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      enemyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondRookPositions,
        'whiteRook',
        'returns all legal white rook moves after moving rook a3'
      );
    }
    expect(bitCount(secondRookPositions)).toBe(9);
  });

  it('returns all legal black rook moves after moving a pawn and a rook', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'a', 5, 'a');

    const friendlyPositions = allBlackPositions(newPositions.BoardState);
    const enemyPositions = allWhitePositions(newPositions.BoardState);

    const allRookMoves = AllRookMoves(
      newPositions.BoardState,
      friendlyPositions,
      enemyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allRookMoves,
        'blackRook',
        'returns all legal black rook moves after moving a pawn'
      );
    }

    expect(bitCount(allRookMoves)).toBe(2);

    const secondPositions = movePiece(newPositions.BoardState, 'blackRook', 8, 'a', 6, 'a');
    const secondFriendlyPositions = allBlackPositions(secondPositions.BoardState);
    const secondRookPositions = AllRookMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      enemyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSingleBitboardHtml(secondPositions.BoardState, null, 'after moving a pawn and a rook');
    }
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondRookPositions,
        'blackRook',
        'returns all legal black rook moves after moving a rook'
      );
    }
    expect(bitCount(secondRookPositions)).toBe(9);
  });
});

describe('AllKingMoves', () => {
  it('returns all legal white king moves after a bong cloud opening', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'whitePawn', 2, 'e', 4, 'e');
    const friendlyPositions = allWhitePositions(newPositions.BoardState);

    const allKingMoves = AllKingMoves(newPositions.BoardState, friendlyPositions, true);
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allKingMoves,
        'whiteKing',
        'returns all legal white king moves after moving e pawn'
      );
    }

    expect(bitCount(allKingMoves)).toBe(1);

    const secondPositions = movePiece(newPositions.BoardState, 'whiteKing', 1, 'e', 2, 'e');
    const secondFriendlyPositions = allWhitePositions(secondPositions.BoardState);
    const secondKingPositions = AllKingMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondKingPositions,
        'whiteKing',
        'returns all legal white king moves after moving king e2'
      );
    }
    expect(bitCount(secondKingPositions)).toBe(4);
  });

  it('returns all legal black king moves after moving a pawn and a king', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'e', 5, 'e');
    const friendlyPositions = allBlackPositions(newPositions.BoardState);

    const allKingMoves = AllKingMoves(newPositions.BoardState, friendlyPositions, false);
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allKingMoves,
        'blackKing',
        'returns all legal black king moves after moving a pawn'
      );
    }

    expect(bitCount(allKingMoves)).toBe(1);

    const secondPositions = movePiece(newPositions.BoardState, 'blackKing', 8, 'e', 7, 'e');
    const secondFriendlyPositions = allBlackPositions(secondPositions.BoardState);
    const secondKingPositions = AllKingMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSingleBitboardHtml(secondPositions.BoardState, null, 'after moving a pawn and a king');
    }
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondKingPositions,
        'blackKing',
        'returns all legal black king moves after moving a king'
      );
    }
    expect(bitCount(secondKingPositions)).toBe(4);
  });
});

describe('AllQueenMoves', () => {
  it('returns all legal white queen moves after moving d pawn and queen', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'whitePawn', 2, 'd', 4, 'd');

    const friendlyPositions = allWhitePositions(newPositions.BoardState);
    const enemyPositions = allBlackPositions(newPositions.BoardState);

    const allQueenMoves = AllQueenMoves(
      newPositions.BoardState,
      friendlyPositions,
      enemyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allQueenMoves,
        'whiteQueen',
        'returns all legal white queen moves after moving d pawn'
      );
    }

    expect(bitCount(allQueenMoves)).toBe(2);

    const secondPositions = movePiece(newPositions.BoardState, 'whiteQueen', 1, 'd', 3, 'd');
    const secondFriendlyPositions = allWhitePositions(secondPositions.BoardState);
    const secondQueenPositions = AllQueenMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      enemyPositions,
      true
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondQueenPositions,
        'whiteQueen',
        'returns all legal white queen moves after moving d pawn and queen'
      );
    }
    expect(bitCount(secondQueenPositions)).toBe(16);
  });

  it('returns all legal black queen moves after moving d pawn and queen', () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, 'blackPawn', 7, 'd', 5, 'd');

    const friendlyPositions = allBlackPositions(newPositions.BoardState);
    const enemyPositions = allWhitePositions(newPositions.BoardState);

    const allQueenMoves = AllQueenMoves(
      newPositions.BoardState,
      friendlyPositions,
      enemyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        allQueenMoves,
        'blackQueen',
        'returns all legal black queen moves after moving d pawn'
      );
    }

    expect(bitCount(allQueenMoves)).toBe(2);

    const secondPositions = movePiece(newPositions.BoardState, 'blackQueen', 8, 'd', 6, 'd');
    const secondFriendlyPositions = allBlackPositions(secondPositions.BoardState);
    const secondQueenPositions = AllQueenMoves(
      secondPositions.BoardState,
      secondFriendlyPositions,
      enemyPositions,
      false
    );
    if (LoggerConfig.enableEvaluationLogs) {
      outputSinglePiecePositions(
        secondQueenPositions,
        'blackQueen',
        'returns all legal white queen moves after moving d pawn and queen'
      );
    }
    expect(bitCount(secondQueenPositions)).toBe(16);
  });
});
