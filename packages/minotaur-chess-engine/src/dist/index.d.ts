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
    CastleForBlackAfter = 11
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
declare function clearPosition(bitBoard: BitBoard, position: number): {
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
declare function isShortCastleRouteBlocked(board: BitBoard, isWhitesTurn: boolean): boolean;
declare function isLongCastleRouteBlocked(board: BitBoard, isWhitesTurn: boolean): boolean;

/**
 * @deprecated The method should not be used
 */
declare function FindBestMoves(currentBoard: BitBoard, isWhitesTurn: boolean): ScoreArray;
declare function FindBestMoveMiniMax(currentBoard: BitBoard, currentGameState: GameStatus, engineDepth: number): Promise<[BitMove, GameNode[]]>;
declare function WhitePawnCaptures(boardState: BitBoard, allOccupiedBlackPositions: bigint): BitMove[];
declare function WhitePawnMovesComposite(boardState: BitBoard): BitMove[];
declare function AllWhitePawnMovesOneSquare(boardState: BitBoard, allOccupiedPositions: bigint): bigint;
declare function AllWhitePawnMovesTwoSquare(boardState: BitBoard, allOccupiedPositions: bigint): bigint;
declare function AllWhitePawnCaptures(boardState: BitBoard, allOccupiedBlackPositions: bigint): bigint;
declare function AllWhitePawnMovesComposite(boardState: BitBoard): BitBoard;
declare function BlackPawnMovesOneSquare(boardState: BitBoard, allOccupiedPositions: bigint): BitMove[];
declare function BlackPawnCaptures(boardState: BitBoard, allOccupiedWhitePositions: bigint): BitMove[];
declare function BlackPawnMovesComposite(boardState: BitBoard): BitMove[];
declare function AllBlackPawnMovesOneSquare(boardState: BitBoard, allOccupiedPositions: bigint): bigint;
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
    };
    parentId: string;
    id: string;
};
declare function NodeFactory(parentNode: GameNode, newBoardState: BitBoard): GameNode;

declare function bishopNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function kingNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];
declare function kingCastlingNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function knightNodes(node: GameNode, evalLogs: EvalLogs): GameNode[];

declare function whitePawnNodes(node: GameNode): GameNode[];
declare function whitePawnCaptureNodes(node: GameNode, allOccupiedBlackPositions: bigint): GameNode[];
declare function blackPawnNodes(node: GameNode): GameNode[];
declare function blackPawnTwoSquareNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[];
declare function blackPawnCaptureNodes(node: GameNode, allOccupiedWhitePositions: bigint): GameNode[];

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

declare function MultiLog(outputType: LogLevels, message: string, outputVerbosity: LogLevels): void;

declare function isLegalMove(moveAttempted: BoardMove, boardState: BitBoard, proposedBoardState: BitBoard, gameState: GameStatus): LegalityResponse;
declare function isLegalQueenMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalKingMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalRookMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalBishopMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalKnightMove(moveAttempted: BoardMove, boardState: BitBoard, evaluateForWhite: boolean, friendlyPositions: bigint, enemyPositions: bigint): boolean;
declare function isLegalPawnMove(moveAttempted: BoardMove, boardState: BitBoard): boolean;
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

