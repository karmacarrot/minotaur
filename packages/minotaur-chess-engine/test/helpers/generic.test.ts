import {
  normalizedLineEndings,
  splitOnCarriageReturnsAndSpaces,
} from '@karmacarrot/minotaur-chess-engine';

describe('normalizedLineEndings', () => {
  it('should normalize line endings', () => {
    let stringWithWindowsEndings = 'this has windows line endings \r\n';

    stringWithWindowsEndings = normalizedLineEndings(stringWithWindowsEndings);

    expect(stringWithWindowsEndings).toEqual('this has windows line endings \n');
  });
});

describe('splitOnCarriageReturnsAndSpaces', () => {
  it('splits a string on multiple carriage returns or white spaces', () => {
    let stringWithSpacesAndCarriageReturns = '1 2 3 4 5 6\n7\r8';
    const result = splitOnCarriageReturnsAndSpaces(stringWithSpacesAndCarriageReturns);
    expect(result.length).toBe(8);
  });
  it('splits a string on multiple carriage returns or white spaces after normalizing line endings', () => {
    let stringWithSpacesAndCarriageReturns = normalizedLineEndings('1 2 3 4 5 6\r\n7\r8');
    const result = splitOnCarriageReturnsAndSpaces(stringWithSpacesAndCarriageReturns);
    expect(result.length).toBe(8);
  });
});
