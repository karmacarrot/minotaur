import { matchSan, parseMovesAndResult, parseSan } from '@karmacarrot/minotaur-chess-engine';
import { getFileMock } from '../testHelper';

describe('matchSan', () => {
  it('matches a pawn move in SAN', () => {
    const result = matchSan('a4');
    expect(result).toContain('a4');
  });

  it('matches each move from a longer real world PGN', () => {
    let mockPGN = getFileMock('../mocks/pgnMock-fischer-spassky.txt');
    const result = parseMovesAndResult(mockPGN);

    result.moves.forEach((move) => {
      if (move != 'O-O' && move !== 'O-O-O') {
        const result = matchSan(move);

        expect(result).toContain(move);
      }
    });
  });
});

describe('parseSan', () => {
  it('parses a simple pawn move into target rank and file correctly', () => {
    const result = parseSan('e4');

    if (result === null) {
      return;
    }
    expect(result.targetFile).toBe('e');
    expect(result.targetRank).toBe(4);
    expect(result.piece).toBe('P');
    expect(result.isCapture).toBe(false);
  });

  it('parses a Knight move with the correct piece and target rank / file', () => {
    const result = parseSan('Nf3');
    if (result === null) {
      return;
    }
    expect(result.targetFile).toBe('f');
    expect(result.targetRank).toBe(3);
    expect(result.piece).toBe('N');
  });

  it('parses a capture pawn move into target rank and file correctly', () => {
    const result = parseSan('exd5');
    if (result === null) {
      return;
    }
    expect(result.disambiguationFile).toBe('e');

    expect(result.targetFile).toBe('d');
    expect(result.targetRank).toBe(5);
    expect(result.piece).toBe('P');
    expect(result.isCapture).toBe(true);
  });

  it('parses a castling move correctly', () => {
    const result = parseSan('O-O');
    if (result === null) {
      return;
    }
    expect(result.isCastleKingside).toBe(true);
  });
});
