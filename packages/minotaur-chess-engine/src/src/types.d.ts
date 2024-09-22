export type BoardUpdateResponse = {
  BoardState: BitBoard;
  MoveAttempted: BoardMove;
};

export interface MinotaurConfig {
  pieceImages: {
    [key: string]: string;
  };
}

export type BoardMove = {
  PieceMoved: Piece;
  PieceTaken: Piece;
  FileFrom: string;
  FileTo: string;
  RankFrom: number;
  RankTo: number;
  isLegal: boolean;
};

export type Piece =
  | "whitePawn"
  | "whiteKnight"
  | "whiteBishop"
  | "whiteRook"
  | "whiteQueen"
  | "whiteKing"
  | "blackPawn"
  | "blackKnight"
  | "blackBishop"
  | "blackRook"
  | "blackQueen"
  | "blackKing"
  | null;

export type ChessboardArray = Piece[][];

export type Score = {
  score: number;
  move: BitMove;
  boardState: BitBoard;
};

export type ScoreArray = Score[];

export interface PieceImages {
  [key: string]: string;
  whitePawn: string;
  whiteKnight: string;
  whiteBishop: string;
  whiteRook: string;
  whiteQueen: string;
  whiteKing: string;
  blackPawn: string;
  blackKnight: string;
  blackBishop: string;
  blackRook: string;
  blackQueen: string;
  blackKing: string;
}

export interface BitBoard {
  whitePawn: bigint;
  whiteKnight: bigint;
  whiteBishop: bigint;
  whiteRook: bigint;
  whiteQueen: bigint;
  whiteKing: bigint;

  blackPawn: bigint;
  blackKnight: bigint;
  blackBishop: bigint;
  blackRook: bigint;
  blackQueen: bigint;
  blackKing: bigint;
  none: bigint;
}

export interface GameStatus {
  isWhitesTurn: boolean;
  isGameOver: boolean;
  moveHistory: BoardMove[];
  positionEvaluation: number;
  blackComputerControl: boolean;
  whiteComputerControl: boolean;
  blackKingChecked: boolean;
  whiteKingChecked: boolean;
  whiteKingCanCastleLong: boolean;
  whiteKingCanCastleShort: boolean;
  blackKingCanCastleLong: boolean;
  blackKingCanCastleShort: boolean;
}

export type BitMove = {
  from: number;
  to: number;
  piece: keyof BitBoard;
  pieceTaken: keyof BitBoard;
  score: number;
  evaluations: number;
  castleRookFrom: number;
  castleRookTo: number;
};

export type GameNode = {
  boardState: BitBoard;
  gameState: GameStatus;
  parentId: string;
  id: string;
};

export type EvalLogs = {
  evalLayers: EvalLayer[];
  evalLoggingEnabled: boolean;
  evalAddNode(gameNode: GameNode, depth: number): void;
};

export type EvalLayer = {
  depth: number;
  evaluations: GameNode[];
};

export type CheckStatus = {
  check: boolean;
  checkMate: boolean;
};

export type LegalityResponse = {
  isLegal: boolean;
  reason:
    | "need to move out of check"
    | "can't move into check"
    | "piece move rules evaluation"
    | "no move detected"
    | "can't take your own pieces"
    | "fill your boots";
};
