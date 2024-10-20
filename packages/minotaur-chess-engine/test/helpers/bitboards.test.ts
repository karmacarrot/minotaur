import { BoardArray } from '../../src/src/board';
import {
  CastleForBlackAfterGameBoard,
  CastleForBlackGameBoard,
  DuellingPawnsBoard,
  EndGameBoard,
} from '../../src/src/referee/mockBoardStates';
import {
  allBlackPositions,
  allPositions,
  allWhitePositions,
  applyMove,
  bigIntToBinaryString,
  binaryMask64,
  bitCount,
  clearPosition,
  findBitPosition,
  findBitPositionReverse,
  findBitPositions,
  getBeforeAndAfterPositions,
  getBitBoardPosition,
  getCastledMoveFromBoardStates,
  getFileAndRank,
  getMoveFromBoardStates,
  getSinglePieceMoveFromBoardStates,
  isABCtoFGHwraparound,
  isAtoHwraparound,
  isLongCastleRouteBlocked,
  isOccupied,
  isShortCastleRouteBlocked,
  occupiedBy,
} from '../../src/src/helpers/bitboards';
import { StartingBoard, a1, h8 } from '../../src/src/helpers/definitions';

describe('applyMove', () => {
  it('correctly moves a white pawn when capturing and removes the captured black pawn', () => {
    const duelBoard = { ...DuellingPawnsBoard };
    const movedPawn = applyMove(duelBoard, 25, 34, 'whitePawn');
    const whitePawnString = bigIntToBinaryString(movedPawn.whitePawn);
    const blackPawnString = bigIntToBinaryString(movedPawn.blackPawn);
    expect(whitePawnString).toEqual(
      '0000000000000000000000000111111101000000000000000000000000000000'
    );
    expect(blackPawnString).toEqual(
      '0000000000000000000000000000000010111111000000000000000000000000'
    );
  });
});

describe('getBitBoardPosition', () => {
  type TestCase = [string, string, number, number];
  const testCases: TestCase[] = [
    ['position of 1 from A1', 'a', 1, 1],
    ['position of 9 from A2', 'a', 2, 9],
    ['position of 64 from H8', 'h', 8, 64],
  ];

  it.each(testCases)('gives you the %s', (description, file, rank, expectedPosition) => {
    const position = getBitBoardPosition(file, rank);

    expect(position).toBe(expectedPosition);
  });
});

describe('clearPosition', () => {
  const startingBoard = StartingBoard;
  it('clears A2 pawn from a default starting board', () => {
    const position = getBitBoardPosition('a', 2);
    const mutatedBoard = clearPosition(startingBoard, position);
    const initialBoardArray = BoardArray(mutatedBoard);

    expect(initialBoardArray[1].toString()).toBe(
      'whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,'
    );
  });
});

describe('binaryMask64', () => {
  it('can generate a binary mask with 1 at the position passed, zeroes everywhere else', () => {
    const newMask = binaryMask64(5, 'all_zeroes_with_position_as_one');
    const maskString = bigIntToBinaryString(newMask);
    expect(maskString).toBe('0000100000000000000000000000000000000000000000000000000000000000');
  });
  it('can generate a binary mask with 0 at the position passed, ones everywhere else', () => {
    const newMask = binaryMask64(6, 'all_ones_with_position_as_zero');
    const maskString = bigIntToBinaryString(newMask);
    expect(maskString).toBe('1111101111111111111111111111111111111111111111111111111111111111');
  });
  it('can generate a binary mask with 0 at A2, ones everywhere else', () => {
    const newMask = binaryMask64(9, 'all_ones_with_position_as_zero');
    const maskString = bigIntToBinaryString(newMask);
    expect(maskString).toBe('1111111101111111111111111111111111111111111111111111111111111111');
  });
});