export { AllBishopMoves, AllBlackPawnCaptures, AllBlackPawnMovesComposite, AllBlackPawnMovesOneSquare, AllBlackPawnMovesTwoSquare, AllCompiledMoves, AllKingMoves, AllKnightMoves, AllQueenMoves, AllRookMoves, AllWhitePawnCaptures, AllWhitePawnMovesComposite, AllWhitePawnMovesOneSquare, AllWhitePawnMovesTwoSquare, type BitBoard, type BitMove, BlackAdvantageBoard, BlackLongCastledGameBoard, BlackPawnCaptures, BlackPawnMovesComposite, BlackPawnMovesOneSquare, BlackShortCastledGameBoard, BoardArrangements, BoardArray, type BoardMove, type BoardUpdateResponse, CastleForBlackAfterGameBoard, CastleForBlackGameBoard, CastleForBlackGameLongBoard, type CastleStatus, CentralDominanceWeightings, type CheckStatus, type ChessboardArray, DuellingPawnsBoard, EmptyBoard, EndGameBoard, type EvalLayer, type EvalLogs, EvalWeightings, FindBestMoveMiniMax, FindBestMoves, type GameNode, type GameStatus, InitialGameStatus, type LegalityResponse, LogBoardPositionsHTML, LogLevels, LoggerConfig, MateInOneForBlackGameBoard, MateInOneForWhiteGameBoard, MiddleGameBoard, MiniMaxTestBoardOne, type MinotaurConfig, MultiLog, NodeFactory, type Piece, type PieceImages, RankWeightings, type Score, type ScoreArray, StartingBoard, StartingNode, WhitePawnCaptures, WhitePawnMovesComposite, a1, aTogFilesOnly, allBlackPositions, allOnes, allPositions, allWhitePositions, applyMove, bTohFilesOnly, bigIntToBinaryString, binaryMask64, bishopNodes, bitBoardsReadable, bitCount, bitMoveToBoardMove, blackKingLongCastleDestination, blackKingLongCastleRookDestination, blackKingLongCastleRoute, blackKingLongRook, blackKingShortCastleDestination, blackKingShortCastleRookDestination, blackKingShortCastleRoute, blackKingShortRook, blackPawnCaptureNodes, blackPawnChain_NoChains, blackPawnChain_Pyramid, blackPawnChain_ThreeIslands, blackPawnLongGuards, blackPawnNodes, blackPawnShortGuards, blackPawnTwoSquareNodes, blackStartingRank, clearPosition, createEvalLogs, diagonalOffsets, evalLoggingOff, evalLoggingOn, evaluateBoard, evaluateCentralDominanceAdvantages, evaluateFreedomToMove, evaluateKingSafety, evaluateMaterialAdvantages, evaluatePawnChains, evaluatePieceDevelopment, evaluatePositionalAdvantages, evaluatePromotionalPossibilities, files, findBitPosition, findBitPositionReverse, findBitPositions, fullBitMask, generateLegalMoves, generateNodeId, getBeforeAndAfterPositions, getBitBoardPosition, getCastleStatus, getCastledMoveFromBoardStates, getFile, getFileAndRank, getMoveFromBoardStates, getPathAlgabraic, getRank, getSinglePieceMoveFromBoardStates, h8, handleCastleMove, initBoard, isABCtoFGHwraparound, isAtoHwraparound, isLegalBishopMove, isLegalKingMove, isLegalKnightMove, isLegalMove, isLegalPawnMove, isLegalQueenMove, isLegalRookMove, isLongCastleRouteBlocked, isMyKingInCheck, isOccupied, isOccupiedComposite, isOnStartingRank, isOpponentChecked, isOpponentCheckedMemo, isShortCastleRouteBlocked, kingCastlingNodes, kingNodes, knightMoveOffsets, knightNodes, maxMove, memoize, moveAnyPiece, movePiece, numberOfTiles, occupiedBy, orthagonalOffsets, outputEvalLogs, outputEvalLogsHtml, outputSingleBitboardHtml, outputSinglePiecePositions, pieceImages, pieceValues, pushNewNode, queenNodes, rookNodes, scoredMove, slidingPieces, unicodePieceMap, whiteKingLongCastleDestination, whiteKingLongCastleRookDestination, whiteKingLongCastleRoute, whiteKingLongRook, whiteKingShortCastleDestination, whiteKingShortCastleRookDestination, whiteKingShortCastleRoute, whiteKingShortRook, whiteKingsPawn, whitePawnCaptureNodes, whitePawnChain_NoChains, whitePawnChain_Pyramid, whitePawnChain_ThreeIslands, whitePawnLongGuards, whitePawnNodes, whitePawnShortGuards, whiteStartingRank, xOrYTileLength };
