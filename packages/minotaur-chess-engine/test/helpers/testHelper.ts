import { BitBoard, bigIntToBinaryString } from '@karmacarrot/minotaur-chess-engine';
import { LogUnicodeBoardPositions } from '@karmacarrot/minotaur-chess-engine/src/logging/logger';
import fs from 'fs';
import path from 'path';

export function LogBoardPositions(currentBoard: BitBoard) {
  LogUnicodeBoardPositions(currentBoard);
}

export function LogBigintBinaryString(positions: BigInt, logName: string) {
  const positionString = bigIntToBinaryString(positions);
  console.log(`${logName}: ${positionString}`);
}

export function getFileMock(pathToFile: string) {
  let mock = fs.readFileSync(path.resolve(__dirname, pathToFile), 'utf-8');
  mock = mock.replace(/\r\n/g, '\n');

  return mock;
}