describe('occupiedBy', () => {
  const startingBoard = StartingBoard;
  it('can return a white pawn in the queried position', () => {
    const position = getBitBoardPosition('a', 2);
    const foundPiece = occupiedBy(startingBoard, position);

    expect(foundPiece).toBe('whitePawn');
  });
  it('can return a white rook in the queried position', () => {
    const position = getBitBoardPosition('a', 1);
    const foundPiece = occupiedBy(startingBoard, position);

    expect(foundPiece).toBe('whiteRook');
  });
  it('can return a black pawn in the queried position', () => {
    const position = getBitBoardPosition('a', 7);
    const foundPiece = occupiedBy(startingBoard, position);

    expect(foundPiece).toBe('blackPawn');
  });
  it('can return a black rook in the queried position', () => {
    const position = getBitBoardPosition('a', 8);
    const foundPiece = occupiedBy(startingBoard, position);

    expect(foundPiece).toBe('blackRook');
  });
  it('can return null in the queried position', () => {
    const position = getBitBoardPosition('a', 4);
    const foundPiece = occupiedBy(startingBoard, position);

    expect(foundPiece).toBe(null);
  });
});

describe('isOccupied', () => {
  const startingBoard = StartingBoard;
  it('can return true in the queried pawn position', () => {
    const position = getBitBoardPosition('a', 2);
    const occupied = isOccupied(startingBoard, position);

    expect(occupied).toBe(true);
  });
  it('can return true in the queried white king position', () => {
    const position = getBitBoardPosition('e', 1);
    const occupied = isOccupied(startingBoard, position);

    expect(occupied).toBe(true);
  });
  it('can return true in the queried black queen position', () => {
    const position = getBitBoardPosition('d', 8);
    const occupied = isOccupied(startingBoard, position);

    expect(occupied).toBe(true);
  });
  it('can return false in the queried position', () => {
    const position = getBitBoardPosition('a', 3);
    const occupied = isOccupied(startingBoard, position);

    expect(occupied).toBe(false);
  });
  it('can return false in the queried centre position', () => {
    const position = getBitBoardPosition('e', 5);
    const occupied = isOccupied(startingBoard, position);

    expect(occupied).toBe(false);
  });
});

describe('allPositions', () => {
  const startingBoard = StartingBoard;
  it('can return all positions merged', () => {
    const mergedPositions = allPositions(startingBoard);
    const mergedString = bigIntToBinaryString(mergedPositions);
    expect(mergedString).toBe('1111111111111111000000000000000000000000000000001111111111111111');
  });
  it('can return all positions merged after white d4', () => {
    const newBoard = applyMove(startingBoard, 12, 28, 'whitePawn');
    const mergedPositions = allPositions(newBoard);
    const mergedString = bigIntToBinaryString(mergedPositions);
    expect(mergedString).toBe('1111111111101111000000000001000000000000000000001111111111111111');
  });
});

describe('allWhitePositions', () => {
  const startingBoard = StartingBoard;
  it('can return all white positions merged', () => {
    const mergedPositions = allWhitePositions(startingBoard);
    const mergedString = bigIntToBinaryString(mergedPositions);
    expect(mergedString).toBe('1111111111111111000000000000000000000000000000000000000000000000');
  });
  it('can return all white positions merged after white d4', () => {
    const newBoard = applyMove(startingBoard, 12, 28, 'whitePawn');
    const mergedPositions = allWhitePositions(newBoard);
    const mergedString = bigIntToBinaryString(mergedPositions);
    expect(mergedString).toBe('1111111111101111000000000001000000000000000000000000000000000000');
  });
});

describe('allBlackPositions', () => {
  const startingBoard = StartingBoard;
  it('can return all white positions merged', () => {
    const mergedPositions = allBlackPositions(startingBoard);
    const mergedString = bigIntToBinaryString(mergedPositions);
    expect(mergedString).toBe('0000000000000000000000000000000000000000000000001111111111111111');
  });
});

