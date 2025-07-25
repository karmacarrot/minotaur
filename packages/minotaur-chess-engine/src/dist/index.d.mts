type BoardUpdateResponse = {
  BoardState: BitBoard;
  MoveAttempted: BoardMove;
  CastleLongLost: boolean;
  CastleShortLost: boolean;
};

interface MinotaurConfig {
  pieceImages: {
    [key: string]: string;
  };
}

type BoardMove = {
  PieceMoved: Piece;
  PieceTaken: Piece;
  FileFrom: string;
  FileTo: string;
  CastleRookFrom: string;
  CastleRookTo: string;
  RankFrom: number;
  RankTo: number;
  isLegal: boolean;
};

type Piece =
  | 'whitePawn'
  | 'whiteKnight'
  | 'whiteBishop'
  | 'whiteRook'
  | 'whiteQueen'
  | 'whiteKing'
  | 'blackPawn'
  | 'blackKnight'
  | 'blackBishop'
  | 'blackRook'
  | 'blackQueen'
  | 'blackKing'
  | null;

type ChessboardArray = Piece[][];

type Score = {
  score: number;
  move: BitMove;
  boardState: BitBoard;
};

type ScoreArray = Score[];

interface PieceImages {
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

interface BitBoard {
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

interface GameStatus {
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
  lastWhiteDoublePawnMove: bigint;
  lastBlackDoublePawnMove: bigint;
}

interface CastleStatus {
  castleLongLost: boolean;
  castleShortLost: boolean;
}

type BitMove = {
  from: number;
  to: number;
  piece: keyof BitBoard;
  pieceTaken: keyof BitBoard;
  score: number;
  evaluations: number;
  castleRookFrom: number;
  castleRookTo: number;
  promotion: keyof BitBoard;
};

type GameNode = {
  boardState: BitBoard;
  gameState: GameStatus;
  parentId: string;
  id: string;
};

type EvalLogs = {
  evalLayers: EvalLayer[];
  evalLoggingEnabled: boolean;
  evalAddNode(gameNode: GameNode, depth: number): void;
};

type EvalLayer = {
  depth: number;
  evaluations: GameNode[];
};

type CheckStatus = {
  check: boolean;
  checkMate: boolean;
};

type LegalityResponse = {
  isLegal: boolean;
  reason:
    | 'need to move out of check'
    | "can't move into check"
    | 'piece move rules evaluation'
    | 'no move detected'
    | "can't take your own pieces"
    | 'castling rules checked'
    | 'fill your boots';
};

interface BoardXY {
  x: number;
  y: number;
}

type EngineResponse = {
  boardUpdateResponse: BoardUpdateResponse | null;
  bestMove: BitMove;
};

type PgnMovesAndResult = {
  moves: string[];
  result: string;
};

declare const InitialGameStatus: GameStatus;
declare const numberOfTiles = 64;
declare const xOrYTileLength = 8;
declare const blackStartingRank = 7;
declare const whiteStartingRank = 2;
declare const files: string[];
declare const aTogFilesOnly: bigint;
declare const bTohFilesOnly: bigint;
declare const a1: bigint;
declare const h8: bigint;
declare const whiteBackRankPositions: bigint;
declare const blackBackRankPositions: bigint;
declare const StartingBoard: BitBoard;
declare const EmptyBoard: BitBoard;
declare const allOnes: bigint;
declare enum BoardArrangements {
    StartingPositions = 0,
    MiddleGame = 1,
    EndGame = 2,
    DuellingPawns = 3,
    EmptyBoard = 4,
    MiniMaxOne = 5,
    MateInOneForBlackGameBoard = 6,
    MateInOneForWhiteGameBoard = 7,
    CastleForBlackGameBoard = 8,
    BlackLongCastledGameBoard = 9,
    BlackShortCastledGameBoard = 10,
    CastleForBlackAfter = 11,
    EnPassantBoard = 12,
    PromoteForBlack = 13,
    PromoteForWhite = 14
}
declare const pieceImages: PieceImages;
declare const slidingPieces: string[];
declare const unicodePieceMap: {
    whiteKing: string;
    whiteQueen: string;
    whiteRook: string;
    whiteBishop: string;
    whiteKnight: string;
    whitePawn: string;
    blackKing: string;
    blackQueen: string;
    blackRook: string;
    blackBishop: string;
    blackKnight: string;
    blackPawn: string;
};
declare const pieceValues: {
    pawn: number;
    knight: number;
    bishop: number;
    rook: number;
    queen: number;
    king: number;
};
declare const CentralDominanceWeightings: {
    absoluteCentre: bigint;
    innerRing: bigint;
    outerRing: bigint;
};
declare const RankWeightings: {
    secondRank: bigint;
    seventhRank: bigint;
};
declare const EvalWeightings: {
    absoluteCentreWeight: number;
    innerRingWeight: number;
    outerRingWeight: number;
    oneMoveUntilPromotionWeight: number;
    pawnChainWeight: number;
    developedBishopKnight: number;
    developedRook: number;
    freedomToMove: number;
    safeKing: number;
};
declare const evalLoggingOn: EvalLogs;
declare const evalLoggingOff: EvalLogs;
declare const knightMoveOffsets: number[];
declare const diagonalOffsets: number[];
declare const orthagonalOffsets: number[];
declare const fullBitMask: bigint;
declare const blackKingShortCastleRoute: bigint;
declare const blackKingLongCastleRoute: bigint;
declare const whiteKingShortCastleRoute: bigint;
declare const whiteKingLongCastleRoute: bigint;
declare const blackKingShortCastleDestination: bigint;
declare const blackKingLongCastleDestination: bigint;
declare const whiteKingShortCastleDestination: bigint;
declare const whiteKingLongCastleDestination: bigint;
declare const blackKingShortCastleRookDestination: bigint;
declare const blackKingLongCastleRookDestination: bigint;
declare const whiteKingShortCastleRookDestination: bigint;
declare const whiteKingLongCastleRookDestination: bigint;
declare const blackKingShortRook: bigint;
declare const blackKingLongRook: bigint;
declare const whiteKingShortRook: bigint;
declare const whiteKingLongRook: bigint;
declare const whitePawnLongGuards: bigint;
declare const whitePawnShortGuards: bigint;
declare const blackPawnLongGuards: bigint;
declare const blackPawnShortGuards: bigint;
declare const boardMapping: {
    a1: string;
    b1: string;
    c1: string;
    d1: string;
    e1: string;
    f1: string;
    g1: string;
    h1: string;
    a2: string;
    b2: string;
    c2: string;
    d2: string;
    e2: string;
    f2: string;
    g2: string;
    h2: string;
    a3: string;
    b3: string;
    c3: string;
    d3: string;
    e3: string;
    f3: string;
    g3: string;
    h3: string;
    a4: string;
    b4: string;
    c4: string;
    d4: string;
    e4: string;
    f4: string;
    g4: string;
    h4: string;
    a5: string;
    b5: string;
    c5: string;
    d5: string;
    e5: string;
    f5: string;
    g5: string;
    h5: string;
    a6: string;
    b6: string;
    c6: string;
    d6: string;
    e6: string;
    f6: string;
    g6: string;
    h6: string;
    a7: string;
    b7: string;
    c7: string;
    d7: string;
    e7: string;
    f7: string;
    g7: string;
    h7: string;
    a8: string;
    b8: string;
    c8: string;
    d8: string;
    e8: string;
    f8: string;
    g8: string;
    h8: string;
};

declare function initBoard(arrangement: BoardArrangements): BitBoard;
declare function BoardArray(currentBitBoard: BitBoard): ChessboardArray;
declare function getCastleStatus(pieceType: Piece, rankFrom: number): CastleStatus;
declare function handleCastleMove(boardState: BitBoard, pieceType: Piece, fileFrom: string, fileTo: string): BitBoard;
declare function movePiece(currentBitBoard: BitBoard, pieceType: Piece, rankFrom: number, fileFrom: string, rankTo: number, fileTo: string, gameState: GameStatus): BoardUpdateResponse;
declare function getFile(x: number, boardWidth: number, xOffset: number): string | undefined;
declare function getRank(y: number, boardHeight: number, yOffset: number): number;
declare function moveAnyPiece(currentBitBoard: BitBoard, rankFrom: number, fileFrom: string, rankTo: number, fileTo: string, pieceType: keyof BitBoard): BitBoard;
declare function getPathAlgabraic(move: BoardMove): {
    rank: number;
    file: string | undefined;
}[];
declare function bitMoveToBoardMove(bitMove: BitMove): BoardMove;

declare function applyMove(bitBoard: BitBoard, from: number, to: number, pieceBitBoard: keyof BitBoard): BitBoard;
declare function clearPosition(bitBoard: BitBoard, position: number): BitBoard;
declare function getBitBoardPosition(file: string, rank: number): number;
declare function getFileAndRank(bitBoardPosition: number): {
    file: string | undefined;
    rank: number;
};
declare function bigIntToBinaryString(inputNumber: BigInt): string;
declare function bitCount(bitboard: bigint): number;
declare function binaryMask64(position: number, maskType: 'all_zeroes_with_position_as_one' | 'all_ones_with_position_as_zero'): bigint;
declare function occupiedBy(currentBoard: BitBoard, position: number): Piece;
declare function isOccupied(currentBoard: BitBoard, position: number): boolean;
declare function isOccupiedComposite(compositePositions: bigint, position: number): boolean;
declare function allPositions(currentBoard: BitBoard): bigint;
declare function allWhitePositions(currentBoard: BitBoard): bigint;
declare function allBlackPositions(currentBoard: BitBoard): bigint;
declare function getMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove;
declare function getBlackPromotionMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove;
declare function getSinglePieceMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove;
declare function getBeforeAndAfterPositions(before: bigint, after: bigint): [number, number];
declare function getCastledMoveFromBoardStates(before: BitBoard, after: BitBoard): BitMove;
declare function findBitPositionReverse(bitboard: bigint): number;
declare function findBitPositions(bitboard: bigint): number[];
declare function findBitPosition(bitboard: bigint): number | undefined;
declare function isAtoHwraparound(fromPosition: number, toPosition: number): boolean;
declare function isABCtoFGHwraparound(fromPosition: number, toPosition: number): boolean;
declare function bitBoardsReadable(bitBoard: BitBoard): {
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
    none: string;
};
declare function isShortCastleRouteBlocked(board: BitBoard, isWhitesTurn: boolean, enemyControlledSquares: bigint): boolean;
declare function isLongCastleRouteBlocked(board: BitBoard, isWhitesTurn: boolean, enemyControlledSquares: bigint): boolean;

/**
 * @deprecated The method should not be used
 */
declare function FindBestMoves(currentBoard: BitBoard, isWhitesTurn: boolean): ScoreArray;
declare function FindBestMoveMiniMax(currentBoard: BitBoard, currentGameState: GameStatus, engineDepth: number): Promise<[BitMove, GameNode[]]>;
declare function WhitePawnCaptures(boardState: BitBoard, allOccupiedBlackPositions: bigint): BitMove[];
declare function WhitePawnMovesComposite(boardState: BitBoard): BitMove[];
declare function AllWhitePawnMovesOneSquare(boardState: BitBoard, allOccupiedPositions: bigint, includePromotions: boolean): bigint;
declare function AllWhitePawnMovesTwoSquare(boardState: BitBoard, allOccupiedPositions: bigint): bigint;
declare function AllWhitePawnCaptures(boardState: BitBoard, allOccupiedBlackPositions: bigint): bigint;
declare function AllWhitePawnEnPassantCaptures(boardState: BitBoard, blackLastDoubleSquareMove: bigint): bigint;
declare function AllWhitePawnMovesComposite(boardState: BitBoard): BitBoard;
declare function BlackPawnMovesOneSquare(boardState: BitBoard, allOccupiedPositions: bigint): BitMove[];
declare function BlackPawnCaptures(boardState: BitBoard, allOccupiedWhitePositions: bigint): BitMove[];
declare function BlackPawnMovesComposite(boardState: BitBoard): BitMove[];
declare function AllBlackPawnMovesOneSquare(boardState: BitBoard, allOccupiedPositions: bigint, includePromotions: boolean): bigint;
declare function AllBlackPawnPromotions(boardState: BitBoard, allOccupiedPositions: bigint): bigint;
declare function AllBlackPawnMovesTwoSquare(boardState: BitBoard, allOccupiedPositions: bigint): bigint;
declare function AllBlackPawnCaptures(boardState: BitBoard, allOccupiedWhitePositions: bigint): bigint;
declare function AllBlackPawnMovesComposite(boardState: BitBoard): BitBoard;
declare function AllKnightMoves(boardState: BitBoard, allFriendlyOccupiedPositions: bigint, evaluateForWhite: boolean): bigint;
declare function AllBishopMoves(boardState: BitBoard, allFriendlyOccupiedPositions: bigint, allEnemyOccupiedPositions: bigint, evaluateForWhite: boolean): bigint;
declare function AllRookMoves(boardState: BitBoard, allFriendlyOccupiedPositions: bigint, allEnemyOccupiedPositions: bigint, evaluateForWhite: boolean): bigint;
declare function AllKingMoves(boardState: BitBoard, allFriendlyOccupiedPositions: bigint, evaluateForWhite: boolean): bigint;
declare function AllQueenMoves(boardState: BitBoard, allFriendlyOccupiedPositions: bigint, allEnemyOccupiedPositions: bigint, evaluateForWhite: boolean): bigint;
declare function AllCompiledMoves(boardState: BitBoard, evaluateForWhite: boolean, treatKingAsCapture: boolean): bigint;

declare const whiteKingsPawn: bigint;

declare function evaluateBoard(currentBoard: BitBoard, evaluateForWhite: boolean): number;
declare function evaluateMaterialAdvantages(currentBoard: BitBoard, evaluateForWhite: boolean): number;
declare function evaluatePositionalAdvantages(currentBoard: BitBoard, evaluateForWhite: boolean): number;
declare function evaluateCentralDominanceAdvantages(pieceBitBoard: bigint, evaluateForWhite: boolean, piece: keyof BitBoard): number;
declare function evaluatePromotionalPossibilities(pawnBitBoard: bigint, evaluateForWhite: boolean): number;
declare function evaluatePawnChains(pawnBitBoard: bigint, evaluateForWhite: boolean): number;
declare function evaluatePieceDevelopment(currentBoard: BitBoard, evaluateForWhite: boolean): number;
declare function evaluateFreedomToMove(currentBoard: BitBoard, evaluateForWhite: boolean): number;
declare function evaluateSquareControl(currentBoard: BitBoard, evaluateForWhite: boolean): bigint;
declare function evaluateKingSafety(currentBoard: BitBoard, evaluateForWhite: boolean): number;

declare const memoize: <T extends (...args: any[]) => any>(fn: T) => T;

declare function maxMove(node: GameNode, depth: number, scoreForWhite: boolean, evalLogs: EvalLogs): [BitMove, GameNode[]];
declare function scoredMove(score: number, previousBoardState: BitBoard, newBoardState: BitBoard): BitMove;

declare function pushNewNode(currentNodeList: GameNode[], parentNode: GameNode, newBoardState: BitBoard, evalLogs: EvalLogs, depth: number): GameNode[];
declare function generateLegalMoves(node: GameNode): GameNode[];
declare function generateNodeId(): string;
declare function StartingNode(): {
    boardState: {
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
    };
    gameState: {
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
        lastWhiteDoublePawnMove: bigint;
        lastBlackDoublePawnMove: bigint;
    };
    parentId: string;
    id: string;
};
declare function NodeFactory(parentNode: GameNode, newBoardState: BitBoard): GameNode;
declare function nodeFromBoardAndGameState(boardState: BitBoard, gameState: GameStatus): GameNode;

declare function bishopNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function kingNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];
declare function kingCastlingNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function knightNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function whitePawnNodes(node: GameNode): GameNode[];
declare function whitePawnEnPassantCaptureNodes(node: GameNode): GameNode[];
declare function whitePawnCaptureNodes(node: GameNode, allOccupiedBlackPositions: bigint): GameNode[];
declare function blackPawnNodes(node: GameNode): GameNode[];
declare function blackPawnTwoSquareNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[];
declare function blackPawnEnPassantCaptureNodes(node: GameNode): GameNode[];
declare function blackPawnCaptureNodes(node: GameNode, allOccupiedWhitePositions: bigint): GameNode[];
declare function blackPawnPromotionNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[];

declare function queenNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function rookNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare enum LogLevels {
    warn = 0,
    log = 1,
    error = 2,
    info = 3
}

declare const createEvalLogs: () => EvalLogs;
declare const outputEvalLogs: (logs: EvalLogs) => void;
declare const outputEvalLogsHtml: (logs: EvalLogs, testName: string) => void;
declare function LogBoardPositionsHTML(currentBoard: BitBoard): string;
declare const outputSinglePiecePositions: (piecePositions: bigint, piece: keyof BitBoard, testName: string) => void;
declare const outputSingleBitboardHtml: (currentBoard: BitBoard, currentGameState: GameStatus | null, testName: string) => void;

declare const LoggerConfig: {
    verbosity: LogLevels;
    enableEvaluationLogs: boolean;
};

declare function LogUnicodeBoardPositions(currentBoard: BitBoard): void;
declare function MultiLog(outputType: LogLevels, message: string, outputVerbosity: LogLevels): void;

declare function isLegalMove(moveAttempted: BoardMove, boardState: BitBoard, proposedBoardState: BitBoard, gameState: GameStatus): LegalityResponse;
declare function isLegalQueenMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalKingMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalRookMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalBishopMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalKnightMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalPawnMove(moveAttempted: BoardMove, boardState: BitBoard, gameState: GameStatus): boolean;
declare function isOnStartingRank(moveAttempted: BoardMove): boolean;
declare function isMyKingInCheck(currentBoard: BitBoard, evaluateForWhite: boolean): CheckStatus;
declare function isOpponentChecked(currentBoard: BitBoard, evaluateForWhite: boolean): CheckStatus;
declare const isOpponentCheckedMemo: typeof isOpponentChecked;

declare const MiddleGameBoard: BitBoard;
declare const EndGameBoard: BitBoard;
declare const MateInOneForWhiteGameBoard: BitBoard;
declare const MateInOneForBlackGameBoard: BitBoard;
declare const BlackShortCastledGameBoard: BitBoard;
declare const BlackLongCastledGameBoard: BitBoard;
declare const CastleForBlackGameBoard: BitBoard;
declare const CastleForBlackGameLongBoard: BitBoard;
declare const CastleForBlackAfterGameBoard: BitBoard;
declare const DuellingPawnsBoard: BitBoard;
declare const BlackAdvantageBoard: BitBoard;
declare const MiniMaxTestBoardOne: BitBoard;
declare const whitePawnChain_Pyramid: bigint;
declare const whitePawnChain_ThreeIslands: bigint;
declare const whitePawnChain_NoChains: bigint;
declare const blackPawnChain_Pyramid: bigint;
declare const blackPawnChain_ThreeIslands: bigint;
declare const blackPawnChain_NoChains: bigint;
declare const EnPassantBoard: BitBoard;
declare const PromoteForBlackGameBoard: BitBoard;
declare const PromoteForWhiteGameBoard: BitBoard;

declare function pawnsThatCanCaptureEnpassant(board: BitBoard, gameState: GameStatus): bigint;

declare function getFenFromGameNode(node: GameNode): string;
declare function countHalfMoves(moves: BoardMove[]): number;
declare function countFullMoves(moves: BoardMove[]): number;
declare function getFenPositionsFromGameNode(node: GameNode): string;
declare function pieceNameToFenName(pieceName: string | null): "b" | "" | "K" | "Q" | "k" | "q" | "p" | "n" | "r" | "P" | "N" | "R" | "B";

declare function moveToUciFormat(move: BitMove): string;
declare function uciToBitMoves(moveLine: string, boardState: BitBoard, resetGame: () => void): BitMove[];

type GameStatusUpdateAction = {
    type: 'ADD_MOVE';
    move: BoardMove;
} | {
    type: 'SET_COMPUTER_CONTROL';
    colour: 'white' | 'black';
    value: boolean;
} | {
    type: 'SET_CHECK';
    colour: 'white' | 'black';
    value: boolean;
} | {
    type: 'SET_CASTLING';
    castling: 'blackLong' | 'blackShort' | 'whiteLong' | 'whiteShort';
    value: boolean;
} | {
    type: 'SET_GAME_OVER';
    value: boolean;
} | {
    type: 'SET_LAST_PAWN_DOUBLE_MOVE';
    colour: 'lastWhiteDoublePawnMove' | 'lastBlackDoublePawnMove';
    value: bigint;
} | {
    type: 'RESET_GAME';
};
declare const gameStatusReducer: (state: GameStatus, action: GameStatusUpdateAction) => GameStatus;

declare class MinotaurEngineController {
    private engineDepth;
    currentBoard: BitBoard;
    gameStatus: GameStatus;
    dispatch: (action: any) => void;
    constructor(engineDepth: number);
    resetGame(boardArrangement: BoardArrangements): void;
    handleMoveHistoryUpdates(move: BoardMove): void;
    engineBestMove: (onBoardUpdated: (board: BitBoard) => void, onGameStatusUpdated: (status: GameStatus) => void) => Promise<EngineResponse>;
    movePiece: (piece: Piece, fromRank: number, toRank: number, fromFile: string, toFile: string, onBoardUpdated: (board: BitBoard) => void, onGameStatusUpdated: (status: GameStatus) => void) => BoardUpdateResponse | null;
    private _updateCheckStatus;
    private _activeColour;
    getState(): GameNode;
}

declare const cleanPGN: (pgnToClean: string) => string;
declare function pgnInit(event: string, site: string, date: Date, round: string, white: string, black: string, result: string): string;
declare function parseMovesAndResult(pgnToParse: string): PgnMovesAndResult;
declare function pgnToGameNode(pgnToParse: string): GameNode;
declare function addMoveToPGN(currentPGN: string, move: BoardMove, moveNumber: number): string;
declare function stripCommentsFromPGN(pgnToStrip: string): string;
declare function stripTagsFromPGN(pgnToStrip: string): string;

declare const normalizedLineEndings: (fileContents: string) => string;
declare const splitOnCarriageReturnsAndSpaces: (fileContents: string) => string[];

export { AllBishopMoves, AllBlackPawnCaptures, AllBlackPawnMovesComposite, AllBlackPawnMovesOneSquare, AllBlackPawnMovesTwoSquare, AllBlackPawnPromotions, AllCompiledMoves, AllKingMoves, AllKnightMoves, AllQueenMoves, AllRookMoves, AllWhitePawnCaptures, AllWhitePawnEnPassantCaptures, AllWhitePawnMovesComposite, AllWhitePawnMovesOneSquare, AllWhitePawnMovesTwoSquare, type BitBoard, type BitMove, BlackAdvantageBoard, BlackLongCastledGameBoard, BlackPawnCaptures, BlackPawnMovesComposite, BlackPawnMovesOneSquare, BlackShortCastledGameBoard, BoardArrangements, BoardArray, type BoardMove, type BoardUpdateResponse, type BoardXY, CastleForBlackAfterGameBoard, CastleForBlackGameBoard, CastleForBlackGameLongBoard, type CastleStatus, CentralDominanceWeightings, type CheckStatus, type ChessboardArray, DuellingPawnsBoard, EmptyBoard, EnPassantBoard, EndGameBoard, type EngineResponse, type EvalLayer, type EvalLogs, EvalWeightings, FindBestMoveMiniMax, FindBestMoves, type GameNode, type GameStatus, type GameStatusUpdateAction, InitialGameStatus, type LegalityResponse, LogBoardPositionsHTML, LogLevels, LogUnicodeBoardPositions, LoggerConfig, MateInOneForBlackGameBoard, MateInOneForWhiteGameBoard, MiddleGameBoard, MiniMaxTestBoardOne, type MinotaurConfig, MinotaurEngineController, MultiLog, NodeFactory, type PgnMovesAndResult, type Piece, type PieceImages, PromoteForBlackGameBoard, PromoteForWhiteGameBoard, RankWeightings, type Score, type ScoreArray, StartingBoard, StartingNode, WhitePawnCaptures, WhitePawnMovesComposite, a1, aTogFilesOnly, addMoveToPGN, allBlackPositions, allOnes, allPositions, allWhitePositions, applyMove, bTohFilesOnly, bigIntToBinaryString, binaryMask64, bishopNodes, bitBoardsReadable, bitCount, bitMoveToBoardMove, blackBackRankPositions, blackKingLongCastleDestination, blackKingLongCastleRookDestination, blackKingLongCastleRoute, blackKingLongRook, blackKingShortCastleDestination, blackKingShortCastleRookDestination, blackKingShortCastleRoute, blackKingShortRook, blackPawnCaptureNodes, blackPawnChain_NoChains, blackPawnChain_Pyramid, blackPawnChain_ThreeIslands, blackPawnEnPassantCaptureNodes, blackPawnLongGuards, blackPawnNodes, blackPawnPromotionNodes, blackPawnShortGuards, blackPawnTwoSquareNodes, blackStartingRank, boardMapping, cleanPGN, clearPosition, countFullMoves, countHalfMoves, createEvalLogs, diagonalOffsets, evalLoggingOff, evalLoggingOn, evaluateBoard, evaluateCentralDominanceAdvantages, evaluateFreedomToMove, evaluateKingSafety, evaluateMaterialAdvantages, evaluatePawnChains, evaluatePieceDevelopment, evaluatePositionalAdvantages, evaluatePromotionalPossibilities, evaluateSquareControl, files, findBitPosition, findBitPositionReverse, findBitPositions, fullBitMask, gameStatusReducer, generateLegalMoves, generateNodeId, getBeforeAndAfterPositions, getBitBoardPosition, getBlackPromotionMoveFromBoardStates, getCastleStatus, getCastledMoveFromBoardStates, getFenFromGameNode, getFenPositionsFromGameNode, getFile, getFileAndRank, getMoveFromBoardStates, getPathAlgabraic, getRank, getSinglePieceMoveFromBoardStates, h8, handleCastleMove, initBoard, isABCtoFGHwraparound, isAtoHwraparound, isLegalBishopMove, isLegalKingMove, isLegalKnightMove, isLegalMove, isLegalPawnMove, isLegalQueenMove, isLegalRookMove, isLongCastleRouteBlocked, isMyKingInCheck, isOccupied, isOccupiedComposite, isOnStartingRank, isOpponentChecked, isOpponentCheckedMemo, isShortCastleRouteBlocked, kingCastlingNodes, kingNodes, knightMoveOffsets, knightNodes, maxMove, memoize, moveAnyPiece, movePiece, moveToUciFormat, nodeFromBoardAndGameState, normalizedLineEndings, numberOfTiles, occupiedBy, orthagonalOffsets, outputEvalLogs, outputEvalLogsHtml, outputSingleBitboardHtml, outputSinglePiecePositions, parseMovesAndResult, pawnsThatCanCaptureEnpassant, pgnInit, pgnToGameNode, pieceImages, pieceNameToFenName, pieceValues, pushNewNode, queenNodes, rookNodes, scoredMove, slidingPieces, splitOnCarriageReturnsAndSpaces, stripCommentsFromPGN, stripTagsFromPGN, uciToBitMoves, unicodePieceMap, whiteBackRankPositions, whiteKingLongCastleDestination, whiteKingLongCastleRookDestination, whiteKingLongCastleRoute, whiteKingLongRook, whiteKingShortCastleDestination, whiteKingShortCastleRookDestination, whiteKingShortCastleRoute, whiteKingShortRook, whiteKingsPawn, whitePawnCaptureNodes, whitePawnChain_NoChains, whitePawnChain_Pyramid, whitePawnChain_ThreeIslands, whitePawnEnPassantCaptureNodes, whitePawnLongGuards, whitePawnNodes, whitePawnShortGuards, whiteStartingRank, xOrYTileLength };
