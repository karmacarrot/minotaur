import { LogBoardPositions } from '../../../test/helpers/testHelper';
import { LogLevels } from '../logging/definitions';
import { MultiLog } from '../logging/logger';

import { LoggerConfig } from '../logging/logger.config';
import { BitBoard, BitMove, Piece } from '../types';
import {
  allOnes,
  blackKingLongCastleRoute,
  blackKingShortCastleRoute,
  files,
  whiteKingLongCastleRoute,
  whiteKingShortCastleRoute,
} from './definitions';

export function applyMove(
  bitBoard: BitBoard,
  from: number,
  to: number,
  pieceBitBoard: keyof BitBoard
): BitBoard {
  let newBitBoard = { ...bitBoard };
  const fromMask = BigInt(1) << BigInt(64 - from);
  const toMask = BigInt(1) << BigInt(64 - to);

  MultiLog(
    LogLevels.info,
    `apply move to ${bigIntToBinaryString(bitBoard[pieceBitBoard])} from ${from} to ${to} `,
    LoggerConfig.verbosity
  );

  const fromMaskString = bigIntToBinaryString(fromMask);
  const toMaskString = bigIntToBinaryString(toMask);

  MultiLog(LogLevels.info, `from mask ${fromMaskString}`, LoggerConfig.verbosity);
  MultiLog(LogLevels.info, `to mask ${toMaskString}`, LoggerConfig.verbosity);

  newBitBoard = clearPosition(newBitBoard, to);

  newBitBoard[pieceBitBoard] = (newBitBoard[pieceBitBoard] & ~fromMask) | toMask;
  return newBitBoard;
}

export function clearPosition(bitBoard: BitBoard, position: number) {
  const removalMask = binaryMask64(position, 'all_ones_with_position_as_zero');
  const removalMaskString = bigIntToBinaryString(removalMask);
  MultiLog(LogLevels.warn, removalMaskString, LoggerConfig.verbosity);

  let newBitBoard = { ...bitBoard };
  for (let piece in newBitBoard) {
    let pieceBoard = newBitBoard[piece as keyof typeof newBitBoard];
    const pieceBoardString = bigIntToBinaryString(pieceBoard);
    MultiLog(LogLevels.info, `${piece} is ${pieceBoardString}`, LoggerConfig.verbosity);

    newBitBoard[piece as keyof typeof newBitBoard] = pieceBoard & removalMask;
  }
  return newBitBoard;
}

export function getBitBoardPosition(file: string, rank: number) {
  const fileNumber = files.indexOf(file);
  const minRank = (rank - 1) * 8;

  MultiLog(
    LogLevels.info,
    `position ${file}${rank} minrank: ${minRank} fileNumber: ${fileNumber} `,
    LoggerConfig.verbosity
  );

  return minRank + fileNumber + 1;
}

export function getFileAndRank(bitBoardPosition: number) {
  const zeroBasedPosition = bitBoardPosition - 1;

  const rank = Math.floor(zeroBasedPosition / 8) + 1;
  const fileIndex = zeroBasedPosition % 8;
  const file = files[fileIndex];

  return { file, rank };
}

export function bigIntToBinaryString(inputNumber: BigInt) {
  let binaryString = inputNumber.toString(2);
  const desiredWidth = 64;

  let paddedBinaryString = binaryString.padStart(desiredWidth, '0');

  return paddedBinaryString;
}

export function bitCount(bitboard: bigint) {
  let count = 0;
  for (let i = 0; i < 64; i++) {
    const checkBit = BigInt(1) << BigInt(i);

    if (bitboard & checkBit) {
      count += 1;
    }
  }
  return count;
}

export function binaryMask64(
  position: number,
  maskType: 'all_zeroes_with_position_as_one' | 'all_ones_with_position_as_zero'
): bigint {
  const binaryMask = BigInt(1) << BigInt(64 - position);
  if (maskType === 'all_zeroes_with_position_as_one') {
    return binaryMask;
  }
  MultiLog(LogLevels.info, bigIntToBinaryString(allOnes), LoggerConfig.verbosity);
  MultiLog(LogLevels.info, bigIntToBinaryString(binaryMask), LoggerConfig.verbosity);

  return allOnes & ~binaryMask;
}

export function occupiedBy(currentBoard: BitBoard, position: number): Piece {
  const queryMask = binaryMask64(position, 'all_zeroes_with_position_as_one');

  for (let piece in currentBoard) {
    let pieceBoard = currentBoard[piece as keyof typeof currentBoard];
    const foundPiece = pieceBoard & queryMask;
    if (foundPiece) {
      return piece as Piece;
    }
  }

  return null;
}

