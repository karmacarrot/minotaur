import { BitBoard } from '../../types';
import { clearPosition, isLongCastleRouteBlocked, isShortCastleRouteBlocked } from '../bitboards';
import { evaluateSquareControl } from '../boardevaluation/boardEval';
import {
  blackKingLongCastleDestination,
  blackKingLongCastleRookDestination,
  blackKingShortCastleDestination,
  blackKingShortCastleRookDestination,
  whiteKingLongCastleDestination,
  whiteKingLongCastleRookDestination,
  whiteKingShortCastleDestination,
  whiteKingShortCastleRookDestination,
} from '../definitions';

export function canCastle(
  boardState: BitBoard,
  kingCanCastle: boolean,
  isWhitesTurn: boolean,
  isShortCastle: boolean
): boolean {
  if (!kingCanCastle) {
    return false;
  }

  const enemyControlledSquares = evaluateSquareControl(boardState, !isWhitesTurn);

  const isPathOccupied = isShortCastle
    ? isShortCastleRouteBlocked(boardState, isWhitesTurn, enemyControlledSquares)
    : isLongCastleRouteBlocked(boardState, isWhitesTurn, enemyControlledSquares);

  if (isPathOccupied) {
    return false;
  }

  const newBoard = { ...boardState };
  if (isWhitesTurn) {
    if (isShortCastle) {
      newBoard.whiteKing = whiteKingShortCastleDestination;
      newBoard.whiteRook = clearPosition(newBoard, 8).whiteRook;
      newBoard.whiteRook |= whiteKingShortCastleRookDestination;
      return true;
    } else {
      newBoard.whiteKing = whiteKingLongCastleDestination;
      newBoard.whiteRook = clearPosition(newBoard, 1).whiteRook;
      newBoard.whiteRook |= whiteKingLongCastleRookDestination;
      return true;
    }
  } else {
    if (isShortCastle) {
      newBoard.blackKing = blackKingShortCastleDestination;
      newBoard.blackRook = clearPosition(newBoard, 64).blackRook;
      newBoard.blackRook |= blackKingShortCastleRookDestination;
      return true;
    } else {
      newBoard.blackKing = blackKingLongCastleDestination;
      newBoard.blackRook = clearPosition(newBoard, 57).blackRook;
      newBoard.blackRook |= blackKingLongCastleRookDestination;
      return true;
    }
  }
}
