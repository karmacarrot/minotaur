// src/logging/definitions.ts
var LogLevels = /* @__PURE__ */ ((LogLevels2) => {
  LogLevels2[LogLevels2["warn"] = 0] = "warn";
  LogLevels2[LogLevels2["log"] = 1] = "log";
  LogLevels2[LogLevels2["error"] = 2] = "error";
  LogLevels2[LogLevels2["info"] = 3] = "info";
  return LogLevels2;
})(LogLevels || {});

// src/logging/logger.config.ts
var LoggerConfig = {
  verbosity: 2 /* error */,
  enableEvaluationLogs: true
};

// src/logging/logger.ts
function MultiLog(outputType, message, outputVerbosity) {
  if ((outputType === 0 /* warn */ || outputType === 3 /* info */) && outputVerbosity === 2 /* error */) {
    return;
  }
  if (outputType === 3 /* info */ && outputVerbosity !== 3 /* info */) {
    return;
  }
  switch (outputType) {
    case 3 /* info */:
      console.info(message);
    case 0 /* warn */:
      console.warn(message);
    case 2 /* error */:
      console.error(message);
    case 1 /* log */:
      console.log(message);
    default:
      console.log(message);
  }
}

// src/helpers/definitions.ts
var InitialGameStatus = {
  isWhitesTurn: true,
  isGameOver: false,
  moveHistory: [],
  positionEvaluation: 0,
  blackComputerControl: true,
  whiteComputerControl: false,
  blackKingChecked: false,
  whiteKingChecked: false,
  whiteKingCanCastleLong: true,
  whiteKingCanCastleShort: true,
  blackKingCanCastleLong: true,
  blackKingCanCastleShort: true
};
var numberOfTiles = 64;
var xOrYTileLength = 8;
var blackStartingRank = 7;
var whiteStartingRank = 2;
var files = ["a", "b", "c", "d", "e", "f", "g", "h"];
var aTogFilesOnly = BigInt(
  "0b0000000100000001000000010000000100000001000000010000000100000001"
);
var bTohFilesOnly = BigInt(
  "0b1000000010000000100000001000000010000000100000001000000010000000"
);
var a1 = BigInt(
  "0b1000000000000000000000000000000000000000000000000000000000000000"
);
var h8 = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000001"
);
var StartingBoard = {
  whitePawn: BigInt(
    "0b0000000011111111000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0100001000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0010010000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000001111111100000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000001000010"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000100100"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var EmptyBoard = {
  whitePawn: BigInt(0),
  whiteKnight: BigInt(0),
  whiteBishop: BigInt(0),
  whiteRook: BigInt(0),
  whiteQueen: BigInt(0),
  whiteKing: BigInt(0),
  blackPawn: BigInt(0),
  blackKnight: BigInt(0),
  blackBishop: BigInt(0),
  blackRook: BigInt(0),
  blackQueen: BigInt(0),
  blackKing: BigInt(0),
  none: BigInt(0)
};
var allOnes = BigInt(
  "0b1111111111111111111111111111111111111111111111111111111111111111"
);
var BoardArrangements = /* @__PURE__ */ ((BoardArrangements2) => {
  BoardArrangements2[BoardArrangements2["StartingPositions"] = 0] = "StartingPositions";
  BoardArrangements2[BoardArrangements2["MiddleGame"] = 1] = "MiddleGame";
  BoardArrangements2[BoardArrangements2["EndGame"] = 2] = "EndGame";
  BoardArrangements2[BoardArrangements2["DuellingPawns"] = 3] = "DuellingPawns";
  BoardArrangements2[BoardArrangements2["EmptyBoard"] = 4] = "EmptyBoard";
  BoardArrangements2[BoardArrangements2["MiniMaxOne"] = 5] = "MiniMaxOne";
  BoardArrangements2[BoardArrangements2["MateInOneForBlackGameBoard"] = 6] = "MateInOneForBlackGameBoard";
  BoardArrangements2[BoardArrangements2["MateInOneForWhiteGameBoard"] = 7] = "MateInOneForWhiteGameBoard";
  BoardArrangements2[BoardArrangements2["CastleForBlackGameBoard"] = 8] = "CastleForBlackGameBoard";
  BoardArrangements2[BoardArrangements2["BlackLongCastledGameBoard"] = 9] = "BlackLongCastledGameBoard";
  BoardArrangements2[BoardArrangements2["BlackShortCastledGameBoard"] = 10] = "BlackShortCastledGameBoard";
  BoardArrangements2[BoardArrangements2["CastleForBlackAfter"] = 11] = "CastleForBlackAfter";
  return BoardArrangements2;
})(BoardArrangements || {});
var pieceImages = {
  whitePawn: "pawn_w",
  //white pawns
  whiteKnight: "knight_w",
  //white knights
  whiteBishop: "bishop_w",
  //white bishops
  whiteRook: "rook_w",
  //white rooks
  whiteQueen: "queen_w",
  //white queen
  whiteKing: "king_w",
  //white king
  blackPawn: "pawn_b",
  //black pawns
  blackKnight: "knight_b",
  //black knights
  blackBishop: "bishop_b",
  //black bishops
  blackRook: "rook_b",
  //black rooks
  blackQueen: "queen_b",
  //black queen
  blackKing: "king_b"
  //black king.
};
var slidingPieces = [
  "whitePawn",
  "whiteBishop",
  "whiteQueen",
  "whiteKing",
  "whiteRook",
  "blackPawn",
  "blackBishop",
  "blackQueen",
  "blackKing",
  "blackRook"
];
var unicodePieceMap = {
  whiteKing: "\u2654",
  whiteQueen: "\u2655",
  whiteRook: "\u2656",
  whiteBishop: "\u2657",
  whiteKnight: "\u2658",
  whitePawn: "\u2659",
  blackKing: "\u265A",
  blackQueen: "\u265B",
  blackRook: "\u265C",
  blackBishop: "\u265D",
  blackKnight: "\u265E",
  blackPawn: "\u265F"
};
var pieceValues = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 20
};
var CentralDominanceWeightings = {
  absoluteCentre: BigInt(
    "0b0000000000000000000000000001100000011000000000000000000000000000"
  ),
  innerRing: BigInt(
    "0b0000000000000000001111000010010000100100001111000000000000000000"
  ),
  outerRing: BigInt(
    "0b0000000001111110010000100100001001000010010000100111111000000000"
  )
};
var RankWeightings = {
  secondRank: BigInt(
    "0b0000000011111111000000000000000000000000000000000000000000000000"
  ),
  seventhRank: BigInt(
    "0b0000000000000000000000000000000000000000000000001111111100000000"
  )
};
var EvalWeightings = {
  absoluteCentreWeight: 0.3,
  innerRingWeight: 0.1,
  outerRingWeight: 0,
  oneMoveUntilPromotionWeight: 6,
  pawnChainWeight: 0.1,
  developedBishopKnight: 0.2,
  developedRook: 0,
  //TODO: revisit this, maybe we should only consider connected rooks to be 'developed'?
  freedomToMove: 0.01,
  safeKing: 2
};
var evalLoggingOn = {
  evalLayers: [],
  evalLoggingEnabled: true,
  evalAddNode: () => {
    return;
  }
};
var evalLoggingOff = {
  evalLayers: [],
  evalLoggingEnabled: false,
  evalAddNode: () => {
    return;
  }
};
var knightMoveOffsets = [17, 15, 10, 6, -6, -10, -15, -17];
var diagonalOffsets = [9, -9, 7, -7];
var orthagonalOffsets = [1, -1, 8, -8];
var fullBitMask = (BigInt(1) << BigInt(64)) - BigInt(1);
var blackKingShortCastleRoute = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000110"
);
var blackKingLongCastleRoute = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000001110000"
);
var whiteKingShortCastleRoute = BigInt(
  "0b0000011000000000000000000000000000000000000000000000000000000000"
);
var whiteKingLongCastleRoute = BigInt(
  "0b0111000000000000000000000000000000000000000000000000000000000000"
);
var blackKingShortCastleDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000010"
);
var blackKingLongCastleDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000100000"
);
var whiteKingShortCastleDestination = BigInt(
  "0b0000001000000000000000000000000000000000000000000000000000000000"
);
var whiteKingLongCastleDestination = BigInt(
  "0b0100000000000000000000000000000000000000000000000000000000000000"
);
var blackKingShortCastleRookDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000100"
);
var blackKingLongCastleRookDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000010000"
);
var whiteKingShortCastleRookDestination = BigInt(
  "0b0000001000000000000000000000000000000000000000000000000000000000"
);
var whiteKingLongCastleRookDestination = BigInt(
  "0b0001000000000000000000000000000000000000000000000000000000000000"
);
var blackKingShortRook = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000001"
);
var blackKingLongRook = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000010000000"
);
var whiteKingShortRook = BigInt(
  "0b0000000100000000000000000000000000000000000000000000000000000000"
);
var whiteKingLongRook = BigInt(
  "0b1000000000000000000000000000000000000000000000000000000000000000"
);
var whitePawnLongGuards = BigInt(
  "0b0000000011100000000000000000000000000000000000000000000000000000"
);
var whitePawnShortGuards = BigInt(
  "0b0000000000001110000000000000000000000000000000000000000000000000"
);
var blackPawnLongGuards = BigInt(
  "0b0000000000000000000000000000000000000000000000001110000000000000"
);
var blackPawnShortGuards = BigInt(
  "0b0000000000000000000000000000000000000000000000000000011100000000"
);
BigInt.prototype.toJSON = function() {
  return this.toString();
};

