import { BitMove } from '../../types';
import { getFileAndRank } from '../bitboards';

export function moveToUciFormat(move: BitMove) {
  const rankAndFileForStartPosition = getFileAndRank(move.from);
  const rankAndFileForEndPosition = getFileAndRank(move.to);

  return `${rankAndFileForStartPosition.file}${rankAndFileForStartPosition.rank}${rankAndFileForEndPosition.file}${rankAndFileForEndPosition.rank}`;
}
