import { BitBoard, EvalLogs, GameStatus, PieceImages } from "../types";
export const InitialGameStatus: GameStatus = {
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
  blackKingCanCastleShort: true,
};
export const numberOfTiles = 64;
export const xOrYTileLength = 8;
export const blackStartingRank = 7;
export const whiteStartingRank = 2;
export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const aTogFilesOnly = BigInt(
  "0b0000000100000001000000010000000100000001000000010000000100000001"
);
export const bTohFilesOnly = BigInt(
  "0b1000000010000000100000001000000010000000100000001000000010000000"
);

export const a1 = BigInt(
  "0b1000000000000000000000000000000000000000000000000000000000000000"
);
export const h8 = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000001"
);

export const StartingBoard: BitBoard = {
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
  none: BigInt(0),
};

export const EmptyBoard: BitBoard = {
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
  none: BigInt(0),
};

export const allOnes = BigInt(
  "0b1111111111111111111111111111111111111111111111111111111111111111"
);

export enum BoardArrangements {
  StartingPositions,
  MiddleGame,
  EndGame,
  DuellingPawns,
  EmptyBoard,
  MiniMaxOne,
  MateInOneForBlackGameBoard,
  MateInOneForWhiteGameBoard,
  CastleForBlackGameBoard,
  BlackLongCastledGameBoard,
  BlackShortCastledGameBoard,
  CastleForBlackAfter,
}

export const pieceImages: PieceImages = {
  whitePawn: "pawn_w", //white pawns
  whiteKnight: "knight_w", //white knights
  whiteBishop: "bishop_w", //white bishops
  whiteRook: "rook_w", //white rooks
  whiteQueen: "queen_w", //white queen
  whiteKing: "king_w", //white king
  blackPawn: "pawn_b", //black pawns
  blackKnight: "knight_b", //black knights
  blackBishop: "bishop_b", //black bishops
  blackRook: "rook_b", //black rooks
  blackQueen: "queen_b", //black queen
  blackKing: "king_b", //black king
};

export const slidingPieces = [
  "whitePawn",
  "whiteBishop",
  "whiteQueen",
  "whiteKing",
  "whiteRook",
  "blackPawn",
  "blackBishop",
  "blackQueen",
  "blackKing",
  "blackRook",
];

export const unicodePieceMap = {
  whiteKing: "♔",
  whiteQueen: "♕",
  whiteRook: "♖",
  whiteBishop: "♗",
  whiteKnight: "♘",
  whitePawn: "♙",
  blackKing: "♚",
  blackQueen: "♛",
  blackRook: "♜",
  blackBishop: "♝",
  blackKnight: "♞",
  blackPawn: "♟",
};

export const pieceValues = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 20,
};

export const CentralDominanceWeightings = {
  absoluteCentre: BigInt(
    "0b0000000000000000000000000001100000011000000000000000000000000000"
  ),
  innerRing: BigInt(
    "0b0000000000000000001111000010010000100100001111000000000000000000"
  ),
  outerRing: BigInt(
    "0b0000000001111110010000100100001001000010010000100111111000000000"
  ),
};

export const RankWeightings = {
  secondRank: BigInt(
    "0b0000000011111111000000000000000000000000000000000000000000000000"
  ),
  seventhRank: BigInt(
    "0b0000000000000000000000000000000000000000000000001111111100000000"
  ),
};

export const EvalWeightings = {
  absoluteCentreWeight: 0.3,
  innerRingWeight: 0.1,
  outerRingWeight: 0,
  oneMoveUntilPromotionWeight: 6,
  pawnChainWeight: 0.1,
  developedBishopKnight: 0.2,
  developedRook: 0, //TODO: revisit this, maybe we should only consider connected rooks to be 'developed'?
  freedomToMove: 0.01,
  safeKing: 2,
};

export const evalLoggingOn: EvalLogs = {
  evalLayers: [],
  evalLoggingEnabled: true,
  evalAddNode: () => {
    return;
  },
};
export const evalLoggingOff: EvalLogs = {
  evalLayers: [],
  evalLoggingEnabled: false,
  evalAddNode: () => {
    return;
  },
};

export const knightMoveOffsets: number[] = [17, 15, 10, 6, -6, -10, -15, -17];
export const diagonalOffsets: number[] = [9, -9, 7, -7];
export const orthagonalOffsets: number[] = [1, -1, 8, -8];

export const fullBitMask = (BigInt(1) << BigInt(64)) - BigInt(1);

export const blackKingShortCastleRoute = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000110"
);
export const blackKingLongCastleRoute = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000001110000"
);
export const whiteKingShortCastleRoute = BigInt(
  "0b0000011000000000000000000000000000000000000000000000000000000000"
);
export const whiteKingLongCastleRoute = BigInt(
  "0b0111000000000000000000000000000000000000000000000000000000000000"
);

export const blackKingShortCastleDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000010"
);
export const blackKingLongCastleDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000100000"
);
export const whiteKingShortCastleDestination = BigInt(
  "0b0000001000000000000000000000000000000000000000000000000000000000"
);
export const whiteKingLongCastleDestination = BigInt(
  "0b0100000000000000000000000000000000000000000000000000000000000000"
);

export const blackKingShortCastleRookDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000100"
);
export const blackKingLongCastleRookDestination = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000010000"
);
export const whiteKingShortCastleRookDestination = BigInt(
  "0b0000001000000000000000000000000000000000000000000000000000000000"
);
export const whiteKingLongCastleRookDestination = BigInt(
  "0b0001000000000000000000000000000000000000000000000000000000000000"
);

export const blackKingShortRook = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000000000001"
);
export const blackKingLongRook = BigInt(
  "0b0000000000000000000000000000000000000000000000000000000010000000"
);
export const whiteKingShortRook = BigInt(
  "0b0000000100000000000000000000000000000000000000000000000000000000"
);
export const whiteKingLongRook = BigInt(
  "0b1000000000000000000000000000000000000000000000000000000000000000"
);

export const whitePawnLongGuards = BigInt(
  "0b0000000011100000000000000000000000000000000000000000000000000000"
);
export const whitePawnShortGuards = BigInt(
  "0b0000000000001110000000000000000000000000000000000000000000000000"
);
export const blackPawnLongGuards = BigInt(
  "0b0000000000000000000000000000000000000000000000001110000000000000"
);
export const blackPawnShortGuards = BigInt(
  "0b0000000000000000000000000000000000000000000000000000011100000000"
);

//Keep this at the bottom
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};