// src/helpers/bitboards.ts
function applyMove(bitBoard, from, to, pieceBitBoard) {
  let newBitBoard = { ...bitBoard };
  const fromMask = BigInt(1) << BigInt(64 - from);
  const toMask = BigInt(1) << BigInt(64 - to);
  MultiLog(
    3 /* info */,
    `apply move to ${bigIntToBinaryString(
      bitBoard[pieceBitBoard]
    )} from ${from} to ${to} `,
    LoggerConfig.verbosity
  );
  const fromMaskString = bigIntToBinaryString(fromMask);
  const toMaskString = bigIntToBinaryString(toMask);
  MultiLog(
    3 /* info */,
    `from mask ${fromMaskString}`,
    LoggerConfig.verbosity
  );
  MultiLog(3 /* info */, `to mask ${toMaskString}`, LoggerConfig.verbosity);
  newBitBoard = clearPosition(newBitBoard, to);
  newBitBoard[pieceBitBoard] = newBitBoard[pieceBitBoard] & ~fromMask | toMask;
  return newBitBoard;
}
function clearPosition(bitBoard, position) {
  const removalMask = binaryMask64(position, "all_ones_with_position_as_zero");
  const removalMaskString = bigIntToBinaryString(removalMask);
  MultiLog(0 /* warn */, removalMaskString, LoggerConfig.verbosity);
  let newBitBoard = { ...bitBoard };
  for (let piece in newBitBoard) {
    let pieceBoard = newBitBoard[piece];
    const pieceBoardString = bigIntToBinaryString(pieceBoard);
    MultiLog(
      3 /* info */,
      `${piece} is ${pieceBoardString}`,
      LoggerConfig.verbosity
    );
    newBitBoard[piece] = pieceBoard & removalMask;
  }
  return newBitBoard;
}
function getBitBoardPosition(file, rank) {
  const fileNumber = files.indexOf(file);
  const minRank = (rank - 1) * 8;
  MultiLog(
    3 /* info */,
    `position ${file}${rank} minrank: ${minRank} fileNumber: ${fileNumber} `,
    LoggerConfig.verbosity
  );
  return minRank + fileNumber + 1;
}
function getFileAndRank(bitBoardPosition) {
  const zeroBasedPosition = bitBoardPosition - 1;
  const rank = Math.floor(zeroBasedPosition / 8) + 1;
  const fileIndex = zeroBasedPosition % 8;
  const file = files[fileIndex];
  return { file, rank };
}
function bigIntToBinaryString(inputNumber) {
  let binaryString = inputNumber.toString(2);
  const desiredWidth = 64;
  let paddedBinaryString = binaryString.padStart(desiredWidth, "0");
  return paddedBinaryString;
}
function bitCount(bitboard) {
  let count = 0;
  for (let i = 0; i < 64; i++) {
    const checkBit = BigInt(1) << BigInt(i);
    if (bitboard & checkBit) {
      count += 1;
    }
  }
  return count;
}
function binaryMask64(position, maskType) {
  const binaryMask = BigInt(1) << BigInt(64 - position);
  if (maskType === "all_zeroes_with_position_as_one") {
    return binaryMask;
  }
  MultiLog(
    3 /* info */,
    bigIntToBinaryString(allOnes),
    LoggerConfig.verbosity
  );
  MultiLog(
    3 /* info */,
    bigIntToBinaryString(binaryMask),
    LoggerConfig.verbosity
  );
  return allOnes & ~binaryMask;
}
function occupiedBy(currentBoard, position) {
  const queryMask = binaryMask64(position, "all_zeroes_with_position_as_one");
  for (let piece in currentBoard) {
    let pieceBoard = currentBoard[piece];
    const foundPiece = pieceBoard & queryMask;
    if (foundPiece) {
      return piece;
    }
  }
  return null;
}
function isOccupied(currentBoard, position) {
  let compositePositions = allPositions(currentBoard);
  return isOccupiedComposite(compositePositions, position);
}
function isOccupiedComposite(compositePositions, position) {
  const queryMask = binaryMask64(position, "all_zeroes_with_position_as_one");
  const foundPiece = compositePositions & queryMask;
  return !!foundPiece;
}
function allPositions(currentBoard) {
  let compositePositions = BigInt(0);
  for (let piece in currentBoard) {
    let pieceBoard = currentBoard[piece];
    compositePositions = compositePositions | pieceBoard;
  }
  return compositePositions;
}
function allWhitePositions(currentBoard) {
  let compositePositions = BigInt(0);
  for (let piece in currentBoard) {
    if (piece.toLowerCase().includes("white")) {
      let pieceBoard = currentBoard[piece];
      compositePositions = compositePositions | pieceBoard;
    }
  }
  return compositePositions;
}
function allBlackPositions(currentBoard) {
  let compositePositions = BigInt(0);
  for (let piece in currentBoard) {
    if (piece.toLowerCase().includes("black")) {
      let pieceBoard = currentBoard[piece];
      compositePositions = compositePositions | pieceBoard;
    }
  }
  return compositePositions;
}
function getMoveFromBoardStates(before, after) {
  if (before.blackKing !== after.blackKing && before.blackRook !== after.blackRook || before.whiteKing !== after.whiteKing && before.whiteRook !== after.whiteRook) {
    return getCastledMoveFromBoardStates(before, after);
  }
  return getSinglePieceMoveFromBoardStates(before, after);
}
function getSinglePieceMoveFromBoardStates(before, after) {
  let move = {
    from: 0,
    to: 0,
    piece: "none",
    pieceTaken: "none",
    score: 0,
    evaluations: 0,
    castleRookFrom: 0,
    castleRookTo: 0
  };
  for (const piece of Object.keys(before)) {
    if (piece === "none") continue;
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
  return move;
}
function getBeforeAndAfterPositions(before, after) {
  let beforePosition = 0, afterPosition = 0;
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
function getCastledMoveFromBoardStates(before, after) {
  let move = {
    from: 0,
    to: 0,
    piece: "none",
    pieceTaken: "none",
    score: 0,
    evaluations: 0,
    castleRookFrom: 0,
    castleRookTo: 0
  };
  if (before.blackKing !== after.blackKing && before.blackRook !== after.blackRook) {
    move.piece = "blackKing";
    const blackKingNewPosition = findBitPosition(after.blackKing);
    move.from = 61;
    move.to = blackKingNewPosition ? blackKingNewPosition : 0;
    const [beforeRook, afterRook] = getBeforeAndAfterPositions(
      before.blackRook,
      after.blackRook
    );
    move.castleRookFrom = beforeRook;
    move.castleRookTo = afterRook;
  }
  if (before.whiteKing !== after.whiteKing && before.whiteRook !== after.whiteRook) {
    move.piece = "whiteKing";
    const whiteKingNewPosition = findBitPosition(after.whiteKing);
    move.from = 5;
    move.to = whiteKingNewPosition ? whiteKingNewPosition : 0;
    const [beforeRook, afterRook] = getBeforeAndAfterPositions(
      before.whiteRook,
      after.whiteRook
    );
    move.castleRookFrom = beforeRook;
    move.castleRookTo = afterRook;
  }
  return move;
}
function findBitPositionReverse(bitboard) {
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
function findBitPositions(bitboard) {
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
function findBitPosition(bitboard) {
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
function isAtoHwraparound(fromPosition, toPosition) {
  const { file: fromFile } = getFileAndRank(fromPosition);
  const { file: toFile } = getFileAndRank(toPosition);
  return (fromFile + toFile).includes("a") && (fromFile + toFile).includes("h");
}
function isABCtoFGHwraparound(fromPosition, toPosition) {
  const { file: fromFile } = getFileAndRank(fromPosition);
  const { file: toFile } = getFileAndRank(toPosition);
  let leftSideFile = false;
  if ((fromFile + toFile).includes("a") || (fromFile + toFile).includes("b") || (fromFile + toFile).includes("c")) {
    leftSideFile = true;
  }
  let rightSideFile = false;
  if ((fromFile + toFile).includes("f") || (fromFile + toFile).includes("g") || (fromFile + toFile).includes("h")) {
    rightSideFile = true;
  }
  return leftSideFile && rightSideFile;
}
function bitBoardsReadable(bitBoard) {
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
    none: bigIntToBinaryString(bitBoard.none)
  };
}
function isShortCastleRouteBlocked(board, isWhitesTurn) {
  const compositePositions = allPositions(board);
  return !!(compositePositions & (isWhitesTurn ? whiteKingShortCastleRoute : blackKingShortCastleRoute));
}
function isLongCastleRouteBlocked(board, isWhitesTurn) {
  const compositePositions = allPositions(board);
  const pathBlockingPositions = isWhitesTurn ? whiteKingLongCastleRoute : blackKingLongCastleRoute;
  return !!(compositePositions & pathBlockingPositions);
}

// src/referee/mockBoardStates.ts
var MiddleGameBoard = {
  whitePawn: BigInt(
    "0b0000000000001000000000011110011000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000001000000000010000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0010010000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000010100110000000010100000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000100000000000000000000010"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000100100"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var EndGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var MateInOneForWhiteGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b0100001000000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0000000000100000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000001"
  ),
  none: BigInt(0)
};
var MateInOneForBlackGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var BlackShortCastledGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000011100000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000100"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: blackKingShortCastleDestination,
  none: BigInt(0)
};
var BlackLongCastledGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000001110000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010001"
  ),
  blackQueen: BigInt(0),
  blackKing: blackKingLongCastleDestination,
  none: BigInt(0)
};
var CastleForBlackGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000011100000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var CastleForBlackAfterGameBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000000000000011100000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000000"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000100"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000000010"
  ),
  none: BigInt(0)
};
var DuellingPawnsBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000001111111100000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0100001000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0010010000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000011111111000000000000000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000001000010"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000100100"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var BlackAdvantageBoard = {
  whitePawn: BigInt(
    "0b0000000000000000000000001110011100000000000000000000000000000000"
  ),
  whiteKnight: BigInt(
    "0b0100001000000000000000000000000000000000000000000000000000000000"
  ),
  whiteBishop: BigInt(
    "0b0010010000000000000000000000000000000000000000000000000000000000"
  ),
  whiteRook: BigInt(
    "0b1000000100000000000000000000000000000000000000000000000000000000"
  ),
  whiteQueen: BigInt(
    "0b0001000000000000000000000000000000000000000000000000000000000000"
  ),
  whiteKing: BigInt(
    "0b0000100000000000000000000000000000000000000000000000000000000000"
  ),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000011111111000000000000000000000000"
  ),
  blackKnight: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000001000010"
  ),
  blackBishop: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000100100"
  ),
  blackRook: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000010000001"
  ),
  blackQueen: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000010000"
  ),
  blackKing: BigInt(
    "0b0000000000000000000000000000000000000000000000000000000000001000"
  ),
  none: BigInt(0)
};
var MiniMaxTestBoardOne = {
  whitePawn: BigInt(
    "0b0000000000000000000000000000000000010000001000000000000000000000"
  ),
  whiteKnight: BigInt(0),
  whiteBishop: BigInt(0),
  whiteRook: BigInt(0),
  whiteQueen: BigInt(0),
  whiteKing: BigInt(0),
  blackPawn: BigInt(
    "0b0000000000000000000000000000000000000000000010000001000000000000"
  ),
  blackKnight: BigInt(0),
  blackBishop: BigInt(0),
  blackRook: BigInt(0),
  blackQueen: BigInt(0),
  blackKing: BigInt(0),
  none: BigInt(0)
};
var whitePawnChain_Pyramid = BigInt(
  "0b0000000010000000010000010010001000010100000010000000000000000000"
);
var whitePawnChain_ThreeIslands = BigInt(
  "0b0000000010010010010010010000000000000000000000000000000000000000"
);
var whitePawnChain_NoChains = BigInt(
  "0b0000000010101010000000000101010100000000000000000000000000000000"
);
var blackPawnChain_Pyramid = BigInt(
  "0b0000000000000000000010000001010000100010010000011000000000000000"
);
var blackPawnChain_ThreeIslands = BigInt(
  "0b0000000000000000000000000000000000000000100100100100100100000000"
);
var blackPawnChain_NoChains = BigInt(
  "0b0000000000000000000000000000000001010101000000001010101000000000"
);

