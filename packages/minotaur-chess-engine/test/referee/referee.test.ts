import {
  BoardMove,
  Piece,
  MiddleGameBoard,
  moveAnyPiece,
  BitBoard,
  isLegalMove,
  isOnStartingRank,
  EndGameBoard,
  isOpponentChecked,
  movePiece,
  CastleForBlackGameBoard,
  GameStatus,
  StartingNode,
  isLegalPawnMove,
  InitialGameStatus,
  EnPassantBoard,
  StartingBoard,
} from '@karmacarrot/minotaur-chess-engine';

describe('isLegalMove', () => {
  it.each([
    ['whitePawn', "It Doesn't move at all", null, 'e', 'e', 2, 2, false],
    ['whitePawn', 'Moving Forward two spaces from starting rank', null, 'e', 'e', 2, 4, true],
    ['blackPawn', 'Moving Forward two spaces from starting rank', '', 'b', 'b', 7, 5, true],
    ['blackPawn', 'Moving Forward one space', null, 'h', 'h', 6, 5, true],
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
    'should validate %s when %s',
    (pieceMoved, rule, pieceTaken, fileFrom, fileTo, rankFrom, rankTo, expected) => {
      const move: BoardMove = {
        PieceMoved: pieceMoved as Piece,
        PieceTaken: pieceTaken as Piece,
        FileFrom: fileFrom,
        FileTo: fileTo,
        RankFrom: rankFrom,
        RankTo: rankTo,
        isLegal: false,
        CastleRookFrom: '',
        CastleRookTo: '',
      };
      const startingPositions = MiddleGameBoard;
      const startNode = StartingNode();
      startNode.boardState = startingPositions;
      startNode.gameState.isWhitesTurn = true;
      const newState = moveAnyPiece(
        startingPositions,
        rankFrom,
        fileFrom,
        rankTo,
        fileTo,
        pieceMoved as keyof BitBoard
      );
      const isLegal = isLegalMove(move, startingPositions, newState, startNode.gameState);
      expect(isLegal.isLegal).toEqual(expected);
    }
  );

  it.each([
    ['blackKing', 'short', null, 'e', 'g', 8, 8, true],
    ['blackKing', 'long', null, 'e', 'c', 8, 8, false],
  ])(
    'should let %s castle %s',
    (pieceMoved, rule, pieceTaken, fileFrom, fileTo, rankFrom, rankTo, expected) => {
      const startingPositions = CastleForBlackGameBoard;
      const startNode = StartingNode();
      startNode.boardState = startingPositions;
      startNode.gameState.isWhitesTurn = false;
      const move: BoardMove = {
        PieceMoved: pieceMoved as Piece,
        PieceTaken: pieceTaken as Piece,
        FileFrom: fileFrom,
        FileTo: fileTo,
        RankFrom: rankFrom,
        RankTo: rankTo,
        isLegal: false,
        CastleRookFrom: 'h',
        CastleRookTo: 'f',
      };

      const newState = moveAnyPiece(
        startingPositions,
        rankFrom,
        fileFrom,
        rankTo,
        fileTo,
        pieceMoved as keyof BitBoard
      );
      const isLegal = isLegalMove(move, startingPositions, newState, startNode.gameState);
      expect(isLegal.isLegal).toEqual(expected);
    }
  );
});

describe('isOnStartingRank', () => {
  const moveProperties = {
    PieceTaken: null as Piece,
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
      CastleRookFrom: '',
      CastleRookTo: '',
    };
    expect(isOnStartingRank(move)).toBe(true);
  });

  it('should return true for black pawns on rank 7', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'blackPawn',
      RankFrom: 7,
      CastleRookFrom: '',
      CastleRookTo: '',
    };
    expect(isOnStartingRank(move)).toBe(true);
  });

  it('should return false for white pawns not on rank 2', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'whitePawn',
      RankFrom: 3,
      CastleRookFrom: '',
      CastleRookTo: '',
    };
    expect(isOnStartingRank(move)).toBe(false);
  });

  it('should return false for black pawns not on rank 7', () => {
    const move: BoardMove = {
      ...moveProperties,
      PieceMoved: 'blackPawn',
      RankFrom: 6,
      CastleRookFrom: '',
      CastleRookTo: '',
    };
    expect(isOnStartingRank(move)).toBe(false);
  });
});

