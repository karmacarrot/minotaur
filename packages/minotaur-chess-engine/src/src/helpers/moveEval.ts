import {
  BitBoard,
  BitMove,
  GameStatus,
  Piece,
  Score,
  ScoreArray,
} from "../types";
import {
  allBlackPositions,
  allPositions,
  allWhitePositions,
  applyMove,
  binaryMask64,
  findBitPositions,
  isABCtoFGHwraparound,
  isAtoHwraparound,
  isOccupiedComposite,
} from "./bitboards";
import { evaluateBoard } from "./boardevaluation/boardEval";
import {
  EmptyBoard,
  StartingBoard,
  aTogFilesOnly,
  bTohFilesOnly,
  diagonalOffsets,
  evalLoggingOff,
  knightMoveOffsets,
  orthagonalOffsets,
} from "./definitions";
import { maxMove } from "./search/minimax";
import { generateNodeId } from "./search/nodes/nodeGenerators";

/**
 * @deprecated The method should not be used
 */
export function FindBestMoves(
  currentBoard: BitBoard,
  isWhitesTurn: boolean
): ScoreArray {
  const legalMoves = generateLegalMoves(currentBoard, isWhitesTurn);

  const moveScores: ScoreArray = [];
  console.log(`legal moves: ${legalMoves}`);
  for (let possibleMove of legalMoves) {
    const moveResult = evaluateMove(currentBoard, possibleMove, isWhitesTurn);
    moveScores.push({
      score: moveResult.score,
      move: possibleMove,
      boardState: moveResult.boardState,
    });
  }

  moveScores.sort((a, b) => b.score - a.score);
  return moveScores.slice(0, 3);
}

export async function FindBestMoveMiniMax(
  currentBoard: BitBoard,
  currentGameState: GameStatus,
  engineDepth: number
): Promise<BitMove> {
  const currentNode = {
    boardState: currentBoard,
    gameState: currentGameState,
    parentId: "",
    id: generateNodeId(),
  };
  const bestMove = maxMove(
    currentNode,
    engineDepth,
    currentGameState.isWhitesTurn,
    evalLoggingOff
  );
  return bestMove;
}

/**
 * @deprecated The method should not be used
 */
function generateLegalMoves(currentBoard: BitBoard, isWhitesTurn: boolean) {
  if (isWhitesTurn) {
    const whitePawns = WhitePawnMovesComposite(currentBoard);
    //TODO: add other pieces
    return whitePawns;
  }
  const blackPawns = BlackPawnMovesComposite(currentBoard);
  //TODO: add other pieces
  return blackPawns;
}

function evaluateMove(
  currentBoard: BitBoard,
  move: BitMove,
  evaluateForWhite: boolean
): Score {
  let newBoard = { ...currentBoard };
  newBoard = applyMove(currentBoard, move.from, move.to, move.piece);
  return {
    boardState: currentBoard,
    move: move,
    score: evaluateBoard(newBoard, evaluateForWhite),
  };
}

function WhitePawnMovesOneSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): BitMove[] {
  const moves: BitMove[] = [];
  const potentialMoves = AllWhitePawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );

  for (let i = 0; i < 64; i++) {
    const moveBit = BigInt(1) << BigInt(i);

    const offset = 64 - i;
    if (potentialMoves & moveBit) {
      moves.push({
        from: offset - 8,
        to: offset,
        piece: "whitePawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }
  }
  return moves;
}

function WhitePawnMovesTwoSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): BitMove[] {
  const moves: BitMove[] = [];
  const whitePawnsStartRank = StartingBoard.whitePawn;
  const whitePawnsOnStartRank = boardState.whitePawn & whitePawnsStartRank;
  const potentialTwoStepMoves = AllWhitePawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );

  for (let i = 0; i < 64; i++) {
    const moveBit = BigInt(1) << BigInt(i);
    if (potentialTwoStepMoves & moveBit) {
      const offset = 64 - i;
      moves.push({
        from: offset - 16,
        to: offset,
        piece: "whitePawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }
  }
  return moves;
}

export function WhitePawnCaptures(
  boardState: BitBoard,
  allOccupiedBlackPositions: bigint
): BitMove[] {
  const moves: BitMove[] = [];
  const leftCapturePositions =
    (boardState.whitePawn & ~bTohFilesOnly) >> BigInt(7);
  const rightCapturePositions =
    (boardState.whitePawn & ~aTogFilesOnly) >> BigInt(9);

  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;

    // Left captures
    fromIndex = i + 7;
    toIndex = i;
    if (
      (leftCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedBlackPositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "whitePawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }

    // Right captures
    fromIndex = i + 9;
    toIndex = i;
    if (
      (rightCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedBlackPositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "whitePawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }
  }

  return moves;
}

export function WhitePawnMovesComposite(boardState: BitBoard): BitMove[] {
  const allOccupiedPositions = allPositions(boardState);
  const allOccupiedBlackPositions = allBlackPositions(boardState);

  const singleStepMoves = WhitePawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );

  const doubleStepMoves = WhitePawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );

  const captures = WhitePawnCaptures(boardState, allOccupiedBlackPositions);

  const allMoves = [...singleStepMoves, ...doubleStepMoves, ...captures];

  return allMoves;
}

export function AllWhitePawnMovesOneSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): bigint {
  const singleStepMoves =
    (boardState.whitePawn >> BigInt(8)) & ~allOccupiedPositions;

  return singleStepMoves;
}

export function AllWhitePawnMovesTwoSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): bigint {
  const whitePawnsStartRank = StartingBoard.whitePawn;

  const whitePawnsOnStartRank = boardState.whitePawn & whitePawnsStartRank;

  const potentialTwoStepMoves = whitePawnsOnStartRank >> BigInt(16);

  const oneStepAhead = whitePawnsOnStartRank >> BigInt(8);

  const twoStepsClear =
    ~(oneStepAhead | potentialTwoStepMoves) & ~allOccupiedPositions;

  const finalTwoStepMoves =
    potentialTwoStepMoves & (twoStepsClear << BigInt(8));

  return finalTwoStepMoves;
}

export function AllWhitePawnCaptures(
  boardState: BitBoard,
  allOccupiedBlackPositions: bigint
) {
  const leftCaptures =
    ((boardState.whitePawn & ~BigInt("0x0101010101010101")) >> BigInt(7)) &
    allOccupiedBlackPositions;
  const rightCaptures =
    ((boardState.whitePawn & ~BigInt("0x8080808080808080")) >> BigInt(9)) &
    allOccupiedBlackPositions;

  return leftCaptures | rightCaptures;
}

export function AllWhitePawnMovesComposite(boardState: BitBoard): BitBoard {
  const allOccupiedPositions = allPositions(boardState);
  const allOccupiedBlackPositions = allBlackPositions(boardState);
  let pawnMoveBoard = { ...EmptyBoard };

  const singleStepMoves = AllWhitePawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );

  const doubleStepMoves = AllWhitePawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );

  const captures = AllWhitePawnCaptures(boardState, allOccupiedBlackPositions);

  const allMoves = singleStepMoves | doubleStepMoves | captures;

  pawnMoveBoard.whitePawn = allMoves;

  return pawnMoveBoard;
}

export function BlackPawnMovesOneSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): BitMove[] {
  const moves: BitMove[] = [];

  const potentialMoves = AllBlackPawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );

  const a1Position = 64;
  const h8Position = 1;

  //for each position from a1 to h8
  //0000000000000000000000000000000000000000111111110000000000000000"
  for (let position = h8Position; position <= a1Position; position++) {
    //create a bitmask of that position
    const positionBit = BigInt(1) << BigInt(position);

    //if position is in the 'all moves' bigint
    if (potentialMoves & positionBit) {
      //add it
      moves.push({
        from: 64 - position + 8,
        to: 64 - position,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }
  }
  return moves;
}

function BlackPawnMovesTwoSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): BitMove[] {
  const moves: BitMove[] = [];
  const blackPawnsStartRank = StartingBoard.blackPawn;
  const blackPawnsOnStartRank = boardState.blackPawn & blackPawnsStartRank;
  const potentialTwoStepMoves = AllBlackPawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );

  const a1Position = 64;
  const h8Position = 1;

  //for each position from a1 to h8
  //0000000000000000000000000000000000000000111111110000000000000000"
  for (let position = h8Position; position <= a1Position; position++) {
    //create a bitmask of that position
    const positionBit = BigInt(1) << BigInt(position);

    //if position is in the 'all moves' bigint
    if (potentialTwoStepMoves & positionBit) {
      //add it
      moves.push({
        from: 64 - position + 16,
        to: 64 - position,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }
  }
  return moves;
}

export function BlackPawnCaptures(
  boardState: BitBoard,
  allOccupiedWhitePositions: bigint
): BitMove[] {
  const moves: BitMove[] = [];
  const leftCapturePositions =
    (boardState.blackPawn & ~bTohFilesOnly) << BigInt(9);
  const rightCapturePositions =
    (boardState.blackPawn & ~aTogFilesOnly) << BigInt(7);

  // const whitePositionsString = bigIntToBinaryString(allOccupiedWhitePositions);
  // console.log(`WHITE OCCUPIED ${whitePositionsString}`);
  // const blackPositionsString = bigIntToBinaryString(boardState.blackPawn);
  // console.log(`BLACK PAWNS ${blackPositionsString}`);

  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;

    fromIndex = i - 9;
    toIndex = i;
    if (
      (leftCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedWhitePositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }

    fromIndex = i - 7;
    toIndex = i;
    if (
      (rightCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedWhitePositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0,
      });
    }
  }

  return moves;
}

