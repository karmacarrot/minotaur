import {
  pgnInit,
  addMoveToPGN,
  stripCommentsFromPGN,
  pgnToGameNode,
  stripTagsFromPGN,
  parseMovesAndResult,
  pgnMoveToBoardMove,
  cleanPGN,
  StartingBoard,
  StartingNode,
} from '@karmacarrot/minotaur-chess-engine';
import { getFileMock } from '../testHelper';
describe('pgnInit', () => {
  it('starts a new png with a seven tag roster at the start', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-fischer-spassky.txt');
    const result = pgnInit(
      'F/S Return Match',
      'Belgrade, Serbia JUG',
      new Date('1992-11-04'),
      '29',
      'Fischer, Robert J.',
      'Spassky, Boris V.',
      '1/2-1/2'
    );

    expect(mockPGN).toContain(result);
  });
});

describe('addMoveToPGN', () => {
  it('adds e4 and e5 to the PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-e4-e5.txt');
    const startPGN = pgnInit(
      'E4E5 Mock',
      'Test Suite',
      new Date('2025-07-04'),
      '1',
      'WhiteComputer',
      'BlackComputer',
      '1/2-1/2'
    );

    // const result = addMoveToPGN(startPGN, null, null);
    // expect(result).toBe(mockPGN);
  });
});

describe('pgnToGameNode', () => {
  it('generates the correct game node state from a PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-e4-e5.txt');
    const result = pgnToGameNode(mockPGN);
    expect(result.gameState.moveHistory.length).toBe(2);
  });
});

describe('parseMovesAndResult', () => {
  it('generates the correct game move list and result from a small PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-e4-e5.txt');
    const result = parseMovesAndResult(mockPGN);
    expect(result.moves.length).toBe(2);
    expect(result.result).toBe('1/2-1/2');
  });

  it('generates the correct game move list and result from a longer real world PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-fischer-spassky.txt');
    const result = parseMovesAndResult(mockPGN);
    console.log(result.moves);
    expect(result.moves.length).toBe(85);
    expect(result.result).toBe('1/2-1/2');
  });
});

describe('stripCommentsFromPGN', () => {
  it('strips comments from a PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-fischer-spassky.txt');
    const strippedPGN = stripCommentsFromPGN(mockPGN);

    expect(mockPGN).toContain('{This opening is called the Ruy Lopez.}');
    expect(strippedPGN).not.toContain('{This opening is called the Ruy Lopez.}');
  });
  it('replaces a continuation (...) with a single full stop to allow easier parsing', () => {
    let mockPGN = '3... 2...';
    const strippedPGN = stripCommentsFromPGN(mockPGN);

    expect(strippedPGN).toBe('3. 2.');
  });
});

describe('stripTagsFromPGN', () => {
  it('strips tags from a PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-e4-e5.txt');
    const strippedPGN = stripTagsFromPGN(mockPGN);

    expect(strippedPGN.trim()).toBe('1.e4 e5 1/2-1/2');
  });
});

describe('cleanPGN', () => {
  it('normalizes line endings, strips tags / comments and carriage returns from a PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-e4-e5.txt');
    const strippedPGN = stripTagsFromPGN(mockPGN);

    expect(strippedPGN).toBe('1.e4 e5 1/2-1/2');
  });
});

