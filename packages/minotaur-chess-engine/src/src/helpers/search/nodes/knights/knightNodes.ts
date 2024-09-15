import { EvalLogs, GameNode } from "../../../../types";
import {
  allBlackPositions,
  allWhitePositions,
  applyMove,
  binaryMask64,
  findBitPositions,
  isABCtoFGHwraparound,
  isOccupiedComposite,
} from "../../../bitboards";
import { knightMoveOffsets } from "../../../definitions";
import { pushNewNode } from "../nodeGenerators";

export function knightNodes(node: GameNode, evalLogs: EvalLogs): GameNode[] {
  let possibleNodes: GameNode[] = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const knightsToMove = isWhitesTurn
    ? node.boardState.whiteKnight
    : node.boardState.blackKnight;

  const allFriendlyOccupiedPositions = isWhitesTurn
    ? allWhitePositions(node.boardState)
    : allBlackPositions(node.boardState);

  if (evalLogs.evalLoggingEnabled) {
    evalLogs.evalAddNode(node, 1);
  }

  const knightPositions = findBitPositions(knightsToMove);
  knightPositions.forEach((knightPosition) => {
    knightMoveOffsets.forEach((offset) => {
      const potentialPosition = knightPosition + offset;
      if (potentialPosition > 64 || potentialPosition < 1) return;

      const knightToMove = binaryMask64(
        knightPosition,
        "all_zeroes_with_position_as_one"
      );
      //const knightOffset = knightToMove << BigInt(offset);
      const knightMoveFree = isOccupiedComposite(
        allFriendlyOccupiedPositions,
        potentialPosition
      );
      const wrappedAround = isABCtoFGHwraparound(
        knightPosition,
        potentialPosition
      );
      if (!knightMoveFree && !wrappedAround) {
        const newBoardState = applyMove(
          node.boardState,
          knightPosition,
          knightPosition + offset,
          isWhitesTurn ? "whiteKnight" : "blackKnight"
        );
        possibleNodes = pushNewNode(
          possibleNodes,
          node,
          newBoardState,
          evalLogs,
          0
        );
      }
    });
  });

  return possibleNodes;
}