describe('bitCount function with BigInt', () => {
  it.each([
    [BigInt('0'), 0], // No bits set
    [BigInt('1'), 1], // One bit set
    [BigInt('10'), 2], // Two bits set (in binary)
    [BigInt('15'), 4], // Four bits set (15 in decimal is 1111 in binary)
    [BigInt('18446744073709551615'), 64], // All bits set (64-bit integer)
    [BigInt('1311768467294899695'), 32], // Random number, 32 bits set
    [BigInt('12297829382473034410'), 32], // Alternating bits, 32 bits set
    [BigInt('4294967295'), 32], // 32 bits set, smaller than 64-bit max
  ])('correctly counts bits for %s', (input, expected) => {
    expect(bitCount(input)).toEqual(expected);
  });
});

describe('getFileAndRank', () => {
  it.each([[1, 'a', 1]])(
    'correctly returns the file and rank',
    (input, expectedFile, expectedRank) => {
      const fileAndRank = getFileAndRank(input);
      expect(fileAndRank).toEqual({ rank: expectedRank, file: expectedFile });
    }
  );
});

describe('getMoveFromBoardStates', () => {
  it('can work out that a pawn moved from a starting position', () => {
    const startBoard = { ...StartingBoard };
    const movedPawn = applyMove(startBoard, 16, 24, 'whitePawn');
    const bitMoveFromBoardStates = getMoveFromBoardStates(startBoard, movedPawn);
    expect(bitMoveFromBoardStates).toEqual({
      evaluations: 0,
      from: 16,
      to: 24,
      piece: 'whitePawn',
      pieceTaken: 'none',
      score: 0,
      castleRookFrom: 0,
      castleRookTo: 0,
    });
  });
  it('can work out that a black pawn was taken', () => {
    const duelBoard = { ...DuellingPawnsBoard };
    const movedPawn = applyMove(duelBoard, 25, 34, 'whitePawn');
    const bitMoveFromBoardStates = getMoveFromBoardStates(duelBoard, movedPawn);
    expect(bitMoveFromBoardStates).toEqual({
      evaluations: 0,
      from: 25,
      to: 34,
      piece: 'whitePawn',
      pieceTaken: 'blackPawn',
      score: 0,
      castleRookFrom: 0,
      castleRookTo: 0,
    });
  });
  it('can work out that a white pawn was taken', () => {
    const duelBoard = { ...DuellingPawnsBoard };
    const movedPawn = applyMove(duelBoard, 38, 29, 'blackPawn');
    const bitMoveFromBoardStates = getMoveFromBoardStates(duelBoard, movedPawn);
    expect(bitMoveFromBoardStates).toEqual({
      evaluations: 0,
      from: 38,
      to: 29,
      piece: 'blackPawn',
      pieceTaken: 'whitePawn',
      score: 0,
      castleRookFrom: 0,
      castleRookTo: 0,
    });
  });
});

describe('getSinglePieceMoveFromBoardStates', () => {
  it('can work out that a pawn moved from a starting position', () => {
    const startBoard = { ...StartingBoard };
    const movedPawn = applyMove(startBoard, 16, 24, 'whitePawn');
    const bitMoveFromBoardStates = getSinglePieceMoveFromBoardStates(startBoard, movedPawn);
    expect(bitMoveFromBoardStates).toEqual({
      evaluations: 0,
      from: 16,
      to: 24,
      piece: 'whitePawn',
      pieceTaken: 'none',
      score: 0,
      castleRookFrom: 0,
      castleRookTo: 0,
    });
  });
  it('can work out that a black pawn was taken', () => {
    const duelBoard = { ...DuellingPawnsBoard };
    const movedPawn = applyMove(duelBoard, 25, 34, 'whitePawn');
    const bitMoveFromBoardStates = getSinglePieceMoveFromBoardStates(duelBoard, movedPawn);
    expect(bitMoveFromBoardStates).toEqual({
      evaluations: 0,
      from: 25,
      to: 34,
      piece: 'whitePawn',
      pieceTaken: 'blackPawn',
      score: 0,
      castleRookFrom: 0,
      castleRookTo: 0,
    });
  });
  it('can work out that a white pawn was taken', () => {
    const duelBoard = { ...DuellingPawnsBoard };
    const movedPawn = applyMove(duelBoard, 38, 29, 'blackPawn');
    const bitMoveFromBoardStates = getSinglePieceMoveFromBoardStates(duelBoard, movedPawn);
    expect(bitMoveFromBoardStates).toEqual({
      evaluations: 0,
      from: 38,
      to: 29,
      piece: 'blackPawn',
      pieceTaken: 'whitePawn',
      score: 0,
      castleRookFrom: 0,
      castleRookTo: 0,
    });
  });
});

