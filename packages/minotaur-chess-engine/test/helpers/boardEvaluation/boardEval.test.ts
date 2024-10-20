/**
 * @jest-environment node
 */

import {
  StartingBoard,
  evaluateBoard,
  EmptyBoard,
  applyMove,
  pieceValues,
  EvalWeightings,
  BlackAdvantageBoard,
  MiddleGameBoard,
  evaluateMaterialAdvantages,
  evaluatePromotionalPossibilities,
  movePiece,
  evaluateCentralDominanceAdvantages,
  evaluatePawnChains,
  whitePawnChain_Pyramid,
  whitePawnChain_ThreeIslands,
  whitePawnChain_NoChains,
  blackPawnChain_Pyramid,
  blackPawnChain_ThreeIslands,
  blackPawnChain_NoChains,
  evaluatePieceDevelopment,
  evaluateFreedomToMove,
  BlackLongCastledGameBoard,
  evaluateKingSafety,
  BlackShortCastledGameBoard,
} from '@karmacarrot/minotaur-chess-engine';

describe('evaluateBoard', () => {
  it.each([[StartingBoard, 0]])(
    'correctly estimates position strength',
    (boardState, expectedScore) => {
      expect(evaluateBoard(boardState, true)).toEqual(expectedScore);
    }
  );
  it('correctly estimates an increase of score when opening into the centre', () => {
    const startingBoard = { ...EmptyBoard };
    const newBoard = applyMove(startingBoard, 12, 28, 'whitePawn');
    const scoreNewBoard = evaluateBoard(newBoard, true);
    const scoreStartBoard = evaluateBoard(startingBoard, true);
    expect(scoreStartBoard).toBe(0);
    expect(scoreNewBoard).toBe(pieceValues.pawn + EvalWeightings.absoluteCentreWeight);
  });
  it('correctly estimates an score after 2 moves', () => {
    const startingBoard = { ...StartingBoard };
    const moveOneBoard = applyMove(startingBoard, 12, 28, 'whitePawn');
    const moveTwoBoard = applyMove(moveOneBoard, 55, 47, 'blackPawn');
    const scoreMoveOneBoard = evaluateBoard(moveOneBoard, true);
    const scoreMoveTwoBoard = evaluateBoard(moveTwoBoard, true);
    const scoreStartBoard = evaluateBoard(startingBoard, true);
    expect(scoreStartBoard).toBe(0);
    expect(scoreMoveOneBoard).toBe(EvalWeightings.absoluteCentreWeight);

    const blackScore = 2 * EvalWeightings.pawnChainWeight;
    const whiteScore = EvalWeightings.absoluteCentreWeight;
    expect(scoreMoveTwoBoard).toBe(whiteScore - blackScore);
  });
});

describe('evaluateMaterialAdvantages', () => {
  const startingBoard = { ...StartingBoard };
  const blackAdvantageBoard = { ...BlackAdvantageBoard };
  const middleGameBoard = { ...MiddleGameBoard };

  const pawnTestCases = [
    { whitePawn: BigInt(0), expected: -8 }, // No pawns
    { whitePawn: BigInt(1), expected: -7 }, // 1 white pawn
    { whitePawn: BigInt(2), expected: -7 }, // 1 white pawn, different position
    { whitePawn: BigInt(3), expected: -6 }, // 2 white pawns
    { whitePawn: BigInt('0b101'), expected: -6 }, // 2 white pawns, non-adjacent
    { whitePawn: BigInt('0b1111'), expected: -4 }, // 4 white pawns
  ];

  it.each(pawnTestCases)(
    'should return $expected when the board has $whitePawn',
    ({ whitePawn, expected }) => {
      let boardState = StartingBoard;
      boardState.whitePawn = whitePawn;
      const score = evaluateMaterialAdvantages(boardState, true);
      expect(score).toBe(expected);
    }
  );

  it('should return 0 for an equal board', () => {
    expect(evaluateMaterialAdvantages(startingBoard, true)).toBe(0);
    expect(evaluateMaterialAdvantages(startingBoard, false)).toBe(0);
  });

  it('should return a positive score for white on a white-advantaged board', () => {
    const whiteScore = evaluateMaterialAdvantages(middleGameBoard, true);
    const blackScore = evaluateMaterialAdvantages(middleGameBoard, false);

    expect(blackScore).toBe(-1);
    expect(whiteScore).toBe(1);
  });

  it('should return a negative score for white on a black-advantaged board', () => {
    const whiteScore = evaluateMaterialAdvantages(blackAdvantageBoard, true);
    const blackScore = evaluateMaterialAdvantages(blackAdvantageBoard, false);

    expect(whiteScore).toBe(-2);
    expect(blackScore).toBe(2);
  });
});

describe('evaluatePromotionalPossibilities', () => {
  it('increases the score for white when moving a white pawn to the 7th rank', () => {
    const startBoard = { ...StartingBoard };
    const newPositions = applyMove(startBoard, 16, 56, 'whitePawn');

    const beforeScore = evaluatePromotionalPossibilities(startBoard.whitePawn, true);
    const afterScore = evaluatePromotionalPossibilities(newPositions.whitePawn, true);

    expect(beforeScore).toBeLessThan(afterScore);
  });
  it('increases the score for black when moving a black pawn to the 2nd rank', () => {
    const startBoard = { ...StartingBoard };
    const newPositions = applyMove(startBoard, 56, 16, 'blackPawn');

    const beforeScore = evaluatePromotionalPossibilities(startBoard.blackPawn, false);
    const afterScore = evaluatePromotionalPossibilities(newPositions.blackPawn, false);

    expect(beforeScore).toBeLessThan(afterScore);
  });
});

