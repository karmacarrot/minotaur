import {
  convertBoardXYtoRankFile,
  BoardXY,
  convertRankFileToBoardXY,
} from '@karmacarrot/minotaur-chess-react';
import Chance from 'chance';

const chance = new Chance();

describe('convertBoardXYtoRankFile', () => {
  it('should convert board coordinates to rank and file correctly', () => {
    const offset: BoardXY = { x: 0, y: 0 };
    const tileSize = 50;
    const boardTarget: BoardXY = { x: 5, y: 370 };
    const result = convertBoardXYtoRankFile(offset, tileSize, boardTarget);
    expect(result).toEqual({ Rank: 1, File: 'a' });
  });

  it.each([
    [
      { x: 5, y: 370 },
      { Rank: 1, File: 'a' },
    ],
    [
      { x: 5, y: 210 },
      { Rank: 4, File: 'a' },
    ],
    [
      { x: 5, y: 5 },
      { Rank: 8, File: 'a' },
    ],
    [
      { x: 55, y: 5 },
      { Rank: 8, File: 'b' },
    ],
    [
      { x: 370, y: 210 },
      { Rank: 4, File: 'h' },
    ],
  ])('should convert board coordinates to rank and file correctly for %s', (input, expected) => {
    const offset: BoardXY = { x: 0, y: 0 };
    const tileSize = 50;
    const result = convertBoardXYtoRankFile(offset, tileSize, input);
    expect(result).toEqual(expected);
  });

  it('should take into account tile size', () => {
    const offset: BoardXY = { x: 0, y: 0 };
    const tileSize = chance.integer({ min: 1, max: 100 });
    const boardTarget: BoardXY = { x: 1 * tileSize - 1, y: 8 * tileSize - 1 };
    const result = convertBoardXYtoRankFile(offset, tileSize, boardTarget);
    expect(result).toEqual({ Rank: 1, File: 'a' });
  });

  it('should take into account board offset', () => {
    const offset: BoardXY = { x: 100, y: 400 };
    const tileSize = 50;
    const boardTarget: BoardXY = { x: 105, y: 770 };
    const result = convertBoardXYtoRankFile(offset, tileSize, boardTarget);
    expect(result).toEqual({ Rank: 1, File: 'a' });
  });
});

describe('convertRankFileToBoardXY', () => {
  it.each([
    [
      { rank: 1, file: 'a' },
      { x: 0, y: 350 },
    ],
    [
      { rank: 8, file: 'h' },
      { x: 350, y: 0 },
    ],
    [
      { rank: 5, file: 'c' },
      { x: 100, y: 150 },
    ],
  ])('should convert rank and file to board coordinates correctly', (input, expected) => {
    const result = convertRankFileToBoardXY(input.rank, input.file, { x: 0, y: 0 }, 50);
    expect(result).toEqual(expected);
  });
  it('should take into account tile size', () => {
    const tileSize = chance.integer({ min: 1, max: 100 });
    const result = convertRankFileToBoardXY(1, 'a', { x: 0, y: 0 }, tileSize);
    const expected: BoardXY = { x: 0, y: 8 * tileSize - tileSize };
    expect(result).toEqual(expected);
  });
  it('should take into account board offset', () => {
    const tileSize = 50;
    const offset: BoardXY = { x: 100, y: 400 };
    const result = convertRankFileToBoardXY(1, 'a', offset, tileSize);
    const expected: BoardXY = { x: 100, y: 750 };
    expect(result).toEqual(expected);
  });
});