// src/helpers/boardevaluation/boardEval.ts
function evaluateBoard(currentBoard, evaluateForWhite) {
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
function evaluateMaterialAdvantages(currentBoard, evaluateForWhite) {
  let whiteScore = 0, blackScore = 0;
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
function evaluatePositionalAdvantages(currentBoard, evaluateForWhite) {
  let whiteScore = 0, blackScore = 0;
  whiteScore += evaluateCentralDominanceAdvantages(
    currentBoard.whitePawn,
    evaluateForWhite,
    "whitePawn"
  );
  blackScore += evaluateCentralDominanceAdvantages(
    currentBoard.blackPawn,
    evaluateForWhite,
    "blackPawn"
  );
  if (evaluateForWhite) {
    return whiteScore - blackScore;
  }
  return blackScore - whiteScore;
}
function evaluateCentralDominanceAdvantages(pieceBitBoard, evaluateForWhite, piece) {
  let score = 0;
  const evalAbsoluteCentre = CentralDominanceWeightings.absoluteCentre & pieceBitBoard;
  score += bitCount(evalAbsoluteCentre) * EvalWeightings.absoluteCentreWeight;
  const evalInnerRing = CentralDominanceWeightings.innerRing & pieceBitBoard;
  score += bitCount(evalInnerRing) * EvalWeightings.innerRingWeight;
  const evalOuterRing = CentralDominanceWeightings.outerRing & pieceBitBoard;
  score += bitCount(evalOuterRing) * EvalWeightings.outerRingWeight;
  return score;
}
function evaluatePromotionalPossibilities(pawnBitBoard, evaluateForWhite) {
  let score = 0;
  if (evaluateForWhite) {
    const evalSeventhRankPawns = RankWeightings.seventhRank & pawnBitBoard;
    return bitCount(evalSeventhRankPawns) * EvalWeightings.oneMoveUntilPromotionWeight;
  }
  const evalSecondRankPawns = RankWeightings.secondRank & pawnBitBoard;
  return bitCount(evalSecondRankPawns) * EvalWeightings.oneMoveUntilPromotionWeight;
}
function evaluatePawnChains(pawnBitBoard, evaluateForWhite) {
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
function evaluatePieceDevelopment(currentBoard, evaluateForWhite) {
  let developmentScore = 0;
  const startingKnights = evaluateForWhite ? StartingBoard.whiteKnight : StartingBoard.blackKnight;
  const currentKnights = evaluateForWhite ? currentBoard.whiteKnight : currentBoard.blackKnight;
  const everywhereButStartingPositionsForKnights = ~startingKnights;
  const movedKnightPositions = currentKnights & everywhereButStartingPositionsForKnights;
  const movedKnightCount = bitCount(movedKnightPositions);
  developmentScore += movedKnightCount * EvalWeightings.developedBishopKnight;
  const startingBishops = evaluateForWhite ? StartingBoard.whiteBishop : StartingBoard.blackBishop;
  const currentBishops = evaluateForWhite ? currentBoard.whiteBishop : currentBoard.blackBishop;
  const everywhereButStartingPositionsForBishops = ~startingBishops;
  const movedBishopPositions = currentBishops & everywhereButStartingPositionsForBishops;
  const movedBishopCount = bitCount(movedBishopPositions);
  developmentScore += movedBishopCount * EvalWeightings.developedBishopKnight;
  const startingRooks = evaluateForWhite ? StartingBoard.whiteRook : StartingBoard.blackRook;
  const currentRooks = evaluateForWhite ? currentBoard.whiteRook : currentBoard.blackRook;
  const everywhereButStartingPositionsForRooks = ~startingRooks;
  const movedRookPositions = currentRooks & everywhereButStartingPositionsForRooks;
  const movedRookCount = bitCount(movedRookPositions);
  developmentScore += movedRookCount * EvalWeightings.developedRook;
  return developmentScore;
}
function evaluateFreedomToMove(currentBoard, evaluateForWhite) {
  let freedomToMove = 0;
  const friendlyPieces = evaluateForWhite ? allWhitePositions(currentBoard) : allBlackPositions(currentBoard);
  const enemyPieces = evaluateForWhite ? allBlackPositions(currentBoard) : allWhitePositions(currentBoard);
  const knightMoves = AllKnightMoves(
    currentBoard,
    friendlyPieces,
    evaluateForWhite
  );
  const bishopMoves = AllBishopMoves(
    currentBoard,
    friendlyPieces,
    enemyPieces,
    evaluateForWhite
  );
  const rookMoves = AllRookMoves(
    currentBoard,
    friendlyPieces,
    enemyPieces,
    evaluateForWhite
  );
  freedomToMove += EvalWeightings.freedomToMove * bitCount(knightMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(bishopMoves);
  freedomToMove += EvalWeightings.freedomToMove * bitCount(rookMoves);
  return freedomToMove;
}
function evaluateKingSafety(currentBoard, evaluateForWhite) {
  if (evaluateForWhite) {
    return 0;
  } else {
    const blackKingIsLong = !!(currentBoard.blackKing & blackKingLongCastleDestination);
    const blackPawnsProtectLong = (currentBoard.blackPawn & blackPawnLongGuards) === blackPawnLongGuards;
    const blackRookHasCastledLong = !!(currentBoard.blackRook & blackKingLongCastleRookDestination);
    if (blackKingIsLong && blackPawnsProtectLong && blackRookHasCastledLong) {
      return EvalWeightings.safeKing;
    }
    const blackKingIsShort = !!(currentBoard.blackKing & blackKingShortCastleDestination);
    const blackPawnsProtectShort = (currentBoard.blackPawn & blackPawnShortGuards) === blackPawnShortGuards;
    const blackRookHasCastledShort = !!(currentBoard.blackRook & blackKingShortCastleRookDestination);
    if (blackKingIsShort && blackPawnsProtectShort && blackRookHasCastledShort) {
      return EvalWeightings.safeKing;
    }
  }
  return 0;
}

// src/helpers/search/nodes/bishops/bishopNodes.ts
function bishopNodes(node, evalLogs) {
  let possibleNodes = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const bishopsToMove = isWhitesTurn ? node.boardState.whiteBishop : node.boardState.blackBishop;
  const bishopPositions = findBitPositions(bishopsToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn ? allWhitePositions(node.boardState) : allBlackPositions(node.boardState);
  const allEnemyOccupiedPositions = isWhitesTurn ? allBlackPositions(node.boardState) : allWhitePositions(node.boardState);
  bishopPositions.forEach((bishopPosition) => {
    const offsets = diagonalOffsets;
    offsets.forEach((offset) => {
      let lastPosition = bishopPosition;
      for (let newPosition = bishopPosition + offset; newPosition >= 1 && newPosition <= 64; newPosition += offset) {
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

// src/helpers/search/nodes/king/kingNodes.ts
function kingNodes(node, evalLogs) {
  let possibleNodes = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const kingToMove = isWhitesTurn ? node.boardState.whiteKing : node.boardState.blackKing;
  const kingPositions = findBitPositions(kingToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn ? allWhitePositions(node.boardState) : allBlackPositions(node.boardState);
  kingPositions.forEach((kingPosition) => {
    const offsets = [...diagonalOffsets, ...orthagonalOffsets];
    offsets.forEach((offset) => {
      const lastPosition = kingPosition;
      const newPosition = kingPosition + offset;
      if (newPosition < 1 || newPosition > 64) {
        return;
      }
      if (!isOccupiedComposite(allFriendlyOccupiedPositions, newPosition) && !isAtoHwraparound(lastPosition, newPosition)) {
        const newBoardState = applyMove(
          node.boardState,
          kingPosition,
          newPosition,
          isWhitesTurn ? "whiteKing" : "blackKing"
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
function kingCastlingNodes(node, evalLogs) {
  let possibleNodes = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;
  let kingCanLong = isWhitesTurn ? node.gameState.whiteKingCanCastleLong : node.gameState.blackKingCanCastleLong;
  let kingCanShort = isWhitesTurn ? node.gameState.whiteKingCanCastleShort : node.gameState.blackKingCanCastleShort;
  if (!kingCanLong && !kingCanShort) {
    return possibleNodes;
  }
  if (kingCanShort) {
    const isShortPathOccupied = isShortCastleRouteBlocked(
      node.boardState,
      isWhitesTurn
    );
    if (!isShortPathOccupied) {
      const newBoard = { ...node.boardState };
      if (isWhitesTurn) {
        newBoard.whiteKing = whiteKingShortCastleDestination;
        newBoard.whiteRook = clearPosition(newBoard, 8).whiteRook;
        newBoard.whiteRook = newBoard.whiteRook & whiteKingShortCastleRookDestination;
      } else {
        newBoard.blackKing = blackKingShortCastleDestination;
        newBoard.blackRook = clearPosition(newBoard, 64).blackRook;
        newBoard.blackRook = newBoard.blackRook & blackKingShortCastleRookDestination;
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
      isWhitesTurn
    );
  }
  return possibleNodes;
}

// src/helpers/search/nodes/knights/knightNodes.ts
function knightNodes(node, evalLogs) {
  let possibleNodes = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const knightsToMove = isWhitesTurn ? node.boardState.whiteKnight : node.boardState.blackKnight;
  const allFriendlyOccupiedPositions = isWhitesTurn ? allWhitePositions(node.boardState) : allBlackPositions(node.boardState);
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

// src/helpers/search/nodes/pawns/pawnNodes.ts
function whitePawnNodes(node) {
  const allOccupiedPositions = allPositions(node.boardState);
  const allOccupiedBlackPositions = allBlackPositions(node.boardState);
  const singleStepMoves = whitePawnOneSquareNodes(node, allOccupiedPositions);
  const doubleStepMoves = whitePawnTwoSquareNodes(node, allOccupiedPositions);
  const captures = whitePawnCaptureNodes(node, allOccupiedBlackPositions);
  const allMoves = [...singleStepMoves, ...doubleStepMoves, ...captures];
  return allMoves;
}
function whitePawnOneSquareNodes(node, allOccupiedPositions) {
  let newNodes = [];
  const potentialMoves = AllWhitePawnMovesOneSquare(
    node.boardState,
    allOccupiedPositions
  );
  for (let i = 0; i < 64; i++) {
    const moveBit = BigInt(1) << BigInt(i);
    const offset = 64 - i;
    const newBoardState = applyMove(
      node.boardState,
      offset - 8,
      offset,
      "whitePawn"
    );
    if (potentialMoves & moveBit) {
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }
  return newNodes;
}
function whitePawnTwoSquareNodes(node, allOccupiedPositions) {
  let newNodes = [];
  const potentialTwoStepMoves = AllWhitePawnMovesTwoSquare(
    node.boardState,
    allOccupiedPositions
  );
  for (let i = 0; i < 64; i++) {
    const moveBit = BigInt(1) << BigInt(i);
    if (potentialTwoStepMoves & moveBit) {
      const offset = 64 - i;
      const newBoardState = applyMove(
        node.boardState,
        offset - 16,
        offset,
        "whitePawn"
      );
      if (potentialTwoStepMoves & moveBit) {
        newNodes = pushNewNode(
          newNodes,
          node,
          newBoardState,
          evalLoggingOff,
          0
        );
      }
    }
  }
  return newNodes;
}
function whitePawnCaptureNodes(node, allOccupiedBlackPositions) {
  let newNodes = [];
  const leftCapturePositions = (node.boardState.whitePawn & ~bTohFilesOnly) >> BigInt(7);
  const rightCapturePositions = (node.boardState.whitePawn & ~aTogFilesOnly) >> BigInt(9);
  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;
    fromIndex = i + 7;
    toIndex = i;
    if ((leftCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedBlackPositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      const newBoardState = applyMove(
        node.boardState,
        64 - fromIndex,
        64 - toIndex,
        "whitePawn"
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
    fromIndex = i + 9;
    toIndex = i;
    if ((rightCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedBlackPositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      const newBoardState = applyMove(
        node.boardState,
        64 - fromIndex,
        64 - toIndex,
        "whitePawn"
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }
  return newNodes;
}
function blackPawnNodes(node) {
  const allOccupiedPositions = allPositions(node.boardState);
  const allOccupiedWhitePositions = allWhitePositions(node.boardState);
  const singleStepMoves = blackPawnOneSquareNodes(node, allOccupiedPositions);
  const doubleStepMoves = blackPawnTwoSquareNodes(node, allOccupiedPositions);
  const captures = blackPawnCaptureNodes(node, allOccupiedWhitePositions);
  const allMoves = [...singleStepMoves, ...doubleStepMoves, ...captures];
  return allMoves;
}
function blackPawnOneSquareNodes(node, allOccupiedPositions) {
  let newNodes = [];
  const potentialMoves = AllBlackPawnMovesOneSquare(
    node.boardState,
    allOccupiedPositions
  );
  const a1Position = 64;
  const h8Position = 1;
  for (let position = h8Position; position <= a1Position; position++) {
    const positionBit = BigInt(1) << BigInt(position);
    if (potentialMoves & positionBit) {
      const newBoardState = applyMove(
        node.boardState,
        64 - position + 8,
        64 - position,
        "blackPawn"
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }
  return newNodes;
}
function blackPawnTwoSquareNodes(node, allOccupiedPositions) {
  let newNodes = [];
  const potentialTwoStepMoves = AllBlackPawnMovesTwoSquare(
    node.boardState,
    allOccupiedPositions
  );
  const a1Position = 64;
  const h8Position = 1;
  for (let position = h8Position; position <= a1Position; position++) {
    const positionBit = BigInt(1) << BigInt(position);
    if (potentialTwoStepMoves & positionBit) {
      const newBoardState = applyMove(
        node.boardState,
        64 - position + 16,
        64 - position,
        "blackPawn"
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }
  return newNodes;
}
function blackPawnCaptureNodes(node, allOccupiedWhitePositions) {
  let newNodes = [];
  const leftCapturePositions = (node.boardState.blackPawn & ~bTohFilesOnly) << BigInt(9);
  const rightCapturePositions = (node.boardState.blackPawn & ~aTogFilesOnly) << BigInt(7);
  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;
    fromIndex = i - 9;
    toIndex = i;
    if ((leftCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedWhitePositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      const newBoardState = applyMove(
        node.boardState,
        64 - fromIndex,
        64 - toIndex,
        "blackPawn"
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
    fromIndex = i - 7;
    toIndex = i;
    if ((rightCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedWhitePositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      const newBoardState = applyMove(
        node.boardState,
        64 - fromIndex,
        64 - toIndex,
        "blackPawn"
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }
  return newNodes;
}

// src/helpers/search/nodes/queens/queenNodes.ts
function queenNodes(node, evalLogs) {
  let possibleNodes = [];
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const queensToMove = isWhitesTurn ? node.boardState.whiteQueen : node.boardState.blackQueen;
  const queenPositions = findBitPositions(queensToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn ? allWhitePositions(node.boardState) : allBlackPositions(node.boardState);
  const allEnemyOccupiedPositions = isWhitesTurn ? allBlackPositions(node.boardState) : allWhitePositions(node.boardState);
  queenPositions.forEach((queenPosition) => {
    const offsets = [...orthagonalOffsets, ...diagonalOffsets];
    offsets.forEach((offset) => {
      let lastPosition = queenPosition;
      for (let newPosition = queenPosition + offset; newPosition >= 1 && newPosition <= 64; newPosition += offset) {
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

// src/helpers/search/nodes/rooks/rookNodes.ts
function rookNodes(node, evalLogs) {
  let possibleNodes = [];
  console.log(`black king check status: ${node.gameState.blackKingChecked}`);
  const isWhitesTurn = node.gameState.isWhitesTurn;
  const rooksToMove = isWhitesTurn ? node.boardState.whiteRook : node.boardState.blackRook;
  const rookPositions = findBitPositions(rooksToMove);
  const allFriendlyOccupiedPositions = isWhitesTurn ? allWhitePositions(node.boardState) : allBlackPositions(node.boardState);
  const allEnemyOccupiedPositions = isWhitesTurn ? allBlackPositions(node.boardState) : allWhitePositions(node.boardState);
  rookPositions.forEach((rookPosition) => {
    const offsets = orthagonalOffsets;
    offsets.forEach((offset) => {
      let lastPosition = rookPosition;
      for (let newPosition = rookPosition + offset; newPosition >= 1 && newPosition <= 64; newPosition += offset) {
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
            isWhitesTurn ? "whiteRook" : "blackRook"
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

// src/helpers/search/nodes/nodeGenerators.ts
function pushNewNode(currentNodeList, parentNode, newBoardState, evalLogs, depth) {
  const newGameState = {
    ...parentNode.gameState,
    isWhitesTurn: !parentNode.gameState.isWhitesTurn
  };
  const movingPlayerProposedCheckStatus = isOpponentCheckedMemo(
    newBoardState,
    !parentNode.gameState.isWhitesTurn
  );
  if (movingPlayerProposedCheckStatus.check) {
    console.log("checked");
    return currentNodeList;
  }
  const newNode = {
    boardState: newBoardState,
    gameState: newGameState,
    parentId: parentNode.id,
    id: generateNodeId()
  };
  currentNodeList.push(newNode);
  if (evalLogs.evalLoggingEnabled) {
    evalLogs.evalAddNode(newNode, depth);
  }
  return currentNodeList;
}
function generateLegalMoves(node) {
  if (node.gameState.isWhitesTurn) {
    const whitePawns = whitePawnNodes(node);
    const whiteKnights = knightNodes(node, evalLoggingOff);
    const whiteBishops = bishopNodes(node, evalLoggingOff);
    const whiteRooks = rookNodes(node, evalLoggingOff);
    const whiteKing = kingNodes(node, evalLoggingOff);
    const whiteKingCastles = kingCastlingNodes(node, evalLoggingOff);
    const whiteQueen = queenNodes(node, evalLoggingOff);
    return [
      ...whitePawns,
      ...whiteKnights,
      ...whiteBishops,
      ...whiteRooks,
      ...whiteKing,
      ...whiteQueen,
      ...whiteKingCastles
    ];
  }
  const blackPawns = blackPawnNodes(node);
  const blackKnights = knightNodes(node, evalLoggingOff);
  const blackBishop = bishopNodes(node, evalLoggingOff);
  const blackRooks = rookNodes(node, evalLoggingOff);
  const blackKing = kingNodes(node, evalLoggingOff);
  const blackKingCastles = kingCastlingNodes(node, evalLoggingOff);
  const blackQueen = queenNodes(node, evalLoggingOff);
  return [
    ...blackPawns,
    ...blackKnights,
    ...blackBishop,
    ...blackRooks,
    ...blackKing,
    ...blackQueen,
    ...blackKingCastles
  ];
}
function generateNodeId() {
  return crypto.randomUUID();
}
function StartingNode() {
  const startBoard = { ...StartingBoard };
  const startStatus = { ...InitialGameStatus };
  const startNode = {
    boardState: startBoard,
    gameState: startStatus,
    parentId: "",
    id: generateNodeId()
  };
  return startNode;
}
function NodeFactory(parentNode, newBoardState) {
  const newGameState = {
    ...parentNode.gameState
  };
  newGameState.isWhitesTurn = !parentNode.gameState.isWhitesTurn;
  const newNode = {
    parentId: parentNode.id,
    boardState: newBoardState,
    gameState: newGameState,
    id: generateNodeId()
  };
  return newNode;
}

// src/helpers/search/minimax.ts
function maxMove(node, depth, scoreForWhite, evalLogs) {
  if (depth === 0 || node.gameState.isGameOver) {
    const score = evaluateBoard(node.boardState, scoreForWhite);
    const scoredNoMove = noMove(score);
    evalLogs.evalAddNode(node, depth);
    return scoredNoMove;
  }
  let maxEval = -Infinity;
  let maxMove2 = node.boardState;
  const possibleMaximiserMoves = generateLegalMoves(node);
  for (let possibleNode of possibleMaximiserMoves) {
    const maxScoreFromPossibleNode = miniMax(
      possibleNode,
      depth - 1,
      false,
      scoreForWhite,
      evalLogs
    );
    if (maxScoreFromPossibleNode > maxEval) {
      maxEval = maxScoreFromPossibleNode;
      maxMove2 = possibleNode.boardState;
    }
  }
  evalLogs.evalAddNode(node, depth);
  return scoredMove(maxEval, node.boardState, maxMove2);
}
function miniMax(node, depth, maximiserTurn, scoreForWhite, evalLogs) {
  let score = 0;
  if (depth === 0 || node.gameState.isGameOver) {
    score = evaluateBoard(node.boardState, scoreForWhite);
    node.gameState.positionEvaluation = score;
    evalLogs.evalAddNode(node, depth);
    return score;
  }
  if (maximiserTurn) {
    let maxEval = -Infinity;
    let maxMove2 = noMove(maxEval);
    const possibleMaximiserMoves = generateLegalMoves(node);
    for (let possibleNode of possibleMaximiserMoves) {
      const maxScoreFromPossibleNode = miniMax(
        possibleNode,
        depth - 1,
        !maximiserTurn,
        scoreForWhite,
        evalLogs
      );
      if (maxScoreFromPossibleNode > maxEval) {
        maxEval = maxScoreFromPossibleNode;
      }
    }
    node.gameState.positionEvaluation = maxEval;
    evalLogs.evalAddNode(node, depth);
    return maxEval;
  }
  let minEval = Infinity;
  const possibleMinimiserMoves = generateLegalMoves(node);
  for (let possibleNode of possibleMinimiserMoves) {
    const minScoreFromPossibleNode = miniMax(
      possibleNode,
      depth - 1,
      !maximiserTurn,
      scoreForWhite,
      evalLogs
    );
    if (minScoreFromPossibleNode < minEval) {
      minEval = minScoreFromPossibleNode;
    }
  }
  node.gameState.positionEvaluation = minEval;
  evalLogs.evalAddNode(node, depth);
  return minEval;
}
function noMove(score) {
  return {
    from: 0,
    to: 0,
    piece: "none",
    pieceTaken: "none",
    score
  };
}
function scoredMove(score, previousBoardState, newBoardState) {
  let scoredBitmove = getMoveFromBoardStates(previousBoardState, newBoardState);
  scoredBitmove.score = score;
  return scoredBitmove;
}

// src/helpers/moveEval.ts
function FindBestMoves(currentBoard, isWhitesTurn) {
  const legalMoves = generateLegalMoves2(currentBoard, isWhitesTurn);
  const moveScores = [];
  console.log(`legal moves: ${legalMoves}`);
  for (let possibleMove of legalMoves) {
    const moveResult = evaluateMove(currentBoard, possibleMove, isWhitesTurn);
    moveScores.push({
      score: moveResult.score,
      move: possibleMove,
      boardState: moveResult.boardState
    });
  }
  moveScores.sort((a, b) => b.score - a.score);
  return moveScores.slice(0, 3);
}
async function FindBestMoveMiniMax(currentBoard, currentGameState, engineDepth) {
  const currentNode = {
    boardState: currentBoard,
    gameState: currentGameState,
    parentId: "",
    id: generateNodeId()
  };
  const bestMove = maxMove(
    currentNode,
    engineDepth,
    currentGameState.isWhitesTurn,
    evalLoggingOff
  );
  return bestMove;
}
function generateLegalMoves2(currentBoard, isWhitesTurn) {
  if (isWhitesTurn) {
    const whitePawns = WhitePawnMovesComposite(currentBoard);
    return whitePawns;
  }
  const blackPawns = BlackPawnMovesComposite(currentBoard);
  return blackPawns;
}
function evaluateMove(currentBoard, move, evaluateForWhite) {
  let newBoard = { ...currentBoard };
  newBoard = applyMove(currentBoard, move.from, move.to, move.piece);
  return {
    boardState: currentBoard,
    move,
    score: evaluateBoard(newBoard, evaluateForWhite)
  };
}
function WhitePawnMovesOneSquare(boardState, allOccupiedPositions) {
  const moves = [];
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
        castleRookTo: 0
      });
    }
  }
  return moves;
}
function WhitePawnMovesTwoSquare(boardState, allOccupiedPositions) {
  const moves = [];
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
        castleRookTo: 0
      });
    }
  }
  return moves;
}
function WhitePawnCaptures(boardState, allOccupiedBlackPositions) {
  const moves = [];
  const leftCapturePositions = (boardState.whitePawn & ~bTohFilesOnly) >> BigInt(7);
  const rightCapturePositions = (boardState.whitePawn & ~aTogFilesOnly) >> BigInt(9);
  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;
    fromIndex = i + 7;
    toIndex = i;
    if ((leftCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedBlackPositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "whitePawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0
      });
    }
    fromIndex = i + 9;
    toIndex = i;
    if ((rightCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedBlackPositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "whitePawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0
      });
    }
  }
  return moves;
}
function WhitePawnMovesComposite(boardState) {
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
function AllWhitePawnMovesOneSquare(boardState, allOccupiedPositions) {
  const singleStepMoves = boardState.whitePawn >> BigInt(8) & ~allOccupiedPositions;
  return singleStepMoves;
}
function AllWhitePawnMovesTwoSquare(boardState, allOccupiedPositions) {
  const whitePawnsStartRank = StartingBoard.whitePawn;
  const whitePawnsOnStartRank = boardState.whitePawn & whitePawnsStartRank;
  const potentialTwoStepMoves = whitePawnsOnStartRank >> BigInt(16);
  const oneStepAhead = whitePawnsOnStartRank >> BigInt(8);
  const twoStepsClear = ~(oneStepAhead | potentialTwoStepMoves) & ~allOccupiedPositions;
  const finalTwoStepMoves = potentialTwoStepMoves & twoStepsClear << BigInt(8);
  return finalTwoStepMoves;
}
function AllWhitePawnCaptures(boardState, allOccupiedBlackPositions) {
  const leftCaptures = (boardState.whitePawn & ~BigInt("0x0101010101010101")) >> BigInt(7) & allOccupiedBlackPositions;
  const rightCaptures = (boardState.whitePawn & ~BigInt("0x8080808080808080")) >> BigInt(9) & allOccupiedBlackPositions;
  return leftCaptures | rightCaptures;
}
function AllWhitePawnMovesComposite(boardState) {
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
function BlackPawnMovesOneSquare(boardState, allOccupiedPositions) {
  const moves = [];
  const potentialMoves = AllBlackPawnMovesOneSquare(
    boardState,
    allOccupiedPositions
  );
  const a1Position = 64;
  const h8Position = 1;
  for (let position = h8Position; position <= a1Position; position++) {
    const positionBit = BigInt(1) << BigInt(position);
    if (potentialMoves & positionBit) {
      moves.push({
        from: 64 - position + 8,
        to: 64 - position,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0
      });
    }
  }
  return moves;
}
function BlackPawnMovesTwoSquare(boardState, allOccupiedPositions) {
  const moves = [];
  const blackPawnsStartRank = StartingBoard.blackPawn;
  const blackPawnsOnStartRank = boardState.blackPawn & blackPawnsStartRank;
  const potentialTwoStepMoves = AllBlackPawnMovesTwoSquare(
    boardState,
    allOccupiedPositions
  );
  const a1Position = 64;
  const h8Position = 1;
  for (let position = h8Position; position <= a1Position; position++) {
    const positionBit = BigInt(1) << BigInt(position);
    if (potentialTwoStepMoves & positionBit) {
      moves.push({
        from: 64 - position + 16,
        to: 64 - position,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0
      });
    }
  }
  return moves;
}
function BlackPawnCaptures(boardState, allOccupiedWhitePositions) {
  const moves = [];
  const leftCapturePositions = (boardState.blackPawn & ~bTohFilesOnly) << BigInt(9);
  const rightCapturePositions = (boardState.blackPawn & ~aTogFilesOnly) << BigInt(7);
  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;
    fromIndex = i - 9;
    toIndex = i;
    if ((leftCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedWhitePositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0
      });
    }
    fromIndex = i - 7;
    toIndex = i;
    if ((rightCapturePositions & BigInt(1) << BigInt(i)) !== BigInt(0) && (allOccupiedWhitePositions & BigInt(1) << BigInt(i)) !== BigInt(0)) {
      moves.push({
        from: 64 - fromIndex,
        to: 64 - toIndex,
        piece: "blackPawn",
        pieceTaken: "none",
        score: 0,
        evaluations: 0,
        castleRookFrom: 0,
        castleRookTo: 0
      });
    }
  }
  return moves;
}
function BlackPawnMovesComposite(boardState) {
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
function AllBlackPawnMovesOneSquare(boardState, allOccupiedPositions) {
  const singleStepMoves = boardState.blackPawn << BigInt(8) & ~allOccupiedPositions;
  return singleStepMoves;
}
function AllBlackPawnMovesTwoSquare(boardState, allOccupiedPositions) {
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
function AllBlackPawnCaptures(boardState, allOccupiedWhitePositions) {
  const leftCaptures = (boardState.blackPawn & ~BigInt("0x0101010101010101")) << BigInt(9) & allOccupiedWhitePositions;
  const rightCaptures = (boardState.blackPawn & ~BigInt("0x8080808080808080")) << BigInt(7) & allOccupiedWhitePositions;
  return leftCaptures | rightCaptures;
}
function AllBlackPawnMovesComposite(boardState) {
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
function AllKnightMoves(boardState, allFriendlyOccupiedPositions, evaluateForWhite) {
  const knightsToMove = evaluateForWhite ? boardState.whiteKnight : boardState.blackKnight;
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
        knightMoves = knightMoves | (evaluateForWhite ? newBoardState.whiteKnight : newBoardState.blackKnight);
      }
    });
  });
  return knightMoves & ~(evaluateForWhite ? boardState.whiteKnight : boardState.blackKnight);
}
function AllBishopMoves(boardState, allFriendlyOccupiedPositions, allEnemyOccupiedPositions, evaluateForWhite) {
  let possiblePositions = BigInt(0);
  const bishopsToMove = evaluateForWhite ? boardState.whiteBishop : boardState.blackBishop;
  const bishopPositions = findBitPositions(bishopsToMove);
  bishopPositions.forEach((bishopPosition) => {
    const offsets = diagonalOffsets;
    offsets.forEach((offset) => {
      let lastPosition = bishopPosition;
      for (let newPosition = bishopPosition + offset; newPosition >= 1 && newPosition <= 64; newPosition += offset) {
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
function AllRookMoves(boardState, allFriendlyOccupiedPositions, allEnemyOccupiedPositions, evaluateForWhite) {
  let possiblePositions = BigInt(0);
  const rooksToMove = evaluateForWhite ? boardState.whiteRook : boardState.blackRook;
  const rookPositions = findBitPositions(rooksToMove);
  rookPositions.forEach((rookPosition) => {
    const offsets = orthagonalOffsets;
    offsets.forEach((offset) => {
      let lastPosition = rookPosition;
      for (let newPosition = rookPosition + offset; newPosition >= 1 && newPosition <= 64; newPosition += offset) {
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
function AllKingMoves(boardState, allFriendlyOccupiedPositions, evaluateForWhite) {
  let possiblePositions = BigInt(0);
  const kingToMove = evaluateForWhite ? boardState.whiteKing : boardState.blackKing;
  const kingPositions = findBitPositions(kingToMove);
  kingPositions.forEach((kingPosition) => {
    const offsets = [...orthagonalOffsets, ...diagonalOffsets];
    offsets.forEach((offset) => {
      let newPosition = kingPosition + offset;
      if (newPosition < 1 || newPosition > 64) {
        return;
      }
      if (!isOccupiedComposite(allFriendlyOccupiedPositions, newPosition) && !isAtoHwraparound(kingPosition, newPosition)) {
        possiblePositions |= binaryMask64(
          newPosition,
          "all_zeroes_with_position_as_one"
        );
      }
    });
  });
  return possiblePositions;
}
function AllQueenMoves(boardState, allFriendlyOccupiedPositions, allEnemyOccupiedPositions, evaluateForWhite) {
  let possiblePositions = BigInt(0);
  const queensToMove = evaluateForWhite ? boardState.whiteQueen : boardState.blackQueen;
  const queenPositions = findBitPositions(queensToMove);
  queenPositions.forEach((queenPosition) => {
    const offsets = [...diagonalOffsets, ...orthagonalOffsets];
    offsets.forEach((offset) => {
      let lastPosition = queenPosition;
      for (let newPosition = queenPosition + offset; newPosition >= 1 && newPosition <= 64; newPosition += offset) {
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
function AllCompiledMoves(boardState, evaluateForWhite, treatKingAsCapture) {
  const friendlyPositions = evaluateForWhite ? allWhitePositions(boardState) : allBlackPositions(boardState);
  const enemyPositions = evaluateForWhite ? allBlackPositions(boardState) : allWhitePositions(boardState);
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
  const pawnMoves = evaluateForWhite ? AllWhitePawnCaptures(boardState, enemyPositions) : AllBlackPawnCaptures(boardState, enemyPositions);
  return queenMoves | rookMoves | bishopMoves | pawnMoves | knightMoves | kingMoves;
}

// src/helpers/cache/cacheHelper.ts
var memoize = (fn) => {
  const cache = /* @__PURE__ */ new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// src/referee/referee.ts
function isLegalMove(moveAttempted, boardState, proposedBoardState) {
  if (moveAttempted.FileFrom === moveAttempted.FileTo && moveAttempted.RankFrom === moveAttempted.RankTo) {
    return { isLegal: false, reason: "no move detected" };
  }
  const evaluateForWhite = moveAttempted.PieceMoved ? moveAttempted.PieceMoved.includes("white") : false;
  const movingPlayerCurrentCheckStatus = isOpponentCheckedMemo(
    boardState,
    !evaluateForWhite
  );
  const movingPlayerProposedCheckStatus = isOpponentCheckedMemo(
    proposedBoardState,
    !evaluateForWhite
  );
  if (movingPlayerCurrentCheckStatus.check && movingPlayerProposedCheckStatus.check) {
    return { isLegal: false, reason: "need to move out of check" };
  }
  if (!movingPlayerCurrentCheckStatus.check && movingPlayerProposedCheckStatus.check) {
    return { isLegal: false, reason: "can't move into check" };
  }
  const bitMove = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const bitMoveMask = binaryMask64(bitMove, "all_zeroes_with_position_as_one");
  const friendlyPositions = evaluateForWhite ? allWhitePositions(boardState) : allBlackPositions(boardState);
  const enemyPositions = evaluateForWhite ? allBlackPositions(boardState) : allWhitePositions(boardState);
  if ((bitMoveMask & friendlyPositions) > BigInt(0)) {
    return { isLegal: false, reason: "can't take your own pieces" };
  }
  switch (moveAttempted.PieceMoved) {
    case "whitePawn":
    case "blackPawn":
      return {
        isLegal: isLegalPawnMove(moveAttempted, boardState),
        reason: "piece move rules evaluation"
      };
    case "whiteQueen":
    case "blackQueen":
      return {
        isLegal: isLegalQueenMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: "piece move rules evaluation"
      };
    case "whiteRook":
    case "blackRook":
      return {
        isLegal: isLegalRookMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: "piece move rules evaluation"
      };
    case "whiteKnight":
    case "blackKnight":
      return {
        isLegal: isLegalKnightMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: "piece move rules evaluation"
      };
    case "whiteBishop":
    case "blackBishop":
      return {
        isLegal: isLegalBishopMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: "piece move rules evaluation"
      };
    case "whiteKing":
    case "blackKing":
      return {
        isLegal: isLegalKingMove(
          moveAttempted,
          boardState,
          evaluateForWhite,
          friendlyPositions,
          enemyPositions
        ),
        reason: "piece move rules evaluation"
      };
    default:
      return { isLegal: true, reason: "fill your boots" };
  }
}
function isLegalQueenMove(moveAttempted, boardState, evaluateForWhite, friendlyPositions, enemyPositions) {
  const destinationPosition = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);
  if (destinationOccupiedBy?.includes("King")) {
    return false;
  }
  const destinationMask = binaryMask64(
    destinationPosition,
    "all_zeroes_with_position_as_one"
  );
  const allPossibleQueenMoves = AllQueenMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );
  return (allPossibleQueenMoves & destinationMask) > BigInt(0);
}
function isLegalKingMove(moveAttempted, boardState, evaluateForWhite, friendlyPositions, enemyPositions) {
  const destinationPosition = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);
  if (destinationOccupiedBy?.includes("King")) {
    return false;
  }
  const destinationMask = binaryMask64(
    destinationPosition,
    "all_zeroes_with_position_as_one"
  );
  const allPossibleKingMoves = AllKingMoves(
    boardState,
    friendlyPositions,
    evaluateForWhite
  );
  return (allPossibleKingMoves & destinationMask) > BigInt(0);
}
function isLegalRookMove(moveAttempted, boardState, evaluateForWhite, friendlyPositions, enemyPositions) {
  const destinationPosition = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);
  if (destinationOccupiedBy?.includes("King")) {
    return false;
  }
  const destinationMask = binaryMask64(
    destinationPosition,
    "all_zeroes_with_position_as_one"
  );
  const allPossibleRookMoves = AllRookMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );
  return (allPossibleRookMoves & destinationMask) > BigInt(0);
}
function isLegalBishopMove(moveAttempted, boardState, evaluateForWhite, friendlyPositions, enemyPositions) {
  const destinationPosition = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);
  if (destinationOccupiedBy?.includes("King")) {
    return false;
  }
  const destinationMask = binaryMask64(
    destinationPosition,
    "all_zeroes_with_position_as_one"
  );
  const allPossibleBishopMoves = AllBishopMoves(
    boardState,
    friendlyPositions,
    enemyPositions,
    evaluateForWhite
  );
  return (allPossibleBishopMoves & destinationMask) > BigInt(0);
}
function isLegalKnightMove(moveAttempted, boardState, evaluateForWhite, friendlyPositions, enemyPositions) {
  const destinationPosition = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);
  if (destinationOccupiedBy?.includes("King")) {
    return false;
  }
  const destinationMask = binaryMask64(
    destinationPosition,
    "all_zeroes_with_position_as_one"
  );
  const allPossibleKnightMoves = AllKnightMoves(
    boardState,
    friendlyPositions,
    evaluateForWhite
  );
  return (allPossibleKnightMoves & destinationMask) > BigInt(0);
}
function isLegalPawnMove(moveAttempted, boardState) {
  if (moveAttempted.PieceMoved === "whitePawn" && moveAttempted.RankFrom >= moveAttempted.RankTo) {
    return false;
  }
  if (moveAttempted.PieceMoved === "blackPawn" && moveAttempted.RankTo >= moveAttempted.RankFrom) {
    return false;
  }
  const destinationPosition = getBitBoardPosition(
    moveAttempted.FileTo,
    moveAttempted.RankTo
  );
  const ranksMoved = Math.abs(moveAttempted.RankFrom - moveAttempted.RankTo);
  const startingRank = isOnStartingRank(moveAttempted);
  const destinationOccupiedBy = occupiedBy(boardState, destinationPosition);
  MultiLog(
    1 /* log */,
    `${startingRank}, ${ranksMoved}, ${moveAttempted.PieceMoved})}`,
    LoggerConfig.verbosity
  );
  if (!startingRank && ranksMoved != 1) {
    return false;
  }
  if (startingRank && ranksMoved !== 1 && ranksMoved !== 2) {
    return false;
  }
  if (moveAttempted.FileFrom != moveAttempted.FileTo) {
    const indexOfFileFrom = files.indexOf(moveAttempted.FileFrom);
    const indexOfFileTo = files.indexOf(moveAttempted.FileTo);
    if (indexOfFileTo === indexOfFileFrom - 1 || indexOfFileTo === indexOfFileFrom + 1) {
      if (destinationOccupiedBy?.includes("King") || destinationOccupiedBy == null) {
        return false;
      }
    }
  } else {
    if (destinationOccupiedBy != null) {
      return false;
    }
  }
  return true;
}
function isOnStartingRank(moveAttempted) {
  return moveAttempted.PieceMoved === "whitePawn" && moveAttempted.RankFrom === whiteStartingRank || moveAttempted.PieceMoved === "blackPawn" && moveAttempted.RankFrom === blackStartingRank;
}
function isMyKingInCheck(currentBoard, evaluateForWhite) {
  return isOpponentChecked(currentBoard, !evaluateForWhite);
}
function isOpponentChecked(currentBoard, evaluateForWhite) {
  let check = false;
  let checkMate = false;
  const allMoves = AllCompiledMoves(currentBoard, evaluateForWhite, true);
  check = (allMoves & (evaluateForWhite ? currentBoard.blackKing : currentBoard.whiteKing)) > BigInt(0);
  return { check, checkMate };
}
var isOpponentCheckedMemo = memoize(isOpponentChecked);

// src/board.ts
function initBoard(arrangement) {
  switch (arrangement) {
    case 0 /* StartingPositions */:
      return StartingBoard;
    case 1 /* MiddleGame */:
      return MiddleGameBoard;
    case 2 /* EndGame */:
      return EndGameBoard;
    case 3 /* DuellingPawns */:
      return DuellingPawnsBoard;
    case 4 /* EmptyBoard */:
      return EmptyBoard;
    case 5 /* MiniMaxOne */:
      return MiniMaxTestBoardOne;
    case 6 /* MateInOneForBlackGameBoard */:
      return MateInOneForBlackGameBoard;
    case 7 /* MateInOneForWhiteGameBoard */:
      return MateInOneForWhiteGameBoard;
    case 8 /* CastleForBlackGameBoard */:
      return CastleForBlackGameBoard;
    case 9 /* BlackLongCastledGameBoard */:
      return BlackLongCastledGameBoard;
    case 10 /* BlackShortCastledGameBoard */:
      return BlackShortCastledGameBoard;
    case 11 /* CastleForBlackAfter */:
      return CastleForBlackAfterGameBoard;
    default:
      return StartingBoard;
  }
}
function BoardArray(currentBitBoard) {
  const board = Array.from(
    { length: xOrYTileLength },
    () => Array(8).fill(null)
  );
  for (let piece in currentBitBoard) {
    for (let square = 0; square < numberOfTiles; square++) {
      if ((currentBitBoard[piece] & BigInt(1) << BigInt(square)) !== BigInt(0)) {
        const row = xOrYTileLength - 1 - Math.floor(square / xOrYTileLength);
        const col = square % xOrYTileLength;
        if (board[row] && board[row][col] !== void 0) {
          board[row][col] = piece;
        }
      }
    }
  }
  return board;
}
function movePiece(currentBitBoard, pieceType, rankFrom, fileFrom, rankTo, fileTo) {
  MultiLog(
    3 /* info */,
    `requested a move for a ${pieceType} from ${fileFrom}${rankFrom} to ${fileTo}${rankTo}`,
    LoggerConfig.verbosity
  );
  fileFrom = fileFrom.toLowerCase();
  fileTo = fileTo.toLowerCase();
  const moveAttempted = {
    FileFrom: fileFrom,
    FileTo: fileTo,
    RankFrom: rankFrom,
    RankTo: rankTo,
    isLegal: false,
    PieceMoved: pieceType,
    PieceTaken: null
  };
  const newState = moveSlidingPiece(
    currentBitBoard,
    rankFrom,
    fileFrom,
    rankTo,
    fileTo,
    pieceType != null ? pieceType : "whitePawn"
  );
  const isLegal = isLegalMove(moveAttempted, currentBitBoard, newState);
  moveAttempted.isLegal = isLegal.isLegal;
  if (!fileFrom || !fileTo || !isLegal) {
    return {
      BoardState: currentBitBoard,
      MoveAttempted: moveAttempted
    };
  }
  if (isLegal) {
    MultiLog(3 /* info */, "It's a legal move", LoggerConfig.verbosity);
  }
  if (pieceType != null) {
    return {
      BoardState: newState,
      MoveAttempted: {
        FileFrom: fileFrom,
        FileTo: fileTo,
        RankFrom: rankFrom,
        RankTo: rankTo,
        isLegal: isLegal.isLegal,
        PieceMoved: pieceType,
        PieceTaken: null
      }
    };
  }
  return {
    BoardState: currentBitBoard,
    MoveAttempted: {
      FileFrom: fileFrom,
      FileTo: fileTo,
      RankFrom: rankFrom,
      RankTo: rankTo,
      isLegal: isLegal.isLegal,
      PieceMoved: pieceType,
      PieceTaken: null
    }
  };
}
function getFile(x, boardWidth, xOffset) {
  x = x - xOffset;
  const tileWidth = boardWidth / 8;
  const fileIndex = Math.floor(x / tileWidth);
  return files[fileIndex];
}
function getRank(y, boardHeight, yOffset) {
  y = y - yOffset;
  const tileHeight = boardHeight / 8;
  const reverseRank = Math.floor(y / tileHeight) + 1;
  const rank = 7 - reverseRank + 2;
  return rank;
}
function moveSlidingPiece(currentBitBoard, rankFrom, fileFrom, rankTo, fileTo, pieceType) {
  MultiLog(
    3 /* info */,
    `from ${fileFrom}${rankFrom} to ${fileTo}${rankTo}`,
    LoggerConfig.verbosity
  );
  const fromPosition = getBitBoardPosition(fileFrom, rankFrom);
  const toPosition = getBitBoardPosition(fileTo, rankTo);
  MultiLog(
    3 /* info */,
    `from ${fromPosition} to ${toPosition}`,
    LoggerConfig.verbosity
  );
  const newPawns = applyMove(
    currentBitBoard,
    fromPosition,
    toPosition,
    pieceType
  );
  return newPawns;
}
function getPathAlgabraic(move) {
  let positionsArray = [];
  if (move.FileFrom === move.FileTo) {
    if (move.RankFrom > move.RankTo) {
      for (let i = move.RankFrom; i > move.RankTo; i--) {
        positionsArray.push({ rank: i - 1, file: move.FileFrom });
      }
    } else {
      for (let i = move.RankFrom; i < move.RankTo; i++) {
        positionsArray.push({ rank: i + 1, file: move.FileFrom });
      }
    }
  } else {
    if (move.RankFrom === move.RankTo) {
      const fileFromIndex = files.indexOf(move.FileFrom);
      const fileToIndex = files.indexOf(move.FileTo);
      const slideRight = fileFromIndex < fileToIndex;
      for (let i = fileFromIndex; i > fileToIndex; slideRight ? i-- : i++) {
        positionsArray.push({ rank: move.RankFrom, file: files[i] });
      }
    }
  }
  return positionsArray;
}
function bitMoveToBoardMove(bitMove) {
  const boardMoveTo = getFileAndRank(bitMove.to);
  const boardMoveFrom = getFileAndRank(bitMove.from);
  return {
    PieceMoved: bitMove.piece,
    PieceTaken: bitMove.pieceTaken,
    FileFrom: boardMoveFrom.file,
    FileTo: boardMoveTo.file,
    RankFrom: boardMoveFrom.rank,
    RankTo: boardMoveTo.rank,
    isLegal: true
  };
}

// src/helpers/openings.ts
var whiteKingsPawn = BigInt(
  "0b0000000011110111000000000000100000000000000000000000000000000000"
);

// src/logging/evaluationLogs.ts
var createEvalLogs = () => {
  return {
    evalLayers: [],
    evalLoggingEnabled: true,
    evalAddNode(gameNode, depth) {
      let layer = this.evalLayers.find((layer2) => layer2.depth === depth);
      if (!layer) {
        layer = { depth, evaluations: [] };
        this.evalLayers.push(layer);
      }
      layer.evaluations.push(gameNode);
    }
  };
};
var outputEvalLogs = (logs) => {
  console.log("Logging all evaluation layers and game nodes:");
  logs.evalLayers.forEach((layer) => {
    console.log(`Layer depth: ${layer.depth}`);
    layer.evaluations.forEach((node) => {
      console.log("  GameNode:");
      console.log(`    - Board State: ${JSON.stringify(node.boardState)}`);
      console.log(`    - Game Status:`);
      console.log(`        - Is White's Turn: ${node.gameState.isWhitesTurn}`);
      console.log(`        - Is Game Over: ${node.gameState.isGameOver}`);
      console.log(
        `        - Position Evaluation: ${node.gameState.positionEvaluation}`
      );
      console.log(
        `        - White Computer Control: ${node.gameState.whiteComputerControl}`
      );
      console.log(
        `        - Black Computer Control: ${node.gameState.blackComputerControl}`
      );
      console.log(
        `        - Move History: ${JSON.stringify(node.gameState.moveHistory)}`
      );
    });
  });
};
var outputEvalLogsHtml = (logs, testName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Evaluation Logs - ${testName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h2 {
          color: #2c3e50;
        }
        pre {
          background: #f4f4f4;
          padding: 10px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <h1>${testName}</h1>
      ${logs.evalLayers.map(
    (layer) => `
          <div>
            <h2>Layer Depth: ${layer.depth}</h2>
            <div>
              ${layer.evaluations.map(
      (node) => `
                  
                  <h3 id="${node.id}">GameNode: ${node.id}</h3><p><a href="#${node.parentId}">go to parent</a></p>
                  <p>Board State:</p>
                  <pre>${LogBoardPositionsHTML(node.boardState)}</pre>
                  <p>Game Status:</p>
                  <pre>${JSON.stringify(node.gameState, null, 2)}</pre>
                  <p>Bitboards:</p>
                  <pre>${JSON.stringify(
        bitBoardsReadable(node.boardState),
        null,
        2
      )}</pre>`
    ).join("")}
            </div>
          </div>`
  ).join("")}
    </body>
    </html>`;
  const date = /* @__PURE__ */ new Date();
  const timestamp = date.toISOString().replace(/:/g, "-");
  const fileName = `logs\\eval_logs_${timestamp}.html`;
  console.log(fileName);
};
function LogBoardPositionsHTML(currentBoard) {
  const board = BoardArray(currentBoard);
  let htmlContent = "<table style='border-collapse: collapse;'>";
  for (let row = 7; row >= 0; row--) {
    let rowHtml = "<tr>";
    for (let col = 7; col >= 0; col--) {
      const piece = board[row][col];
      const cellContent = piece ? unicodePieceMap[piece] || piece : ".";
      const isWhiteSquare = (row + col) % 2 === 0;
      const bgColor = isWhiteSquare ? "#f0d9b5" : "#b58863";
      const cellStyle = `width: 25px; height: 25px; text-align: center; vertical-align: middle; background-color: ${bgColor}; font-size: 20px;`;
      rowHtml += `<td style="${cellStyle}">${cellContent}</td>`;
    }
    rowHtml += "</tr>";
    htmlContent += rowHtml;
  }
  htmlContent += "</table>";
  return htmlContent;
}
var outputSinglePiecePositions = (piecePositions, piece, testName) => {
  const newBoard = EmptyBoard;
  newBoard[piece] = piecePositions;
  outputSingleBitboardHtml(newBoard, null, testName);
};
var outputSingleBitboardHtml = (currentBoard, currentGameState, testName) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Single Board - ${testName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h2 {
          color: #2c3e50;
        }
        pre {
          background: #f4f4f4;
          padding: 10px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <h1>${testName}</h1>
                <div>
          
            <div>
             
                  <p>Board State:</p>
                  <pre>${LogBoardPositionsHTML(currentBoard)}</pre>
                  <p>Game Status:</p>
                  <pre>${JSON.stringify(currentGameState, null, 2)}</pre>
                  <p>Bitboards:</p>
                  <pre>${JSON.stringify(
    bitBoardsReadable(currentBoard),
    null,
    2
  )}</pre>
               
            </div>
          </div>
    </body>
    </html>`;
  const date = /* @__PURE__ */ new Date();
  const timestamp = date.toISOString().replace(/:/g, "-");
  const fileName = `logs\\eval_logs_${timestamp}.html`;
  console.log(fileName);
};
export {
  AllBishopMoves,
  AllBlackPawnCaptures,
  AllBlackPawnMovesComposite,
  AllBlackPawnMovesOneSquare,
  AllBlackPawnMovesTwoSquare,
  AllCompiledMoves,
  AllKingMoves,
  AllKnightMoves,
  AllQueenMoves,
  AllRookMoves,
  AllWhitePawnCaptures,
  AllWhitePawnMovesComposite,
  AllWhitePawnMovesOneSquare,
  AllWhitePawnMovesTwoSquare,
  BlackAdvantageBoard,
  BlackLongCastledGameBoard,
  BlackPawnCaptures,
  BlackPawnMovesComposite,
  BlackPawnMovesOneSquare,
  BlackShortCastledGameBoard,
  BoardArrangements,
  BoardArray,
  CastleForBlackAfterGameBoard,
  CastleForBlackGameBoard,
  CentralDominanceWeightings,
  DuellingPawnsBoard,
  EmptyBoard,
  EndGameBoard,
  EvalWeightings,
  FindBestMoveMiniMax,
  FindBestMoves,
  InitialGameStatus,
  LogBoardPositionsHTML,
  LogLevels,
  LoggerConfig,
  MateInOneForBlackGameBoard,
  MateInOneForWhiteGameBoard,
  MiddleGameBoard,
  MiniMaxTestBoardOne,
  MultiLog,
  NodeFactory,
  RankWeightings,
  StartingBoard,
  StartingNode,
  WhitePawnCaptures,
  WhitePawnMovesComposite,
  a1,
  aTogFilesOnly,
  allBlackPositions,
  allOnes,
  allPositions,
  allWhitePositions,
  applyMove,
  bTohFilesOnly,
  bigIntToBinaryString,
  binaryMask64,
  bishopNodes,
  bitBoardsReadable,
  bitCount,
  bitMoveToBoardMove,
  blackKingLongCastleDestination,
  blackKingLongCastleRookDestination,
  blackKingLongCastleRoute,
  blackKingLongRook,
  blackKingShortCastleDestination,
  blackKingShortCastleRookDestination,
  blackKingShortCastleRoute,
  blackKingShortRook,
  blackPawnCaptureNodes,
  blackPawnChain_NoChains,
  blackPawnChain_Pyramid,
  blackPawnChain_ThreeIslands,
  blackPawnLongGuards,
  blackPawnNodes,
  blackPawnShortGuards,
  blackPawnTwoSquareNodes,
  blackStartingRank,
  clearPosition,
  createEvalLogs,
  diagonalOffsets,
  evalLoggingOff,
  evalLoggingOn,
  evaluateBoard,
  evaluateCentralDominanceAdvantages,
  evaluateFreedomToMove,
  evaluateKingSafety,
  evaluateMaterialAdvantages,
  evaluatePawnChains,
  evaluatePieceDevelopment,
  evaluatePositionalAdvantages,
  evaluatePromotionalPossibilities,
  files,
  findBitPosition,
  findBitPositionReverse,
  findBitPositions,
  fullBitMask,
  generateLegalMoves,
  generateNodeId,
  getBeforeAndAfterPositions,
  getBitBoardPosition,
  getCastledMoveFromBoardStates,
  getFile,
  getFileAndRank,
  getMoveFromBoardStates,
  getPathAlgabraic,
  getRank,
  getSinglePieceMoveFromBoardStates,
  h8,
  initBoard,
  isABCtoFGHwraparound,
  isAtoHwraparound,
  isLegalBishopMove,
  isLegalKingMove,
  isLegalKnightMove,
  isLegalMove,
  isLegalPawnMove,
  isLegalQueenMove,
  isLegalRookMove,
  isLongCastleRouteBlocked,
  isMyKingInCheck,
  isOccupied,
  isOccupiedComposite,
  isOnStartingRank,
  isOpponentChecked,
  isOpponentCheckedMemo,
  isShortCastleRouteBlocked,
  kingCastlingNodes,
  kingNodes,
  knightMoveOffsets,
  knightNodes,
  maxMove,
  memoize,
  movePiece,
  moveSlidingPiece,
  numberOfTiles,
  occupiedBy,
  orthagonalOffsets,
  outputEvalLogs,
  outputEvalLogsHtml,
  outputSingleBitboardHtml,
  outputSinglePiecePositions,
  pieceImages,
  pieceValues,
  pushNewNode,
  queenNodes,
  rookNodes,
  scoredMove,
  slidingPieces,
  unicodePieceMap,
  whiteKingLongCastleDestination,
  whiteKingLongCastleRookDestination,
  whiteKingLongCastleRoute,
  whiteKingLongRook,
  whiteKingShortCastleDestination,
  whiteKingShortCastleRookDestination,
  whiteKingShortCastleRoute,
  whiteKingShortRook,
  whiteKingsPawn,
  whitePawnCaptureNodes,
  whitePawnChain_NoChains,
  whitePawnChain_Pyramid,
  whitePawnChain_ThreeIslands,
  whitePawnLongGuards,
  whitePawnNodes,
  whitePawnShortGuards,
  whiteStartingRank,
  xOrYTileLength
};
