import { BitBoard } from '../../../src/types';
import { allBlackPositions, allWhitePositions, bitCount } from '../bitboards';
import {
  CentralDominanceWeightings,
  EvalWeightings,
  RankWeightings,
  StartingBoard,
  aTogFilesOnly,
  allOnes,
  bTohFilesOnly,
  blackKingLongCastleDestination,
  blackKingLongCastleRookDestination,
  blackKingShortCastleDestination,
  blackKingShortCastleRookDestination,
  blackPawnLongGuards,
  blackPawnShortGuards,
  pieceValues,
} from '../definitions';
import {
  AllBishopMoves,
  AllBlackPawnCaptures,
  AllBlackPawnMovesComposite,
  AllKingMoves,
  AllKnightMoves,
  AllQueenMoves,
  AllRookMoves,
  AllWhitePawnCaptures,
  AllWhitePawnMovesComposite,
  BlackPawnCaptures,
  BlackPawnMovesComposite,
  WhitePawnCaptures,
  WhitePawnMovesComposite,
} from '../moveEval';

export function evaluateBoard(currentBoard: BitBoard, evaluateForWhite: boolean) {
  let score = 0;

  score += evaluateMaterialAdvantages(currentBoard, evaluateForWhite);
  score += evaluatePositionalAdvantages(currentBoard, evaluateForWhite);
  score += evaluatePromotionalPossibilities(
    evaluateForWhite ? currentBoard.whitePawn : currentBoard.blackPawn,
    evaluateForWhite
  );
  score += evaluatePawnChains(
    evaluateForWhite ? currentBoard.whitePawn : currentBoard.blackPawn,
    evaluateForWhite
  );
  score += evaluatePieceDevelopment(currentBoard, evaluateForWhite);
  score += evaluateFreedomToMove(currentBoard, evaluateForWhite);
  score += evaluateKingSafety(currentBoard, evaluateForWhite);

  return score;
}

export function evaluateMaterialAdvantages(currentBoard: BitBoard, evaluateForWhite: boolean) {
  let whiteScore = 0,
    blackScore = 0;

  whiteScore += bitCount(currentBoard.whitePawn) * pieceValues.pawn;
  blackScore += bitCount(currentBoard.blackPawn) * pieceValues.pawn;

  whiteScore += bitCount(currentBoard.whiteRook) * pieceValues.rook;
  blackScore += bitCount(currentBoard.blackRook) * pieceValues.rook;

  whiteScore += bitCount(currentBoard.whiteKnight) * pieceValues.knight;
  blackScore += bitCount(currentBoard.blackKnight) * pieceValues.knight;

  whiteScore += bitCount(currentBoard.whiteBishop) * pieceValues.bishop;
  blackScore += bitCount(currentBoard.blackBishop) * pieceValues.bishop;

  whiteScore += bitCount(currentBoard.whiteQueen) * pieceValues.queen;
  blackScore += bitCount(currentBoard.blackQueen) * pieceValues.queen;

  if (evaluateForWhite) {
    return whiteScore - blackScore;
  }
  return blackScore - whiteScore;
}

export function evaluatePositionalAdvantages(currentBoard: BitBoard, evaluateForWhite: boolean) {
  let whiteScore = 0,
    blackScore = 0;

  whiteScore += evaluateCentralDominanceAdvantages(
    currentBoard.whitePawn,
    evaluateForWhite,
    'whitePawn'
  );

  blackScore += evaluateCentralDominanceAdvantages(
    currentBoard.blackPawn,
    evaluateForWhite,
    'blackPawn'
  );

  if (evaluateForWhite) {
    return whiteScore - blackScore;
  }
  return blackScore - whiteScore;
}