describe('evaluateCentralDominanceAdvantages', () => {
  it('should favour central control for white', () => {
    const startBoard = { ...StartingBoard };
    const newPositions = movePiece(startBoard, 'whitePawn', 2, 'e', 4, 'e');

    const beforeScore = evaluateCentralDominanceAdvantages(startBoard.whitePawn, true, 'whitePawn');
    const afterScore = evaluateCentralDominanceAdvantages(
      newPositions.BoardState.whitePawn,
      true,
      'whitePawn'
    );

    expect(beforeScore).toBe(0);
    expect(afterScore).toBe(EvalWeightings.absoluteCentreWeight);
  });
});

describe('evaluatePawnChains', () => {
  const scoreWhitePyramid = evaluatePawnChains(whitePawnChain_Pyramid, true);
  const scoreWhiteIslands = evaluatePawnChains(whitePawnChain_ThreeIslands, true);
  const scorewhiteNoChains = evaluatePawnChains(whitePawnChain_NoChains, true);
  const scoreWhiteStartingPositions = evaluatePawnChains(StartingBoard.whitePawn, true);

  const scoreBlackPyramid = evaluatePawnChains(blackPawnChain_Pyramid, false);
  const scoreBlackIslands = evaluatePawnChains(blackPawnChain_ThreeIslands, false);
  const scoreBlackNoChains = evaluatePawnChains(blackPawnChain_NoChains, false);
  const scoreBlackStartingPositions = evaluatePawnChains(StartingBoard.blackPawn, false);

  it('highly scores a white pawn pyramid', () => {
    expect(scoreWhitePyramid).toBeGreaterThan(scoreWhiteStartingPositions);
    expect(scoreWhitePyramid).toBeGreaterThan(scoreWhiteIslands);
    expect(scoreWhitePyramid).toBeGreaterThan(scorewhiteNoChains);
  });
  it('highly scores a black pawn pyramid', () => {
    expect(scoreBlackPyramid).toBeGreaterThan(scoreBlackStartingPositions);
    expect(scoreBlackPyramid).toBeGreaterThan(scoreBlackIslands);
    expect(scoreBlackPyramid).toBeGreaterThan(scoreBlackNoChains);
  });
  it('scores 3 islands better than no chains', () => {
    expect(scoreWhiteIslands).toBeGreaterThan(scoreBlackNoChains);
    expect(scoreBlackIslands).toBeGreaterThan(scoreBlackNoChains);
  });

  it('equally scores a pawn pyramid from either colour', () => {
    expect(scoreWhitePyramid).toEqual(scoreBlackPyramid);
  });
  it('scores 0 for no chains', () => {
    const totalNoChainScores =
      scoreBlackNoChains +
      scorewhiteNoChains +
      scoreWhiteStartingPositions +
      scoreBlackStartingPositions;
    expect(totalNoChainScores).toEqual(0);
  });
});

describe('evaluatePieceDevelopment', () => {
  it('correctly scores knight development for white', () => {
    const startBoard = StartingBoard;
    const startingScore = evaluatePieceDevelopment(startBoard, true);
    expect(startingScore).toBe(0);

    const newPositions = movePiece(startBoard, 'whiteKnight', 2, 'b', 3, 'd');
    const movedKnightScore = evaluatePieceDevelopment(newPositions.BoardState, true);
    expect(movedKnightScore).toBe(EvalWeightings.developedBishopKnight);
  });
});

describe('evaluateFreedomToMove', () => {
  it('correctly scores knight development for white', () => {
    const startBoard = StartingBoard;
    const startingScore = evaluateFreedomToMove(startBoard, true);
    // expect(startingScore).toBe(4 * EvalWeightings.freedomToMove);

    const newPositions = movePiece(startBoard, 'whiteKnight', 2, 'b', 3, 'd');
    const movedKnightScore = evaluatePieceDevelopment(newPositions.BoardState, true);
    expect(movedKnightScore).toBe(7 * EvalWeightings.freedomToMove);
  });
});

describe('evaluateKingSafety', () => {
  it('scores a safe black long castled king correctly', () => {
    const board = BlackLongCastledGameBoard;
    const safeKingScore = evaluateKingSafety(board, false);
    expect(safeKingScore).toBe(EvalWeightings.safeKing);
  });
  it('scores a safe black short castled king correctly', () => {
    const board = BlackShortCastledGameBoard;
    const safeKingScore = evaluateKingSafety(board, false);
    expect(safeKingScore).toBe(EvalWeightings.safeKing);
  });
  // it("scores a safe white long castled king correctly", () => {
  //   const board = WhiteLongCastledGameBoard;
  //   const safeKingScore = evaluateKingSafety(board, true);
  //   expect(safeKingScore).toBe(EvalWeightings.safeKing);
  // });
  // it("scores a safe white short castled king correctly", () => {
  //   const board = WhiteShortCastledGameBoard;
  //   const safeKingScore = evaluateKingSafety(board, true);
  //   expect(safeKingScore).toBe(EvalWeightings.safeKing);
  // });
});
