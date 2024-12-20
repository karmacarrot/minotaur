import { isMyKingInCheck } from '../../../../referee/referee';
import { EvalLogs, GameNode } from '../../../../types';
import {
  allBlackPositions,
  allWhitePositions,
  applyMove,
  clearPosition,
  findBitPositions,
  isAtoHwraparound,
  isLongCastleRouteBlocked,
  isOccupiedComposite,
  isShortCastleRouteBlocked,
} from '../../../bitboards';
import { evaluateSquareControl } from '../../../boardevaluation/boardEval';
import {
  blackKingLongCastleDestination,
  blackKingLongCastleRookDestination,
  blackKingLongRook,
  blackKingShortCastleDestination,
  blackKingShortCastleRookDestination,
  blackKingShortRook,
  diagonalOffsets,
  orthagonalOffsets,
  whiteKingLongCastleDestination,
  whiteKingLongCastleRookDestination,
  whiteKingLongRook,
  whiteKingShortCastleDestination,
  whiteKingShortCastleRookDestination,
  whiteKingShortRook,
} from '../../../definitions';
import { NodeFactory } from '../nodeGenerators';

export function kingNodes(node: GameNode, evalLogs: EvalLogs): GameNode[] {
  let possibleNodes: GameNode[] = [];

  const isWhitesTurn = node.gameState.isWhitesTurn;
  const kingToMove = isWhitesTurn ? node.boardState.whiteKing : node.boardState.blackKing;

  const kingPositions = findBitPositions(kingToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn
    ? allWhitePositions(node.boardState)
    : allBlackPositions(node.boardState);

  kingPositions.forEach((kingPosition) => {
    const offsets = [...diagonalOffsets, ...orthagonalOffsets];

    offsets.forEach((offset) => {
      const lastPosition = kingPosition;
      const newPosition = kingPosition + offset;
      if (newPosition < 1 || newPosition > 64) {
        return;
      }
      if (
        !isOccupiedComposite(allFriendlyOccupiedPositions, newPosition) &&
        !isAtoHwraparound(lastPosition, newPosition)
      ) {
        const newBoardState = applyMove(
          node.boardState,
          kingPosition,
          newPosition,
          isWhitesTurn ? 'whiteKing' : 'blackKing'
        );
        if (!isMyKingInCheck(newBoardState, isWhitesTurn).check) {
          const newKingNode = NodeFactory(node, newBoardState);
          possibleNodes.push(newKingNode);
          if (evalLogs.evalLoggingEnabled) {
            evalLogs.evalAddNode(newKingNode, 0);
          }
        }
      }
    });
  });
  return possibleNodes;
}

export function kingCastlingNodes(node: GameNode, evalLogs: EvalLogs): GameNode[] {
  let possibleNodes: GameNode[] = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;

  let kingCanLong = isWhitesTurn
    ? node.gameState.whiteKingCanCastleLong && !node.gameState.whiteKingChecked
    : node.gameState.blackKingCanCastleLong && !node.gameState.blackKingChecked;
  let kingCanShort = isWhitesTurn
    ? node.gameState.whiteKingCanCastleShort && !node.gameState.whiteKingChecked
    : node.gameState.blackKingCanCastleShort && !node.gameState.blackKingChecked;

  if (!kingCanLong && !kingCanShort) {
    return possibleNodes;
  }
  //TODO: check we aren't moving through or into check

  const enemyControlledSquares = evaluateSquareControl(node.boardState, !isWhitesTurn);

  if (isWhitesTurn && (node.boardState.whiteRook & whiteKingLongRook) === BigInt(0)) {
    kingCanLong = false;
  }
  if (isWhitesTurn && (node.boardState.whiteRook & whiteKingShortRook) === BigInt(0)) {
    kingCanShort = false;
  }
  if (!isWhitesTurn && (node.boardState.blackRook & blackKingLongRook) === BigInt(0)) {
    kingCanLong = false;
  }
  if (!isWhitesTurn && (node.boardState.blackRook & blackKingShortRook) === BigInt(0)) {
    kingCanShort = false;
  }

  if (kingCanShort) {
    const isShortPathOccupied = isShortCastleRouteBlocked(
      node.boardState,
      isWhitesTurn,
      enemyControlledSquares
    );
    if (!isShortPathOccupied) {
      const newBoard = { ...node.boardState };
      if (isWhitesTurn) {
        newBoard.whiteKing = whiteKingShortCastleDestination;
        newBoard.whiteRook = clearPosition(newBoard, 8).whiteRook;
        newBoard.whiteRook = newBoard.whiteRook | whiteKingShortCastleRookDestination;
      } else {
        newBoard.blackKing = blackKingShortCastleDestination;
        newBoard.blackRook = clearPosition(newBoard, 64).blackRook;
        newBoard.blackRook = newBoard.blackRook | blackKingShortCastleRookDestination;
      }

      const newKingNode = NodeFactory(node, newBoard);

      possibleNodes.push(newKingNode);
      if (evalLogs.evalLoggingEnabled) {
        evalLogs.evalAddNode(newKingNode, 0);
      }
    }
  }

  if (kingCanLong) {
    const isLongPathOccupied = isLongCastleRouteBlocked(
      node.boardState,
      isWhitesTurn,
      enemyControlledSquares
    );
    if (!isLongPathOccupied) {
      const newBoard = { ...node.boardState };
      if (isWhitesTurn) {
        newBoard.whiteKing = whiteKingLongCastleDestination;
        newBoard.whiteRook = clearPosition(newBoard, 1).whiteRook;
        newBoard.whiteRook = newBoard.whiteRook | whiteKingLongCastleRookDestination;
      } else {
        newBoard.blackKing = blackKingLongCastleDestination;
        newBoard.blackRook = clearPosition(newBoard, 57).blackRook;
        newBoard.blackRook = newBoard.blackRook | blackKingLongCastleRookDestination;
      }
      const newKingNode = NodeFactory(node, newBoard);

      possibleNodes.push(newKingNode);
      if (evalLogs.evalLoggingEnabled) {
        evalLogs.evalAddNode(newKingNode, 0);
      }
    }
  }

  return possibleNodes;
}