export function evaluateCentralDominanceAdvantages(
  pieceBitBoard: bigint,
  evaluateForWhite: boolean,
  piece: keyof BitBoard
) {
  let score = 0;

  const evalAbsoluteCentre = CentralDominanceWeightings.absoluteCentre & pieceBitBoard;
  score += bitCount(evalAbsoluteCentre) * EvalWeightings.absoluteCentreWeight;

  const evalInnerRing = CentralDominanceWeightings.innerRing & pieceBitBoard;
  score += bitCount(evalInnerRing) * EvalWeightings.innerRingWeight;

  const evalOuterRing = CentralDominanceWeightings.outerRing & pieceBitBoard;
  score += bitCount(evalOuterRing) * EvalWeightings.outerRingWeight;

  return score;
}

export function evaluatePromotionalPossibilities(pawnBitBoard: bigint, evaluateForWhite: boolean) {
  let score = 0;

  if (evaluateForWhite) {
    const evalSeventhRankPawns = RankWeightings.seventhRank & pawnBitBoard;
    return bitCount(evalSeventhRankPawns) * EvalWeightings.oneMoveUntilPromotionWeight;
  }

  const evalSecondRankPawns = RankWeightings.secondRank & pawnBitBoard;
  return bitCount(evalSecondRankPawns) * EvalWeightings.oneMoveUntilPromotionWeight;
}

export function evaluatePawnChains(pawnBitBoard: bigint, evaluateForWhite: boolean) {
  let rightDiagonalShift, leftDiagonalShift;

  if (evaluateForWhite) {
    rightDiagonalShift = (pawnBitBoard & aTogFilesOnly) >> BigInt(7);
    leftDiagonalShift = (pawnBitBoard & bTohFilesOnly) >> BigInt(9);
  } else {
    rightDiagonalShift = (pawnBitBoard & bTohFilesOnly) << BigInt(7);
    leftDiagonalShift = (pawnBitBoard & aTogFilesOnly) << BigInt(9);
  }

  const rightChainPawns = rightDiagonalShift & pawnBitBoard;
  const leftChainPawns = leftDiagonalShift & pawnBitBoard;

  const rightChainCount = bitCount(rightChainPawns);
  const leftChainCount = bitCount(leftChainPawns);

  return (rightChainCount + leftChainCount) * EvalWeightings.pawnChainWeight;
}

export function evaluatePieceDevelopment(currentBoard: BitBoard, evaluateForWhite: boolean) {
  let developmentScore = 0;

  /////////Check knights
  const startingKnights = evaluateForWhite ? StartingBoard.whiteKnight : StartingBoard.blackKnight;
  const currentKnights = evaluateForWhite ? currentBoard.whiteKnight : currentBoard.blackKnight;
  const everywhereButStartingPositionsForKnights = ~startingKnights;
  const movedKnightPositions = currentKnights & everywhereButStartingPositionsForKnights;
  const movedKnightCount = bitCount(movedKnightPositions);
  developmentScore += movedKnightCount * EvalWeightings.developedBishopKnight;

  /////////Check bishops
  const startingBishops = evaluateForWhite ? StartingBoard.whiteBishop : StartingBoard.blackBishop;
  const currentBishops = evaluateForWhite ? currentBoard.whiteBishop : currentBoard.blackBishop;
  const everywhereButStartingPositionsForBishops = ~startingBishops;
  const movedBishopPositions = currentBishops & everywhereButStartingPositionsForBishops;
  const movedBishopCount = bitCount(movedBishopPositions);
  developmentScore += movedBishopCount * EvalWeightings.developedBishopKnight;

  /////////Check rooks
  const startingRooks = evaluateForWhite ? StartingBoard.whiteRook : StartingBoard.blackRook;
  const currentRooks = evaluateForWhite ? currentBoard.whiteRook : currentBoard.blackRook;
  const everywhereButStartingPositionsForRooks = ~startingRooks;
  const movedRookPositions = currentRooks & everywhereButStartingPositionsForRooks;
  const movedRookCount = bitCount(movedRookPositions);
  developmentScore += movedRookCount * EvalWeightings.developedRook;

  return developmentScore;
}