export function isOccupied(currentBoard: BitBoard, position: number): boolean {
  let compositePositions = allPositions(currentBoard);
  return isOccupiedComposite(compositePositions, position);
}

export function isOccupiedComposite(compositePositions: bigint, position: number): boolean {
  const queryMask = binaryMask64(position, 'all_zeroes_with_position_as_one');

  const foundPiece = compositePositions & queryMask;

  return !!foundPiece;
}

export function allPositions(currentBoard: BitBoard): bigint {
  let compositePositions = BigInt(0);

  for (let piece in currentBoard) {
    let pieceBoard = currentBoard[piece as keyof typeof currentBoard] as bigint;
    compositePositions = compositePositions | pieceBoard;
  }

  return compositePositions;
}

export function allWhitePositions(currentBoard: BitBoard): bigint {
  let compositePositions = BigInt(0);

  for (let piece in currentBoard) {
    if (piece.toLowerCase().includes('white')) {
      let pieceBoard = currentBoard[piece as keyof typeof currentBoard] as bigint;
      compositePositions = compositePositions | pieceBoard;
    }
  }

  return compositePositions;
}

export function allBlackPositions(currentBoard: BitBoard): bigint {
  let compositePositions = BigInt(0);

  for (let piece in currentBoard) {
    if (piece.toLowerCase().includes('black')) {
      let pieceBoard = currentBoard[piece as keyof typeof currentBoard] as bigint;
      compositePositions = compositePositions | pieceBoard;
    }
  }

  return compositePositions;
}

export function getMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove {
  if (
    (before.blackKing !== after.blackKing && before.blackRook !== after.blackRook) ||
    (before.whiteKing !== after.whiteKing && before.whiteRook !== after.whiteRook)
  ) {
    return getCastledMoveFromBoardStates(before, after);
  }
  return getSinglePieceMoveFromBoardStates(before, after);
}

export function getSinglePieceMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove {
  let move: BitMove = {
    from: 0,
    to: 0,
    piece: 'none',
    pieceTaken: 'none',
    score: 0,
    evaluations: 0,
    castleRookFrom: 0,
    castleRookTo: 0,
  };

  for (const piece of Object.keys(before) as (keyof BitBoard)[]) {
    if (piece === 'none') continue;

    const beforeBitboard = before[piece];
    const afterBitboard = after[piece];
    const pieceCountBefore = bitCount(beforeBitboard);
    const pieceCountAfter = bitCount(afterBitboard);

    if (pieceCountBefore > pieceCountAfter) {
      move.pieceTaken = piece;
    } else {
      if (beforeBitboard !== afterBitboard) {
        const movedFromBitboard = beforeBitboard & ~afterBitboard;
        const movedToBitboard = afterBitboard & ~beforeBitboard;

        if (movedFromBitboard) {
          move.from = findBitPositionReverse(movedFromBitboard);
          move.piece = piece;
        }
        if (movedToBitboard) {
          move.to = findBitPositionReverse(movedToBitboard);
        }
      }
    }
  }

  if (move.piece === 'whitePawn') {
    if (move.to - move.from !== 8 && move.to - move.from !== 16 && move.pieceTaken === 'none') {
      //must be en passant
      move.pieceTaken = 'blackPawn';
    }
  }
  if (move.piece === 'blackPawn') {
    if (move.from - move.to !== 8 && move.from - move.to !== 16 && move.pieceTaken === 'none') {
      //must be en passant
      move.pieceTaken = 'whitePawn';
    }
  }

  return move;
}

export function getBeforeAndAfterPositions(before: bigint, after: bigint): [number, number] {
  let beforePosition = 0,
    afterPosition = 0;

  if (before !== after) {
    const movedFromBitboard = before & ~after;
    const movedToBitboard = after & ~before;

    if (movedFromBitboard) {
      beforePosition = findBitPositionReverse(movedFromBitboard);
    }
    if (movedToBitboard) {
      afterPosition = findBitPositionReverse(movedToBitboard);
    }
  }

  return [beforePosition, afterPosition];
}