describe('findBitPositionReverse', () => {
  it.each`
    bitboard                   | expected
    ${BigInt(1) << BigInt(63)} | ${1}
    ${BigInt(1) << BigInt(0)}  | ${64}
    ${BigInt(0)}               | ${64}
    ${BigInt(1) << BigInt(32)} | ${32}
    ${BigInt(1) << BigInt(31)} | ${33}
    ${BigInt(1) << BigInt(62)} | ${2}
    ${a1}                      | ${1}
    ${h8}                      | ${64}
  `('returns $expected when bitboard is $bitboard', ({ bitboard, expected }) => {
    expect(findBitPositionReverse(bitboard)).toBe(expected);
  });
});

describe('findBitPositions', () => {
  it('returns the correct list of positions for a bitboard', () => {
    const positionArray = findBitPositions(StartingBoard.whitePawn);
    expect(positionArray).toStrictEqual([9, 10, 11, 12, 13, 14, 15, 16]);
  });
});

describe('isAtoHwraparound', () => {
  it('returns true if going to h from a or to a from h', () => {
    let result = isAtoHwraparound(1, 8);
    expect(result).toBe(true);
    result = isAtoHwraparound(8, 1);
    expect(result).toBe(true);
  });
  it('returns false if not going to h from a and not going to a from h', () => {
    let result = isAtoHwraparound(1, 8);
    result = isAtoHwraparound(2, 1);
    expect(result).toBe(false);
    result = isAtoHwraparound(8, 6);
    expect(result).toBe(false);
    result = isAtoHwraparound(5, 1);
    expect(result).toBe(false);
  });
});

describe('isABCtoFGHwraparound', () => {
  it('returns true if going to h from a or to a from h', () => {
    let result = isAtoHwraparound(1, 8);
    expect(result).toBe(true);
    result = isAtoHwraparound(8, 1);
    expect(result).toBe(true);
  });
  it('returns false if not going to h from a and not going to a from h', () => {
    let result = isAtoHwraparound(1, 8);
    result = isAtoHwraparound(2, 1);
    expect(result).toBe(false);
    result = isAtoHwraparound(8, 6);
    expect(result).toBe(false);
    result = isAtoHwraparound(5, 1);
    expect(result).toBe(false);
  });
});

describe('isABCtoFGHwraparound', () => {
  it.each([
    { fromPosition: 64, toPosition: 57, expected: true },
    { fromPosition: 50, toPosition: 47, expected: true },
    { fromPosition: 7, toPosition: 17, expected: true },
    { fromPosition: 1, toPosition: 6, expected: true },
    { fromPosition: 2, toPosition: 7, expected: true },
    { fromPosition: 3, toPosition: 8, expected: true },
    { fromPosition: 4, toPosition: 5, expected: false },
    { fromPosition: 3, toPosition: 5, expected: false },
    { fromPosition: 5, toPosition: 3, expected: false },
    { fromPosition: 9, toPosition: 10, expected: false },
  ])(
    'should return $expected when fromPosition is $fromPosition and toPosition is $toPosition',
    ({ fromPosition, toPosition, expected }) => {
      const result = isABCtoFGHwraparound(fromPosition, toPosition);
      expect(result).toBe(expected);
    }
  );
});

