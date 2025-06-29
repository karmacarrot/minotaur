import { BitBoard, BitMove } from '../../types';
import { getBitBoardPosition, getFileAndRank, occupiedBy } from '../bitboards';

export function moveToUciFormat(move: BitMove) {
  const rankAndFileForStartPosition = getFileAndRank(move.from);
  const rankAndFileForEndPosition = getFileAndRank(move.to);

  return `${rankAndFileForStartPosition.file}${rankAndFileForStartPosition.rank}${rankAndFileForEndPosition.file}${rankAndFileForEndPosition.rank}`;
}

export function uciToBitMoves(
  moveLine: string,
  boardState: BitBoard,
  resetGame: () => void
): BitMove[] {
  const moveCommands = moveLine.trim().split(/\s+/);
  const bitMoves: BitMove[] = [];

  moveCommands.forEach((moveCommand: string) => {
    if (moveCommand === 'startpos') {
      resetGame();
    } else {
      if (
        moveCommand &&
        moveCommand !== 'moves' &&
        moveCommand !== 'position' &&
        moveCommand !== ''
      ) {
        const fromPosition = getBitBoardPosition(moveCommand[0] + '', Number(moveCommand[1]));
        const toPosition = getBitBoardPosition(moveCommand[2] + '', Number(moveCommand[3]));
        const piece = occupiedBy(boardState, fromPosition);
        const takenPiece = occupiedBy(boardState, toPosition);
        const bitMove: BitMove = {
          from: fromPosition,
          to: toPosition,
          piece: piece as keyof BitBoard,
          pieceTaken: takenPiece as keyof BitBoard,
          castleRookFrom: 0,
          castleRookTo: 0,
          score: 0,
          evaluations: 0,
          promotion: piece as keyof BitBoard,
        };
        bitMoves.push(bitMove);
      }
    }
  });

  return bitMoves;
}
