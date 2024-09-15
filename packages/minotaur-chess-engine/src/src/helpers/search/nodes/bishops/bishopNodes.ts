import { EvalLogs, GameNode } from "../../../../types";
import {
  allBlackPositions,
  allWhitePositions,
  applyMove,
  findBitPositions,
  isABCtoFGHwraparound,
  isOccupiedComposite,
} from "../../../bitboards";
import { diagonalOffsets } from "../../../definitions";
import { pushNewNode } from "../nodeGenerators";

export function bishopNodes(node: GameNode, evalLogs: EvalLogs): GameNode[] {
  let possibleNodes: GameNode[] = [];

  const isWhitesTurn = node.gameState.isWhitesTurn;
  const bishopsToMove = isWhitesTurn
    ? node.boardState.whiteBishop
    : node.boardState.blackBishop;

  const bishopPositions = findBitPositions(bishopsToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn
    ? allWhitePositions(node.boardState)
    : allBlackPositions(node.boardState);
  const allEnemyOccupiedPositions = isWhitesTurn
    ? allBlackPositions(node.boardState)
    : allWhitePositions(node.boardState);

  bishopPositions.forEach((bishopPosition) => {
    const offsets = diagonalOffsets;

    offsets.forEach((offset) => {
      let lastPosition = bishopPosition;

      for (
        let newPosition = bishopPosition + offset;
        newPosition >= 1 && newPosition <= 64;
        newPosition += offset
      ) {
        if (isABCtoFGHwraparound(lastPosition, newPosition)) {
          break;
        }

        if (isOccupiedComposite(allFriendlyOccupiedPositions, newPosition)) {
          break;
        }

        if (!isOccupiedComposite(allFriendlyOccupiedPositions, newPosition)) {
          const newBoardState = applyMove(
            node.boardState,
            bishopPosition,
            newPosition,
            isWhitesTurn ? "whiteBishop" : "blackBishop"
          );
          possibleNodes = pushNewNode(
            possibleNodes,
            node,
            newBoardState,
            evalLogs,
            0
          );
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
