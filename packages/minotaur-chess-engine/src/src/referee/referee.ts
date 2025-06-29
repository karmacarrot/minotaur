import { BitBoard, BoardMove, CheckStatus, GameStatus, LegalityResponse } from '../types';
import { blackStartingRank, files, whiteStartingRank } from '../helpers/definitions';
import { MultiLog } from '../logging/logger';
import { LogLevels } from '../logging/definitions';
import { LoggerConfig } from '../logging/logger.config';
import {
  allBlackPositions,
  allWhitePositions,
  binaryMask64,
  getBitBoardPosition,
  occupiedBy,
} from '../helpers/bitboards';
import {
  AllBishopMoves,
  AllCompiledMoves,
  AllKingMoves,
  AllKnightMoves,
  AllQueenMoves,
  AllRookMoves,
} from '../helpers/moveEval';
import { memoize } from '../helpers/cache/cacheHelper';
import { canCastle } from '../helpers/rules/castling';
import { pawnsThatCanCaptureEnpassant } from '../helpers/rules/enpassant';

export function isLegalMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  proposedBoardState: BitBoard,
  gameState: GameStatus
): LegalityResponse {
  if (
    moveAttempted.FileFrom === moveAttempted.FileTo &&
    moveAttempted.RankFrom === moveAttempted.RankTo
  ) {
    return { isLegal: false, reason: 'no move detected' };
  }
  const evaluateForWhite = moveAttempted.PieceMoved
    ? moveAttempted.PieceMoved.includes('white')
    : false;

  const movingPlayerCurrentCheckStatus = isOpponentCheckedMemo(boardState, !evaluateForWhite);

  const movingPlayerProposedCheckStatus = isOpponentCheckedMemo(
    proposedBoardState,
    !evaluateForWhite
  );

  if (movingPlayerCurrentCheckStatus.check && movingPlayerProposedCheckStatus.check) {
    return { isLegal: false, reason: 'need to move out of check' };
  }
  if (!movingPlayerCurrentCheckStatus.check && movingPlayerProposedCheckStatus.check) {
    return { isLegal: false, reason: "can't move into check" };
  }
  const bitMove = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const bitMoveMask = binaryMask64(bitMove, 'all_zeroes_with_position_as_one');
  const friendlyPositions = evaluateForWhite
    ? allWhitePositions(boardState)
    : allBlackPositions(boardState);
  const enemyPositions = evaluateForWhite
    ? allBlackPositions(boardState)
    : allWhitePositions(boardState);

  if ((bitMoveMask & friendlyPositions) > BigInt(0)) {
    return { isLegal: false, reason: "can't take your own pieces" };
  }

  if (
    moveAttempted.PieceMoved === 'blackKing' &&
    moveAttempted.FileFrom === 'e' &&
    moveAttempted.FileTo === 'g'
  ) {
    const isLegalCastle = canCastle(
      boardState,
      gameState.blackKingCanCastleShort && !gameState.blackKingChecked,
      false,
      true
    );
    return { isLegal: isLegalCastle, reason: 'castling rules checked' };
  }
  if (
    moveAttempted.PieceMoved === 'blackKing' &&
    moveAttempted.FileFrom === 'e' &&
    moveAttempted.FileTo === 'c'
  ) {
    const isLegalCastle = canCastle(
      boardState,
      gameState.blackKingCanCastleLong && !gameState.blackKingChecked,
      false,
      false
    );
    return { isLegal: isLegalCastle, reason: 'castling rules checked' };
  }
  if (
    moveAttempted.PieceMoved === 'whiteKing' &&
    moveAttempted.FileFrom === 'e' &&
    moveAttempted.FileTo === 'g'
  ) {
    const isLegalCastle = canCastle(
      boardState,
      gameState.whiteKingCanCastleShort && !gameState.whiteKingChecked,
      true,
      true
    );
    return { isLegal: isLegalCastle, reason: 'castling rules checked' };
  }
  if (
    moveAttempted.PieceMoved === 'whiteKing' &&
    moveAttempted.FileFrom === 'e' &&
    moveAttempted.FileTo === 'c'
  ) {
    const isLegalCastle = canCastle(
      boardState,
      gameState.whiteKingCanCastleLong && !gameState.whiteKingChecked,
      true,
      false
    );
    return { isLegal: isLegalCastle, reason: 'castling rules checked' };
  }

  switch (moveAttempted.PieceMoved) {
    case 'whitePawn':
    case 'blackPawn':
      return {
        isLegal: isLegalPawnMove(moveAttempted, boardState, gameState),
        reason: 'piece move rules evaluation',
      };
    case 'whiteQueen':
    case 'blackQueen':
      return {
        isLegal: isLegalQueenMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: 'piece move rules evaluation',
      };
    case 'whiteRook':
    case 'blackRook':
      return {
        isLegal: isLegalRookMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: 'piece move rules evaluation',
      };
    case 'whiteKnight':
    case 'blackKnight':
      return {
        isLegal: isLegalKnightMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: 'piece move rules evaluation',
      };
    case 'whiteBishop':
    case 'blackBishop':
      return {
        isLegal: isLegalBishopMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: 'piece move rules evaluation',
      };
    case 'whiteKing':
    case 'blackKing':
      return {
        isLegal: isLegalKingMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: 'piece move rules evaluation',
      };
    default:
      return { isLegal: true, reason: 'fill your boots' };
  }
}

export function isLegalQueenMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  evaluateForWhite: boolean,
  friendlyPositions: bigint,
  enemyPositions: bigint
) {
  const destinationPosition = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);

  if (destinationOccupiedBy?.includes('King')) {
    return false;
  }
  const destinationMask = binaryMask64(destinationPosition, 'all_zeroes_with_position_as_one');
  const allPossibleQueenMoves = AllQueenMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );

  return (allPossibleQueenMoves & destinationMask) > BigInt(0);
}

