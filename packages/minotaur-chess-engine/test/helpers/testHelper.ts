import { BitBoard, bigIntToBinaryString } from '@karmacarrot/minotaur-chess-engine';
import { LogUnicodeBoardPositions } from '@karmacarrot/minotaur-chess-engine/src/logging/logger';

export function LogBoardPositions(currentBoard: BitBoard) {
  LogUnicodeBoardPositions(currentBoard);
}

export function LogBigintBinaryString(positions: BigInt, logName: string) {
  const positionString = bigIntToBinaryString(positions);
  console.log(`${logName}: ${positionString}`);
}
