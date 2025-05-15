import { BitMove, GameNode } from '../../types';
import { getFileAndRank } from '../bitboards';

export function moveToUciFormat(moveAndState: [BitMove, GameNode[]]) {
  const [move, state] = moveAndState;
  const rankAndFileForStartPosition = getFileAndRank(move.from);
  const rankAndFileForEndPosition = getFileAndRank(move.to);

  return `${rankAndFileForStartPosition.file}${rankAndFileForStartPosition.rank}${rankAndFileForEndPosition.file}${rankAndFileForEndPosition.rank}`;
}
