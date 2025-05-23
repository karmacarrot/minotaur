import { EvalLogs, GameNode } from '../../../../types';
import {
  allBlackPositions,
  allWhitePositions,
  applyMove,
  findBitPositions,
  isAtoHwraparound,
  isOccupiedComposite,
} from '../../../bitboards';
import { orthagonalOffsets } from '../../../definitions';
import { pushNewNode } from '../nodeGenerators';

export function rookNodes(node: GameNode, evalLogs: EvalLogs): GameNode[] {
  let possibleNodes: GameNode[] = [];
  //console.log(`black king check status: ${node.gameState.blackKingChecked}`);
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const rooksToMove = isWhitesTurn ? node.boardState.whiteRook : node.boardState.blackRook;

  const rookPositions = findBitPositions(rooksToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn
    ? allWhitePositions(node.boardState)
    : allBlackPositions(node.boardState);
  const allEnemyOccupiedPositions = isWhitesTurn
    ? allBlackPositions(node.boardState)
    : allWhitePositions(node.boardState);

  rookPositions.forEach((rookPosition) => {
    const offsets = orthagonalOffsets;

    offsets.forEach((offset) => {
      let lastPosition = rookPosition;

      for (
        let newPosition = rookPosition + offset;
        newPosition >= 1 && newPosition <= 64;
        newPosition += offset
      ) {
        if (isAtoHwraparound(lastPosition, newPosition)) {
          break;
        }

        if (isOccupiedComposite(allFriendlyOccupiedPositions, newPosition)) {
          break;
        }

        if (!isOccupiedComposite(allFriendlyOccupiedPositions, newPosition)) {
          const newBoardState = applyMove(
            node.boardState,
            rookPosition,
            newPosition,
            isWhitesTurn ? 'whiteRook' : 'blackRook'
          );

          //TODO: do this for the other pieces
          possibleNodes = pushNewNode(possibleNodes, node, newBoardState, evalLogs, 0);
        }

        lastPosition = newPosition;

        if (isOccupiedComposite(allEnemyOccupiedPositions, newPosition)) {
          break;
        }
      }
    });
  });
  return possibleNodes;
}
