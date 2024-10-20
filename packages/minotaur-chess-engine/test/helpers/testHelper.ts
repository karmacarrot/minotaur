import {
  BitBoard,
  BoardArray,
  unicodePieceMap,
  bigIntToBinaryString,
} from '@karmacarrot/minotaur-chess-engine';

export function LogBoardPositions(currentBoard: BitBoard) {
  const board = BoardArray(currentBoard);
  let boardString = '';
  for (let row = 7; row >= 0; row--) {
    let rowString = '________________________________________\n';
    for (let col = 7; col >= 0; col--) {
      rowString += '| ';
      const piece = board[row][col];
      rowString += piece ? `${unicodePieceMap[piece] || piece}` : '.';
      rowString += ' |';
    }
    boardString += rowString + '\n';
  }
  console.log(boardString);
}

export function LogBigintBinaryString(positions: BigInt, logName: string) {
  const positionString = bigIntToBinaryString(positions);
  console.log(`${logName}: ${positionString}`);
}
