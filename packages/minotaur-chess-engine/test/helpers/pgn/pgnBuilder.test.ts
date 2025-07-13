import {
  pgnInit,
  addMoveToPGN,
  stripCommentsFromPGN,
  pgnToGameNode,
  stripTagsFromPGN,
  parseMovesAndResult,
  cleanPGN,
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