export function evaluateFreedomToMove(currentBoard: BitBoard, evaluateForWhite: boolean) {
  let freedomToMove = 0;
  const friendlyPieces = evaluateForWhite
    ? allWhitePositions(currentBoard)
    : allBlackPositions(currentBoard);
  const enemyPieces = evaluateForWhite
    ? allBlackPositions(currentBoard)
    : allWhitePositions(currentBoard);
  const knightMoves = AllKnightMoves(currentBoard, friendlyPieces, evaluateForWhite);
  const bishopMoves = AllBishopMoves(currentBoard, friendlyPieces, enemyPieces, evaluateForWhite);
  const rookMoves = AllRookMoves(currentBoard, friendlyPieces, enemyPieces, evaluateForWhite);
  const queenMoves = AllQueenMoves(currentBoard, friendlyPieces, enemyPieces, evaluateForWhite);
  const kingMoves = AllKingMoves(currentBoard, friendlyPieces, evaluateForWhite);
  const pawnMoves = evaluateForWhite
    ? AllBlackPawnMovesComposite(currentBoard).blackPawn
    : AllWhitePawnMovesComposite(currentBoard).whitePawn;

  freedomToMove += EvalWeightings.freedomToMove * bitCount(knightMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(bishopMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(rookMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(queenMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(kingMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(pawnMoves);
  return freedomToMove;
}

export function evaluateSquareControl(currentBoard: BitBoard, evaluateForWhite: boolean): bigint {
  let controlledSquares = BigInt(0);
  const friendlyPieces = evaluateForWhite
    ? allWhitePositions(currentBoard)
    : allBlackPositions(currentBoard);
  const enemyPieces = evaluateForWhite
    ? allBlackPositions(currentBoard)
    : allWhitePositions(currentBoard);
  const knightMoves = AllKnightMoves(currentBoard, friendlyPieces, evaluateForWhite);
  const bishopMoves = AllBishopMoves(currentBoard, friendlyPieces, enemyPieces, evaluateForWhite);
  const rookMoves = AllRookMoves(currentBoard, friendlyPieces, enemyPieces, evaluateForWhite);
  const queenMoves = AllQueenMoves(currentBoard, friendlyPieces, enemyPieces, evaluateForWhite);
  const kingMoves = AllKingMoves(currentBoard, friendlyPieces, evaluateForWhite);
  const pawnMoves = evaluateForWhite
    ? AllWhitePawnCaptures(currentBoard, allOnes)
    : AllBlackPawnCaptures(currentBoard, allOnes);

  controlledSquares |= knightMoves;
  controlledSquares |= bishopMoves;
  controlledSquares |= rookMoves;
  controlledSquares |= queenMoves;
  controlledSquares |= kingMoves;
  controlledSquares |= pawnMoves;
  return controlledSquares;
}

export function evaluateKingSafety(currentBoard: BitBoard, evaluateForWhite: boolean) {
  //TODO: this is too crude and will need to consider more nuanced safe positions

  if (evaluateForWhite) {
    return 0; //TODO: implement for white
  } else {
    const blackKingIsLong = !!(currentBoard.blackKing & blackKingLongCastleDestination);
    const blackPawnsProtectLong =
      (currentBoard.blackPawn & blackPawnLongGuards) === blackPawnLongGuards;
    const blackRookHasCastledLong = !!(currentBoard.blackRook & blackKingLongCastleRookDestination);

    if (blackKingIsLong && blackPawnsProtectLong && blackRookHasCastledLong) {
      return EvalWeightings.safeKing;
    }

    const blackKingIsShort = !!(currentBoard.blackKing & blackKingShortCastleDestination);
    const blackPawnsProtectShort =
      (currentBoard.blackPawn & blackPawnShortGuards) === blackPawnShortGuards;
    const blackRookHasCastledShort = !!(
      currentBoard.blackRook & blackKingShortCastleRookDestination
    );

    if (blackKingIsShort && blackPawnsProtectShort && blackRookHasCastledShort) {
      return EvalWeightings.safeKing;
    }
  }
  return 0;
}
