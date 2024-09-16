import { LoggerConfig } from "./logging/logger.config";
import { LogLevels } from "./logging/definitions";
import { MultiLog } from "./logging/logger";
import {
  applyMove,
  getBitBoardPosition,
  getFileAndRank,
} from "./helpers/bitboards";
import {
  BoardArrangements,
  EmptyBoard,
  StartingBoard,
  files,
  numberOfTiles,
  xOrYTileLength,
} from "./helpers/definitions";
import {
  BlackLongCastledGameBoard,
  BlackShortCastledGameBoard,
  CastleForBlackAfterGameBoard,
  CastleForBlackGameBoard,
  DuellingPawnsBoard,
  EndGameBoard,
  MateInOneForBlackGameBoard,
  MateInOneForWhiteGameBoard,
  MiddleGameBoard,
  MiniMaxTestBoardOne,
} from "./referee/mockBoardStates";
import { isLegalMove } from "./referee/referee";
import {
  BitBoard,
  BitMove,
  BoardMove,
  BoardUpdateResponse,
  ChessboardArray,
  Piece,
} from "./types";

export function initBoard(arrangement: BoardArrangements): BitBoard {
  switch (arrangement) {
    case BoardArrangements.StartingPositions:
      return StartingBoard;
    case BoardArrangements.MiddleGame:
      return MiddleGameBoard;
    case BoardArrangements.EndGame:
      return EndGameBoard;
    case BoardArrangements.DuellingPawns:
      return DuellingPawnsBoard;
    case BoardArrangements.EmptyBoard:
      return EmptyBoard;
    case BoardArrangements.MiniMaxOne:
      return MiniMaxTestBoardOne;
    case BoardArrangements.MateInOneForBlackGameBoard:
      return MateInOneForBlackGameBoard;
    case BoardArrangements.MateInOneForWhiteGameBoard:
      return MateInOneForWhiteGameBoard;
    case BoardArrangements.CastleForBlackGameBoard:
      return CastleForBlackGameBoard;
    case BoardArrangements.BlackLongCastledGameBoard:
      return BlackLongCastledGameBoard;
    case BoardArrangements.BlackShortCastledGameBoard:
      return BlackShortCastledGameBoard;
    case BoardArrangements.CastleForBlackAfter:
      return CastleForBlackAfterGameBoard;
    default:
      return StartingBoard;
  }
}

export function BoardArray(currentBitBoard: BitBoard) {
  const board: ChessboardArray = Array.from({ length: xOrYTileLength }, () =>
    Array(8).fill(null)
  );

  for (let piece in currentBitBoard) {
    for (let square = 0; square < numberOfTiles; square++) {
      if (
        (currentBitBoard[piece as keyof typeof currentBitBoard] &
          (BigInt(1) << BigInt(square))) !==
        BigInt(0)
      ) {
        const row = xOrYTileLength - 1 - Math.floor(square / xOrYTileLength);
        const col = square % xOrYTileLength;
        if (board[row] && board[row][col] !== undefined) {
          board[row][col] = piece as Piece;
        }
      }
    }
  }

  return board;
}

//used to evaluate the weak fleshy human moves
export function movePiece(
  currentBitBoard: BitBoard,
  pieceType: Piece,
  rankFrom: number,
  fileFrom: string,
  rankTo: number,
  fileTo: string
): BoardUpdateResponse {
  MultiLog(
    LogLevels.info,
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
    PieceTaken: null,
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
      MoveAttempted: moveAttempted,
    };
  }

  if (isLegal) {
    MultiLog(LogLevels.info, "It's a legal move", LoggerConfig.verbosity);
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
        PieceTaken: null,
      },
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
      PieceTaken: null,
    },
  };
}

export function getFile(x: number, boardWidth: number, xOffset: number) {
  x = x - xOffset;
  const tileWidth = boardWidth / 8;
  const fileIndex = Math.floor(x / tileWidth);

  return files[fileIndex];
}

export function getRank(y: number, boardHeight: number, yOffset: number) {
  y = y - yOffset;
  const tileHeight = boardHeight / 8;
  const reverseRank = Math.floor(y / tileHeight) + 1;
  const rank = 7 - reverseRank + 2;
  return rank;
}

export function moveSlidingPiece(
  currentBitBoard: BitBoard,
  rankFrom: number,
  fileFrom: string,
  rankTo: number,
  fileTo: string,
  pieceType: keyof BitBoard
): BitBoard {
  MultiLog(
    LogLevels.info,
    `from ${fileFrom}${rankFrom} to ${fileTo}${rankTo}`,
    LoggerConfig.verbosity
  );

  const fromPosition = getBitBoardPosition(fileFrom, rankFrom);
  const toPosition = getBitBoardPosition(fileTo, rankTo);
  MultiLog(
    LogLevels.info,
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

export function getPathAlgabraic(move: BoardMove) {
  let positionsArray = [];
  if (move.FileFrom === move.FileTo) {
    //vertical slide
    if (move.RankFrom > move.RankTo) {
      //slide down
      //for i = 7; i > 5; i--
      for (let i = move.RankFrom; i > move.RankTo; i--) {
        positionsArray.push({ rank: i - 1, file: move.FileFrom });
      }
    } else {
      //slide up
      for (let i = move.RankFrom; i < move.RankTo; i++) {
        positionsArray.push({ rank: i + 1, file: move.FileFrom });
      }
    }
  } else {
    if (move.RankFrom === move.RankTo) {
      //horizontal slide
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

export function bitMoveToBoardMove(bitMove: BitMove) {
  const boardMoveTo = getFileAndRank(bitMove.to);
  const boardMoveFrom = getFileAndRank(bitMove.from);

  return {
    PieceMoved: bitMove.piece,
    PieceTaken: bitMove.pieceTaken,
    FileFrom: boardMoveFrom.file,
    FileTo: boardMoveTo.file,
    RankFrom: boardMoveFrom.rank,
    RankTo: boardMoveTo.rank,
    isLegal: true,
  } as BoardMove;
}