export function isLegalKingMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  evaluateForWhite: boolean,
  friendlyPositions: bigint,
  enemyPositions: bigint
) {
  //TODO: stop movements into check
  //TODO: implement castling
  const destinationPosition = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);

  if (destinationOccupiedBy?.includes('King')) {
    return false;
  }
  const destinationMask = binaryMask64(destinationPosition, 'all_zeroes_with_position_as_one');
  const allPossibleKingMoves = AllKingMoves(boardState, friendlyPositions, evaluateForWhite);

  return (allPossibleKingMoves & destinationMask) > BigInt(0);
}

export function isLegalRookMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  evaluateForWhite: boolean,
  friendlyPositions: bigint,
  enemyPositions: bigint
) {
  const destinationPosition = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);

  if (destinationOccupiedBy?.includes('King')) {
    return false;
  }
  const destinationMask = binaryMask64(destinationPosition, 'all_zeroes_with_position_as_one');
  const allPossibleRookMoves = AllRookMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );

  return (allPossibleRookMoves & destinationMask) > BigInt(0);
}

export function isLegalBishopMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  evaluateForWhite: boolean,
  friendlyPositions: bigint,
  enemyPositions: bigint
) {
  const destinationPosition = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);

  if (destinationOccupiedBy?.includes('King')) {
    return false;
  }
  const destinationMask = binaryMask64(destinationPosition, 'all_zeroes_with_position_as_one');
  const allPossibleBishopMoves = AllBishopMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );

  return (allPossibleBishopMoves & destinationMask) > BigInt(0);
}

export function isLegalKnightMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  evaluateForWhite: boolean,
  friendlyPositions: bigint,
  enemyPositions: bigint
) {
  const destinationPosition = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);

  if (destinationOccupiedBy?.includes('King')) {
    return false;
  }
  const destinationMask = binaryMask64(destinationPosition, 'all_zeroes_with_position_as_one');
  const allPossibleKnightMoves = AllKnightMoves(boardState, friendlyPositions, evaluateForWhite);

  return (allPossibleKnightMoves & destinationMask) > BigInt(0);
}

export function isLegalPawnMove(
  moveAttempted: BoardMove,
  boardState: BitBoard,
  gameState: GameStatus
) {
  if (moveAttempted.PieceMoved === 'whitePawn' && moveAttempted.RankFrom >= moveAttempted.RankTo) {
    //TODO: user log output rule violation (can't move backwards)
    return false;
  }
  if (moveAttempted.PieceMoved === 'blackPawn' && moveAttempted.RankTo >= moveAttempted.RankFrom) {
    //TODO: user log output rule violation (can't move backwards)
    return false;
  }
  const startPosition = getBitBoardPosition(moveAttempted.FileFrom, moveAttempted.RankFrom);
  const destinationPosition = getBitBoardPosition(moveAttempted.FileTo, moveAttempted.RankTo);
  const ranksMoved = Math.abs(moveAttempted.RankFrom - moveAttempted.RankTo);
  const startingRank = isOnStartingRank(moveAttempted);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);

  // MultiLog(
  //   LogLevels.log,
  //   `${startingRank}, ${ranksMoved}, ${moveAttempted.PieceMoved})}`,
  //   LoggerConfig.verbosity
  // );

  if (!startingRank && ranksMoved != 1) {
    return false;
  }
  if (startingRank && ranksMoved !== 1 && ranksMoved !== 2) {
    return false;
  }

  //check for valid capture
  if (moveAttempted.FileFrom != moveAttempted.FileTo) {
    const indexOfFileFrom = files.indexOf(moveAttempted.FileFrom);
    const indexOfFileTo = files.indexOf(moveAttempted.FileTo);

    if (indexOfFileTo === indexOfFileFrom - 1 || indexOfFileTo === indexOfFileFrom + 1) {
      //it's an adjacent file
      //if it's adjacent, is there an enemy piece that isn't the king there?
      if (destinationOccupiedBy?.includes('King') || destinationOccupiedBy == null) {
        const enPassantPawns = pawnsThatCanCaptureEnpassant(boardState, gameState);
        const enPassantMask = binaryMask64(startPosition, 'all_zeroes_with_position_as_one');
        const wasEnPassantPossible = (enPassantPawns & enPassantMask) > BigInt(0);

        return wasEnPassantPossible;
      }
    }
  } else {
    //just a forward move, check not occupied
    if (destinationOccupiedBy != null) {
      return false;
    }
  }

  return true;
}

export function isOnStartingRank(moveAttempted: BoardMove) {
  return (
    (moveAttempted.PieceMoved === 'whitePawn' && moveAttempted.RankFrom === whiteStartingRank) ||
    (moveAttempted.PieceMoved === 'blackPawn' && moveAttempted.RankFrom === blackStartingRank)
  );
}

export function isMyKingInCheck(currentBoard: BitBoard, evaluateForWhite: boolean): CheckStatus {
  return isOpponentChecked(currentBoard, !evaluateForWhite);
}

export function isOpponentChecked(currentBoard: BitBoard, evaluateForWhite: boolean): CheckStatus {
  let check = false;
  let checkMate = false;

  const allMoves = AllCompiledMoves(currentBoard, evaluateForWhite, true);

  check =
    (allMoves & (evaluateForWhite ? currentBoard.blackKing : currentBoard.whiteKing)) > BigInt(0);

  return { check, checkMate };
}

export const isOpponentCheckedMemo = memoize(isOpponentChecked);