describe('pgnMoveToBoardMove', () => {
  it('creates a boardMove from a PGN formatted pawn move for white double move', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('a4', startBoard, gameState);
    expect(result).toEqual({
      PieceMoved: 'whitePawn',
      PieceTaken: null,
      FileFrom: 'a',
      FileTo: 'a',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 2,
      RankTo: 4,
      isLegal: true,
    });
  });
  it('creates a boardMove from a PGN formatted pawn move for white single move', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('a3', startBoard, gameState);
    expect(result).toEqual({
      PieceMoved: 'whitePawn',
      PieceTaken: null,
      FileFrom: 'a',
      FileTo: 'a',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 2,
      RankTo: 3,
      isLegal: true,
    });
  });
  it('creates a boardMove from a PGN formatted pawn move for black double move', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('b5', startBoard, gameState);
    expect(result).toEqual({
      PieceMoved: 'blackPawn',
      PieceTaken: null,
      FileFrom: 'b',
      FileTo: 'b',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 7,
      RankTo: 5,
      isLegal: true,
    });
  });
  it('creates a boardMove from a PGN formatted pawn move for black single move', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('c6', startBoard, gameState);
    expect(result).toEqual({
      PieceMoved: 'blackPawn',
      PieceTaken: null,
      FileFrom: 'c',
      FileTo: 'c',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 7,
      RankTo: 6,
      isLegal: true,
    });
  });

  it('parses a legal white knight move from the start (Nf3)', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('Nf3', startBoard, gameState);
    expect(result).toEqual({
      PieceMoved: 'whiteKnight',
      PieceTaken: null,
      FileFrom: 'g',
      RankFrom: 1,
      FileTo: 'f',
      RankTo: 3,
      CastleRookFrom: '',
      CastleRookTo: '',
      isLegal: true,
    });
  });

  it('parses a legal black knight move from the start (Nc6)', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('Nc6', startBoard, gameState);
    expect(result).toEqual(
      expect.objectContaining({
        FileFrom: 'b',
        RankFrom: 8,
        FileTo: 'c',
        RankTo: 6,
        isLegal: true,
      })
    );
  });

  it('rejects an illegal pawn capture when no piece exists on the target square (exd5 from start)', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('exd3', startBoard, gameState);
    expect(result).toEqual(
      expect.objectContaining({
        isLegal: false,
      })
    );
  });

  // it('rejects a bishop move blocked by own pawn from the start (Bb5)', () => {
  //   const startBoard = StartingBoard;
  //   const result = pgnMoveToBoardMove('Bb5', startBoard, true);
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       isLegal: false,
  //     })
  //   );
  // });

  // it('rejects a rook move blocked by own pawn from the start (Ra3)', () => {
  //   const startBoard = StartingBoard;
  //   const result = pgnMoveToBoardMove('Ra3', startBoard, true);
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       isLegal: false,
  //     })
  //   );
  // });

  // it('rejects a queen move blocked by own pawn from the start (Qh5)', () => {
  //   const startBoard = StartingBoard;
  //   const result = pgnMoveToBoardMove('Qh5', startBoard, true);
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       isLegal: false,
  //     })
  //   );
  // });

  // it('rejects kingside castling from the start because path is blocked (O-O)', () => {
  //   const startBoard = StartingBoard;
  //   const result = pgnMoveToBoardMove('O-O', startBoard, true);
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       isLegal: false,
  //     })
  //   );
  // });

  // it('rejects a black pawn move when it is white to move (c5 with white to move)', () => {
  //   const startBoard = StartingBoard;
  //   const result = pgnMoveToBoardMove('c5', startBoard, true);
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       isLegal: false,
  //     })
  //   );
  // });

  // it('rejects off-board destination (e9)', () => {
  //   const startBoard = StartingBoard;
  //   const result = pgnMoveToBoardMove('e9', startBoard, true);
  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       isLegal: false,
  //     })
  //   );
  // });

  it('rejects malformed SAN or unsupported suffix (e4!!)', () => {
    const startNode = StartingNode();
    const startBoard = startNode.boardState;
    const gameState = startNode.gameState;
    const result = pgnMoveToBoardMove('e4!!', startBoard, gameState);
    expect(result).toEqual(
      expect.objectContaining({
        isLegal: false,
      })
    );
  });

  // --- Placeholders for midgame scenarios (need custom board setups) ---

  it.todo('handles en passant capture correctly for white and black (e.g., exd6 ep)');
  it.todo('handles pawn promotion without capture (e8=Q, e1=Q for black)');
  it.todo('handles pawn promotion with capture (exd8=Q, ...=N, ...=B, ...=R)');
  it.todo('accepts both O-O and 0-0 (and O-O-O / 0-0-0) when legal and sets rook fields');
  it.todo('rejects castling through check, into check, or while in check');
  it.todo('validates sliding piece path blocking (bishop/rook/queen) in general midgame positions');
  it.todo(
    'rejects ambiguous SAN without proper disambiguation (e.g., two knights to the same square)'
  );
  it.todo('accepts minimal SAN disambiguation (Nbd2 / R1e2) and resolves the correct origin');
  it.todo('rejects moves that leave own king in check (self-check)');
});