export function BlackPawnMovesComposite(boardState: BitBoard): BitMove[] {
  const allOccupiedPositions = allPositions(boardState);
  const allOccupiedWhitePositions = allWhitePositions(boardState);

  const singleStepMoves = BlackPawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );

  const doubleStepMoves = BlackPawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );

  const captures = BlackPawnCaptures(boardState, allOccupiedWhitePositions);

  const allMoves = [...singleStepMoves, ...doubleStepMoves, ...captures];

  return allMoves;
}

export function AllBlackPawnMovesOneSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): bigint {
  const singleStepMoves =
    (boardState.blackPawn << BigInt(8)) & ~allOccupiedPositions;

  return singleStepMoves;
}

export function AllBlackPawnMovesTwoSquare(
  boardState: BitBoard,
  allOccupiedPositions: bigint
): bigint {
  const blackPawnsStartRank = StartingBoard.blackPawn;

  const blackPawnsOnStartRank = boardState.blackPawn & blackPawnsStartRank;

  const ignoreMovedBlackPawns = { ...boardState };
  ignoreMovedBlackPawns.blackPawn = blackPawnsOnStartRank;

  const oneStepMoves = AllBlackPawnMovesOneSquare(
    ignoreMovedBlackPawns,
    allOccupiedPositions
  );
  ignoreMovedBlackPawns.blackPawn = oneStepMoves;
  const twoStepMoves = AllBlackPawnMovesOneSquare(
    ignoreMovedBlackPawns,
    allOccupiedPositions
  );

  return twoStepMoves;
}

export function AllBlackPawnCaptures(
  boardState: BitBoard,
  allOccupiedWhitePositions: bigint
) {
  const leftCaptures =
    ((boardState.blackPawn & ~BigInt("0x0101010101010101")) << BigInt(9)) &
    allOccupiedWhitePositions;

  const rightCaptures =
    ((boardState.blackPawn & ~BigInt("0x8080808080808080")) << BigInt(7)) &
    allOccupiedWhitePositions;

  return leftCaptures | rightCaptures;
}

export function AllBlackPawnMovesComposite(boardState: BitBoard): BitBoard {
  const allOccupiedPositions = allPositions(boardState);
  const allOccupiedWhitePositions = allWhitePositions(boardState);
  let pawnMoveBoard = { ...EmptyBoard };

  const singleStepMoves = AllBlackPawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );

  const doubleStepMoves = AllBlackPawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );

  const captures = AllBlackPawnCaptures(boardState, allOccupiedWhitePositions);

  const allMoves = singleStepMoves | doubleStepMoves | captures;

  pawnMoveBoard.blackPawn = allMoves;

  return pawnMoveBoard;
}

export function AllKnightMoves(
  boardState: BitBoard,
  allFriendlyOccupiedPositions: bigint,
  evaluateForWhite: boolean
): bigint {
  const knightsToMove = evaluateForWhite
    ? boardState.whiteKnight
    : boardState.blackKnight;
  let knightMoves = BigInt(0);

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
          boardState,
          knightPosition,
          knightPosition + offset,
          evaluateForWhite ? "whiteKnight" : "blackKnight"
        );
        knightMoves =
          knightMoves |
          (evaluateForWhite
            ? newBoardState.whiteKnight
            : newBoardState.blackKnight);
      }
    });
  });
  return (
    knightMoves &
    ~(evaluateForWhite ? boardState.whiteKnight : boardState.blackKnight)
  );
}