describe('isShortCastleRouteBlocked', () => {
  it('should return true when the short castle path is blocked for the white and black king', () => {
    const board = StartingBoard;
    const isShortCastleBlockedForWhite = isShortCastleRouteBlocked(board, true);
    const isShortCastleBlockedForBlack = isShortCastleRouteBlocked(board, false);

    expect(isShortCastleBlockedForBlack).toBe(true);
    expect(isShortCastleBlockedForWhite).toBe(true);
  });
  it('should return false when the short castle path is clear for the white and black king', () => {
    const board = EndGameBoard;
    const isShortCastleBlockedForWhite = isShortCastleRouteBlocked(board, true);
    const isShortCastleBlockedForBlack = isShortCastleRouteBlocked(board, false);

    expect(isShortCastleBlockedForBlack).toBe(false);
    expect(isShortCastleBlockedForWhite).toBe(false);
  });
});

describe('isLongCastleRouteBlocked', () => {
  it('should return true when the long castle path is blocked for the white and black king', () => {
    const board = StartingBoard;
    const isLongCastleBlockedForWhite = isLongCastleRouteBlocked(board, true);
    const isLongCastleBlockedForBlack = isLongCastleRouteBlocked(board, false);

    expect(isLongCastleBlockedForBlack).toBe(true);
    expect(isLongCastleBlockedForWhite).toBe(true);
  });
  it('should return false when the long castle path is clear for the white and black king', () => {
    const board = EndGameBoard;
    board.whiteQueen = BigInt(0);
    board.blackQueen = BigInt(0);

    const isLongCastleBlockedForWhite = isLongCastleRouteBlocked(board, true);
    const isLongCastleBlockedForBlack = isLongCastleRouteBlocked(board, false);

    expect(isLongCastleBlockedForBlack).toBe(false);
    expect(isLongCastleBlockedForWhite).toBe(false);
  });
});

describe('findBitPosition', () => {
  it('returns the correct position for a single piece such as the king', () => {
    const startingBlackKing = findBitPosition(StartingBoard.blackKing);
    const startingWhiteKing = findBitPosition(StartingBoard.whiteKing);
    const shortCastledBlackKing = findBitPosition(CastleForBlackAfterGameBoard.blackKing);

    expect(startingBlackKing).toBe(61);
    expect(startingWhiteKing).toBe(5);
    expect(shortCastledBlackKing).toBe(63);
  });
});

describe('getCastledMoveFromBoardStates', () => {
  it('returns a correct bitmove showing the black king and rook moving after castling', () => {
    const startBoard = CastleForBlackGameBoard;
    const castledBoard = CastleForBlackAfterGameBoard;

    const result = getCastledMoveFromBoardStates(startBoard, castledBoard);

    expect(result.piece).toBe('blackKing');
    expect(result.castleRookFrom).toBe(64);
    expect(result.castleRookTo).toBe(62);
    expect(result.to).toBe(63);
  });

  // it("returns a correct bitmove showing the white king and rook moving after castling", () => {
  //   const startBoard = CastleForBlackGameBoard;
  //   const castledBoard = CastleForBlackAfterGameBoard;

  //   const result = getCastledMoveFromBoardStates(startBoard, castledBoard);

  //   expect(result.piece).toBe("blackKing");
  //   expect(result.castleRookFrom).toBe(64);
  //   expect(result.castleRookTo).toBe(62);
  //   expect(result.to).toBe(63);
  // });
});

describe('getBeforeAndAfterPositions', () => {
  it('can work out that a pawn moved from a starting position', () => {
    const startBoard = { ...StartingBoard };
    const movedPawn = applyMove(startBoard, 16, 24, 'whitePawn');
    const [before, after] = getBeforeAndAfterPositions(startBoard.whitePawn, movedPawn.whitePawn);
    expect(before).toEqual(16);
    expect(after).toEqual(24);
  });
});