describe('isOpponentChecked', () => {
  it('returns true if the white queen moves onto an open file with the black king', () => {
    const endGameBoard = { ...EndGameBoard };
    const startNode = StartingNode();
    startNode.boardState = endGameBoard;

    const opponentChecked = isOpponentChecked(endGameBoard, true);
    expect(opponentChecked.check).toBe(false);

    const newPositions = movePiece(endGameBoard, 'whiteQueen', 1, 'd', 2, 'e', startNode.gameState);
    const opponentCheckedAfterQueenMove = isOpponentChecked(newPositions.BoardState, true);
    expect(opponentCheckedAfterQueenMove.check).toBe(true);

    const secondPositions = movePiece(
      newPositions.BoardState,
      'whiteQueen',
      2,
      'e',
      1,
      'd',
      startNode.gameState
    );
    const opponentCheckedAfterSecondQueenMove = isOpponentChecked(secondPositions.BoardState, true);
    expect(opponentCheckedAfterSecondQueenMove.check).toBe(false);
  });
});

describe('isLegalPawnMove', () => {
  it.each([
    ['whitePawn', "It Doesn't move at all", null, 'e', 'e', 2, 2, false],
    ['whitePawn', 'Moving Forward two spaces from starting rank', null, 'e', 'e', 2, 4, true],
    ['blackPawn', 'Moving Forward two spaces from starting rank', '', 'b', 'b', 7, 5, true],
    ['blackPawn', 'Moving Forward one space', null, 'h', 'h', 6, 5, true],
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
    'should validate %s when %s',
    (pieceMoved, rule, pieceTaken, fileFrom, fileTo, rankFrom, rankTo, expected) => {
      const move: BoardMove = {
        PieceMoved: pieceMoved as Piece,
        PieceTaken: pieceTaken as Piece,
        FileFrom: fileFrom,
        FileTo: fileTo,
        RankFrom: rankFrom,
        RankTo: rankTo,
        isLegal: false,
        CastleRookFrom: '',
        CastleRookTo: '',
      };
      const startingPositions = MiddleGameBoard;
      const startNode = StartingNode();
      startNode.boardState = startingPositions;
      startNode.gameState.isWhitesTurn = true;

      const isLegal = isLegalPawnMove(move, startingPositions, startNode.gameState);
      expect(isLegal).toEqual(expected);
    }
  );

  it('should return true if it is whites turn, black did a double pawn move to be level with 2 white pawns which could capture it and one attempted the capture', () => {
    const startGameState = { ...InitialGameStatus };
    const movedBlackPawn = BigInt(
      '0b0000000000000000000000000000000000000100000000000000000000000000'
    );
    startGameState.isWhitesTurn = true;
    startGameState.lastBlackDoublePawnMove = movedBlackPawn;
    const boardState = EnPassantBoard;
    const move: BoardMove = {
      PieceMoved: 'whitePawn' as Piece,
      PieceTaken: 'blackPawn' as Piece,
      FileFrom: 'g',
      FileTo: 'f',
      RankFrom: 5,
      RankTo: 6,
      isLegal: false,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const isLegal = isLegalPawnMove(move, boardState, startGameState);
    expect(isLegal).toEqual(true);
  });

  it('should return true if it is blacks turn, white did a double pawn move to be level with a white pawn which could capture it and attempted the capture', () => {
    const startGameState = { ...InitialGameStatus };
    const movedWhitePawn = BigInt(
      '0b0000000000000000000000001000000000000000000000000000000000000000'
    );
    startGameState.isWhitesTurn = false;
    startGameState.lastWhiteDoublePawnMove = movedWhitePawn;
    const boardState = EnPassantBoard;
    const move: BoardMove = {
      PieceMoved: 'blackPawn' as Piece,
      PieceTaken: 'whitePawn' as Piece,
      FileFrom: 'b',
      FileTo: 'a',
      RankFrom: 4,
      RankTo: 3,
      isLegal: false,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const isLegal = isLegalPawnMove(move, boardState, startGameState);
    expect(isLegal).toEqual(true);
  });

  it('should not allow an en passant capture when the last move wasnt a double pawn move', () => {
    const startGameState = { ...InitialGameStatus };

    startGameState.isWhitesTurn = false;
    startGameState.lastWhiteDoublePawnMove = BigInt(0);
    const boardState = EnPassantBoard;
    const move: BoardMove = {
      PieceMoved: 'blackPawn' as Piece,
      PieceTaken: 'whitePawn' as Piece,
      FileFrom: 'b',
      FileTo: 'a',
      RankFrom: 4,
      RankTo: 3,
      isLegal: false,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const isLegal = isLegalPawnMove(move, boardState, startGameState);
    expect(isLegal).toEqual(false);
  });

  it('should not allow pawns to move files when not capturing', () => {
    const startGameState = { ...InitialGameStatus };

    const boardState = StartingBoard;
    const move: BoardMove = {
      PieceMoved: 'whitePawn' as Piece,
      PieceTaken: '' as Piece,
      FileFrom: 'b',
      FileTo: 'a',
      RankFrom: 2,
      RankTo: 3,
      isLegal: false,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const isLegal = isLegalPawnMove(move, boardState, startGameState);
    expect(isLegal).toEqual(false);
  });
});