export function getCastledMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove {
  let move: BitMove = {
    from: 0,
    to: 0,
    piece: 'none',
    pieceTaken: 'none',
    score: 0,
    evaluations: 0,
    castleRookFrom: 0,
    castleRookTo: 0,
  };

  if (before.blackKing !== after.blackKing && before.blackRook !== after.blackRook) {
    //black castled
    move.piece = 'blackKing';
    const blackKingNewPosition = findBitPosition(after.blackKing);
    move.from = 61;
    move.to = blackKingNewPosition ? blackKingNewPosition : 0;
    const [beforeRook, afterRook] = getBeforeAndAfterPositions(before.blackRook, after.blackRook);
    move.castleRookFrom = beforeRook;
    move.castleRookTo = afterRook;
  }

  if (before.whiteKing !== after.whiteKing && before.whiteRook !== after.whiteRook) {
    //white castled
    move.piece = 'whiteKing';
    const whiteKingNewPosition = findBitPosition(after.whiteKing);
    move.from = 5;
    move.to = whiteKingNewPosition ? whiteKingNewPosition : 0;
    const [beforeRook, afterRook] = getBeforeAndAfterPositions(before.whiteRook, after.whiteRook);
    move.castleRookFrom = beforeRook;
    move.castleRookTo = afterRook;
  }

  return move;
}

export function findBitPositionReverse(bitboard: bigint) {
  let position = 63;
  let mask = BigInt(1) << BigInt(63);

  for (let i = 0; i < 64; i++) {
    if ((bitboard & mask) !== BigInt(0)) {
      position = i;
      break;
    }
    mask = mask >> BigInt(1);
  }

  return position + 1;
}

export function findBitPositions(bitboard: bigint) {
  let positionArray = [];
  let position = 63;
  let mask = BigInt(1) << BigInt(63);

  for (let i = 0; i < 64; i++) {
    if ((bitboard & mask) !== BigInt(0)) {
      position = i;
      positionArray.push(position + 1);
    }
    mask = mask >> BigInt(1);
  }

  return positionArray;
}

export function findBitPosition(bitboard: bigint) {
  let position = 63;
  let mask = BigInt(1) << BigInt(63);

  for (let i = 0; i < 64; i++) {
    if ((bitboard & mask) !== BigInt(0)) {
      position = i;
      return position + 1;
    }
    mask = mask >> BigInt(1);
  }
}

export function isAtoHwraparound(fromPosition: number, toPosition: number): boolean {
  const { file: fromFile } = getFileAndRank(fromPosition);
  const { file: toFile } = getFileAndRank(toPosition);

  return (fromFile! + toFile).includes('a') && (fromFile! + toFile).includes('h');
}

export function isABCtoFGHwraparound(fromPosition: number, toPosition: number): boolean {
  const { file: fromFile } = getFileAndRank(fromPosition);
  const { file: toFile } = getFileAndRank(toPosition);

  let leftSideFile = false;
  if (
    (fromFile! + toFile).includes('a') ||
    (fromFile! + toFile).includes('b') ||
    (fromFile! + toFile).includes('c')
  ) {
    leftSideFile = true;
  }
  let rightSideFile = false;
  if (
    (fromFile! + toFile).includes('f') ||
    (fromFile! + toFile).includes('g') ||
    (fromFile! + toFile).includes('h')
  ) {
    rightSideFile = true;
  }

  return leftSideFile && rightSideFile;
}

export function bitBoardsReadable(bitBoard: BitBoard) {
  return {
    whitePawn: bigIntToBinaryString(bitBoard.whitePawn),
    whiteKnight: bigIntToBinaryString(bitBoard.whiteKnight),
    whiteBishop: bigIntToBinaryString(bitBoard.whiteBishop),
    whiteRook: bigIntToBinaryString(bitBoard.whiteRook),
    whiteQueen: bigIntToBinaryString(bitBoard.whiteQueen),
    whiteKing: bigIntToBinaryString(bitBoard.whiteKing),

    blackPawn: bigIntToBinaryString(bitBoard.blackPawn),
    blackKnight: bigIntToBinaryString(bitBoard.blackKnight),
    blackBishop: bigIntToBinaryString(bitBoard.blackBishop),
    blackRook: bigIntToBinaryString(bitBoard.blackRook),
    blackQueen: bigIntToBinaryString(bitBoard.blackQueen),
    blackKing: bigIntToBinaryString(bitBoard.blackKing),
    none: bigIntToBinaryString(bitBoard.none),
  };
}

export function isShortCastleRouteBlocked(
  board: BitBoard,
  isWhitesTurn: boolean,
  enemyControlledSquares: bigint
) {
  const compositePositions = allPositions(board) | enemyControlledSquares;
  return !!(
    compositePositions & (isWhitesTurn ? whiteKingShortCastleRoute : blackKingShortCastleRoute)
  );
}

export function isLongCastleRouteBlocked(
  board: BitBoard,
  isWhitesTurn: boolean,
  enemyControlledSquares: bigint
): boolean {
  const compositePositions = allPositions(board) | enemyControlledSquares;
  const pathBlockingPositions = isWhitesTurn ? whiteKingLongCastleRoute : blackKingLongCastleRoute;

  return !!(compositePositions & pathBlockingPositions);
}
