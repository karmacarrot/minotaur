import {
  BoardMove,
  Piece,
  MiddleGameBoard,
  moveSlidingPiece,
  BitBoard,
  isLegalMove,
  isOnStartingRank,
  EndGameBoard,
  isOpponentChecked,
  movePiece,
} from '@karmacarrot/minotaur-chess-engine';

describe('isLegalMove', () => {
  it.each([
    ['whitePawn', "Doesn't move at all", null, 'e', 'e', 2, 2, false],
    ['whitePawn', 'Forward two spaces from starting rank', null, 'e', 'e', 2, 4, true],
    // ["whitePawn", "Diagonal capture", "blackPawn", "a", "b", 4, 5, true],
    ['blackPawn', 'Forward two spaces from starting rank', '', 'b', 'b', 7, 5, true],

    ['blackPawn', 'Forward one space', null, 'h', 'h', 6, 5, true],

    ['whitePawn', 'Illegal move, pawns cannot move backwards', null, 'h', 'h', 3, 2, false],
    [
      'whitePawn',
      'Illegal move, pawns cannot move 2 spaces when not on starting rank',
      null,
      'h',
      'h',
      3,
      5,
      false,
    ],
    [
      'blackPawn',
      'Illegal move, pawns cannot move 2 spaces when not on starting rank',
      null,
      'h',
      'h',
      6,
      4,
      false,
    ],
  ])(
    'should validate %s with %s',
    (pieceMoved, rule, pieceTaken, fileFrom, fileTo, rankFrom, rankTo, expected) => {
      const move: BoardMove = {
        PieceMoved: pieceMoved as Piece,
        PieceTaken: pieceTaken as Piece,
        FileFrom: fileFrom,
        FileTo: fileTo,
        RankFrom: rankFrom,
        RankTo: rankTo,
        isLegal: false,
      };
      const startingPositions = MiddleGameBoard;
      const newState = moveSlidingPiece(
        startingPositions,
        rankFrom,
        fileFrom,
        rankTo,
        fileTo,
        pieceMoved as keyof BitBoard
      );
      const isLegal = isLegalMove(move, startingPositions, newState);
      expect(isLegal.isLegal).toEqual(expected);
    }
  );
});

describe('isOnStartingRank', () => {
  const moveProperties = {
    PieceTaken: null,
    FileFrom: '',
    FileTo: '',
    RankTo: 0,
    isLegal: false,
  };

  it('should return true for white pawns on rank 2', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'whitePawn',
      RankFrom: 2,
    };
    expect(isOnStartingRank(move)).toBe(true);
  });

  it('should return true for black pawns on rank 7', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'blackPawn',
      RankFrom: 7,
    };
    expect(isOnStartingRank(move)).toBe(true);
  });

  it('should return false for white pawns not on rank 2', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'whitePawn',
      RankFrom: 3,
    };
    expect(isOnStartingRank(move)).toBe(false);
  });

  it('should return false for black pawns not on rank 7', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'blackPawn',
      RankFrom: 6,
    };
    expect(isOnStartingRank(move)).toBe(false);
  });
});

describe('isOpponentChecked', () => {
  it('returns true if the white queen moves onto an open file with the black king', () => {
    const endGameBoard = { ...EndGameBoard };
    const opponentChecked = isOpponentChecked(endGameBoard, true);
    expect(opponentChecked.check).toBe(false);

    const newPositions = movePiece(endGameBoard, 'whiteQueen', 1, 'd', 2, 'e');
    const opponentCheckedAfterQueenMove = isOpponentChecked(newPositions.BoardState, true);
    expect(opponentCheckedAfterQueenMove.check).toBe(true);

    const secondPositions = movePiece(newPositions.BoardState, 'whiteQueen', 2, 'e', 1, 'd');
    const opponentCheckedAfterSecondQueenMove = isOpponentChecked(secondPositions.BoardState, true);
    expect(opponentCheckedAfterSecondQueenMove.check).toBe(false);
  });
});