export function AllBishopMoves(
  boardState: BitBoard,
  allFriendlyOccupiedPositions: bigint,
  allEnemyOccupiedPositions: bigint,
  evaluateForWhite: boolean
): bigint {
  let possiblePositions = BigInt(0);

  const bishopsToMove = evaluateForWhite
    ? boardState.whiteBishop
    : boardState.blackBishop;

  const bishopPositions = findBitPositions(bishopsToMove);

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
          possiblePositions |= binaryMask64(
            newPosition,
            "all_zeroes_with_position_as_one"
          );
        }

        lastPosition = newPosition;

        if (isOccupiedComposite(allEnemyOccupiedPositions, newPosition)) {
          break;
        }
      }
    });
  });
  return possiblePositions;
}

export function AllRookMoves(
  boardState: BitBoard,
  allFriendlyOccupiedPositions: bigint,
  allEnemyOccupiedPositions: bigint,
  evaluateForWhite: boolean
): bigint {
  let possiblePositions = BigInt(0);

  const rooksToMove = evaluateForWhite
    ? boardState.whiteRook
    : boardState.blackRook;

  const rookPositions = findBitPositions(rooksToMove);

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
          possiblePositions |= binaryMask64(
            newPosition,
            "all_zeroes_with_position_as_one"
          );
        }

        lastPosition = newPosition;

        if (isOccupiedComposite(allEnemyOccupiedPositions, newPosition)) {
          break;
        }
      }
    });
  });
  return possiblePositions;
}

export function AllKingMoves(
  boardState: BitBoard,
  allFriendlyOccupiedPositions: bigint,
  evaluateForWhite: boolean
): bigint {
  let possiblePositions = BigInt(0);

  const kingToMove = evaluateForWhite
    ? boardState.whiteKing
    : boardState.blackKing;

  const kingPositions = findBitPositions(kingToMove);

  kingPositions.forEach((kingPosition) => {
    const offsets = [...orthagonalOffsets, ...diagonalOffsets];
    offsets.forEach((offset) => {
      let newPosition = kingPosition + offset;
      if (newPosition < 1 || newPosition > 64) {
        return;
      }
      if (
        !isOccupiedComposite(allFriendlyOccupiedPositions, newPosition) &&
        !isAtoHwraparound(kingPosition, newPosition)
      ) {
        possiblePositions |= binaryMask64(
          newPosition,
          "all_zeroes_with_position_as_one"
        );
      }
    });
  });
  return possiblePositions;
}

export function AllQueenMoves(
  boardState: BitBoard,
  allFriendlyOccupiedPositions: bigint,
  allEnemyOccupiedPositions: bigint,
  evaluateForWhite: boolean
): bigint {
  let possiblePositions = BigInt(0);

  const queensToMove = evaluateForWhite
    ? boardState.whiteQueen
    : boardState.blackQueen;

  const queenPositions = findBitPositions(queensToMove);

  queenPositions.forEach((queenPosition) => {
    const offsets = [...diagonalOffsets, ...orthagonalOffsets];

    offsets.forEach((offset) => {
      let lastPosition = queenPosition;

      for (
        let newPosition = queenPosition + offset;
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
          possiblePositions |= binaryMask64(
            newPosition,
            "all_zeroes_with_position_as_one"
          );
        }

        lastPosition = newPosition;

        if (isOccupiedComposite(allEnemyOccupiedPositions, newPosition)) {
          break;
        }
      }
    });
  });
  return possiblePositions;
}

export function AllCompiledMoves(
  boardState: BitBoard,
  evaluateForWhite: boolean,
  treatKingAsCapture: boolean
): bigint {
  const friendlyPositions = evaluateForWhite
    ? allWhitePositions(boardState)
    : allBlackPositions(boardState);
  const enemyPositions = evaluateForWhite
    ? allBlackPositions(boardState)
    : allWhitePositions(boardState);

  const queenMoves = AllQueenMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );

  const rookMoves = AllRookMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );

  const bishopMoves = AllBishopMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );

  const knightMoves = AllKnightMoves(
    boardState,
    friendlyPositions,
    evaluateForWhite
  );

  const kingMoves = AllKingMoves(
    boardState,
    friendlyPositions,
    evaluateForWhite
  );

  const pawnMoves = evaluateForWhite
    ? AllWhitePawnCaptures(boardState, enemyPositions)
    : AllBlackPawnCaptures(boardState, enemyPositions);

  return (
    queenMoves | rookMoves | bishopMoves | pawnMoves | knightMoves | kingMoves
  );
}
