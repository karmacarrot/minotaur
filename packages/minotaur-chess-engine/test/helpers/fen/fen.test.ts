import {
  BoardMove,
  countFullMoves,
  countHalfMoves,
  EmptyBoard,
  getFenFromGameNode,
  getFenPositionsFromGameNode,
  movePiece,
  pieceNameToFenName,
  StartingNode,
} from '@karmacarrot/minotaur-chess-engine';

const validStartingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const validStartingFenPositions = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const testDataForPieceNameConversion = [
  { piece: 'blackPawn', expected: 'p' },
  { piece: 'blackKnight', expected: 'n' },
  { piece: 'blackRook', expected: 'r' },
  { piece: 'blackBishop', expected: 'b' },
  { piece: 'blackKing', expected: 'k' },
  { piece: 'blackQueen', expected: 'q' },
  { piece: 'whitePawn', expected: 'P' },
  { piece: 'whiteKnight', expected: 'N' },
  { piece: 'whiteRook', expected: 'R' },
  { piece: 'whiteBishop', expected: 'B' },
  { piece: 'whiteKing', expected: 'K' },
  { piece: 'whiteQueen', expected: 'Q' },
  { piece: 'whiteGiraffe', expected: '' },
  { piece: null, expected: '' },
];

describe('pieceNameToFenName', () => {
  it.each(testDataForPieceNameConversion)('returns the right fen character where %s', (params) => {
    const result = pieceNameToFenName(params.piece);
    expect(result).toBe(params.expected);
  });
});

describe('getFenFromGameNode', () => {
  it('should return a valid fen for a start position', () => {
    const startingNode = StartingNode();

    const startingFen = getFenFromGameNode(startingNode);

    expect(startingFen).toBe(validStartingFen);
  });
});

describe('countFullMoves', () => {
  it('should return 1 full moves at the start since the counter begins at 1', () => {
    const startingNode = StartingNode();
    const fullMoves = countFullMoves(startingNode.gameState.moveHistory);
    expect(fullMoves).toBe(1);
  });
  it('should return 26 full moves from 51 half moves', () => {
    const moves: BoardMove[] = Array(51).fill(null);
    const fullMoves = countFullMoves(moves);
    expect(fullMoves).toBe(26);
  });
  it('should return 26 full moves from 50 half moves', () => {
    const moves: BoardMove[] = Array(51).fill(null);
    const fullMoves = countFullMoves(moves);
    expect(fullMoves).toBe(26);
  });
});

describe('countHalfMoves', () => {
  it('should return a 0 half moves at start', () => {
    const startingNode = StartingNode();
    const halfMoves = countHalfMoves(startingNode.gameState.moveHistory);
    expect(halfMoves).toBe(0);
  });

  it('should return a 100 half moves if both sides making meaningless moves for 50 full moves', () => {
    const moves: BoardMove[] = [];

    for (let i = 0; i < 25; i++) {
      const firstMove: BoardMove = {
        PieceMoved: 'whiteKnight',
        PieceTaken: null,
        FileFrom: 'g',
        FileTo: 'f',
        CastleRookFrom: '',
        CastleRookTo: '',
        RankFrom: 1,
        RankTo: 3,
        isLegal: true,
      };

      moves.push(firstMove);

      const secondMove: BoardMove = {
        PieceMoved: 'blackKnight',
        PieceTaken: null,
        FileFrom: 'b',
        FileTo: 'c',
        CastleRookFrom: '',
        CastleRookTo: '',
        RankFrom: 8,
        RankTo: 6,
        isLegal: true,
      };

      moves.push(secondMove);

      const thirdMove: BoardMove = {
        PieceMoved: 'whiteKnight',
        PieceTaken: null,
        FileFrom: 'f',
        FileTo: 'g',
        CastleRookFrom: '',
        CastleRookTo: '',
        RankFrom: 3,
        RankTo: 1,
        isLegal: true,
      };

      moves.push(thirdMove);

      const fourthMove: BoardMove = {
        PieceMoved: 'blackKnight',
        PieceTaken: null,
        FileFrom: 'c',
        FileTo: 'b',
        CastleRookFrom: '',
        CastleRookTo: '',
        RankFrom: 6,
        RankTo: 8,
        isLegal: true,
      };

      moves.push(fourthMove);
    }

    const halfMoves = countHalfMoves(moves);
    expect(halfMoves).toBe(100);
  });

  it('should reset half moves if moving a pawn or capturing a piece', () => {
    const moves: BoardMove[] = [];

    const firstMove: BoardMove = {
      PieceMoved: 'whiteKnight',
      PieceTaken: null,
      FileFrom: 'g',
      FileTo: 'f',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 1,
      RankTo: 3,
      isLegal: true,
    };

    moves.push(firstMove);

    let halfMoves = countHalfMoves(moves);
    expect(halfMoves).toBe(1);

    const secondMove: BoardMove = {
      PieceMoved: 'blackPawn',
      PieceTaken: null,
      FileFrom: 'a',
      FileTo: 'a',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 8,
      RankTo: 7,
      isLegal: true,
    };
    moves.push(secondMove);

    halfMoves = countHalfMoves(moves);
    expect(halfMoves).toBe(0);

    moves.push(firstMove);
    halfMoves = countHalfMoves(moves);
    expect(halfMoves).toBe(1);

    const captureMove: BoardMove = {
      PieceMoved: 'blackKnight',
      PieceTaken: 'whiteQueen',
      FileFrom: 'a',
      FileTo: 'a',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 8,
      RankTo: 7,
      isLegal: true,
    };
    moves.push(captureMove);

    halfMoves = countHalfMoves(moves);
    expect(halfMoves).toBe(0);
  });
});

describe('getFenPositionsFromGameNode', () => {
  it('should return a valid FEN positions section string for empty board', () => {
    const startingNode = StartingNode();
    startingNode.boardState = EmptyBoard;
    const startingFen = getFenPositionsFromGameNode(startingNode);

    expect(startingFen).toBe('8/8/8/8/8/8/8/8');
  });

  it('should return a valid FEN string for pieces only for a starting position', () => {
    const startingNode = StartingNode();

    const startingFen = getFenPositionsFromGameNode(startingNode);

    expect(startingFen).toBe(validStartingFenPositions);
  });

  it('should return a valid FEN string for pieces after 1. e4', () => {
    const startingNode = StartingNode();

    startingNode.boardState = movePiece(
      startingNode.boardState,
      'whitePawn',
      2,
      'e',
      4,
      'e',
      startingNode.gameState
    ).BoardState;

    const startingFen = getFenPositionsFromGameNode(startingNode);

    expect(startingFen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
  });

  it('should return a valid FEN string for pieces after 1. e4 c5 2.Nf3', () => {
    const startingNode = StartingNode();

    startingNode.boardState = movePiece(
      startingNode.boardState,
      'whitePawn',
      2,
      'e',
      4,
      'e',
      startingNode.gameState
    ).BoardState;

    startingNode.boardState = movePiece(
      startingNode.boardState,
      'blackPawn',
      7,
      'c',
      5,
      'c',
      startingNode.gameState
    ).BoardState;

    startingNode.boardState = movePiece(
      startingNode.boardState,
      'whiteKnight',
      1,
      'g',
      3,
      'f',
      startingNode.gameState
    ).BoardState;

    const startingFen = getFenPositionsFromGameNode(startingNode);

    expect(startingFen).toBe('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R');
  });
});
