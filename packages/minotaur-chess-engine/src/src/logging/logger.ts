import { BoardArray } from '../board';
import { unicodePieceMap } from '../helpers/definitions';
import { BitBoard } from '../types';
import { LogLevels } from './definitions';

export function LogUnicodeBoardPositions(currentBoard: BitBoard) {
  const board = BoardArray(currentBoard);
  let boardString = '';
  for (let row = 7; row >= 0; row--) {
    let rowString = '________________________________________\n';
    for (let col = 7; col >= 0; col--) {
      if (board && board[row]) {
        rowString += '| ';
        const piece = board[row]?.[col];
        rowString += piece ? `${unicodePieceMap[piece] || piece}` : '.';
        rowString += ' |';
      }
    }
    boardString += rowString + '\n';
  }
  console.log(boardString);
}

export function MultiLog(outputType: LogLevels, message: string, outputVerbosity: LogLevels) {
  if (
    (outputType === LogLevels.warn || outputType === LogLevels.info) &&
    outputVerbosity === LogLevels.error
  ) {
    return;
  }

  if (outputType === LogLevels.info && outputVerbosity !== LogLevels.info) {
    return;
  }

  switch (outputType) {
    case LogLevels.info:
      console.info(message);
    case LogLevels.warn:
      console.warn(message);
    case LogLevels.error:
      console.error(message);
    case LogLevels.log:
      console.log(message);
    default:
      console.log(message);
  }
}
