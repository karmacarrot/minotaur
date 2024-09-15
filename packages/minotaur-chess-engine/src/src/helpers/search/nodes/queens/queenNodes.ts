import { EvalLogs, GameNode } from "../../../../types";
import {
  allBlackPositions,
  allWhitePositions,
  applyMove,
  findBitPositions,
  isABCtoFGHwraparound,
  isOccupiedComposite,
} from "../../../bitboards";
import { diagonalOffsets, orthagonalOffsets } from "../../../definitions";
import { pushNewNode } from "../nodeGenerators";

export function queenNodes(node: GameNode, evalLogs: EvalLogs): GameNode[] {
  let possibleNodes: GameNode[] = [];

  const isWhitesTurn = node.gameState.isWhitesTurn;
  const queensToMove = isWhitesTurn
    ? node.boardState.whiteQueen
    : node.boardState.blackQueen;

  const queenPositions = findBitPositions(queensToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn
    ? allWhitePositions(node.boardState)
    : allBlackPositions(node.boardState);
  const allEnemyOccupiedPositions = isWhitesTurn
    ? allBlackPositions(node.boardState)
    : allWhitePositions(node.boardState);

  queenPositions.forEach((queenPosition) => {
    const offsets = [...orthagonalOffsets, ...diagonalOffsets];

    offsets.forEach((offset) => {
      let lastPosition = queenPosition;

      for (
        let newPosition = queenPosition + offset;
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
            queenPosition,
            newPosition,
            isWhitesTurn ? "whiteQueen" : "blackQueen"
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
