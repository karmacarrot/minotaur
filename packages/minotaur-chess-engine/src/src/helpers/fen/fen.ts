import { BoardArray } from '../../board';
import { BoardMove, GameNode } from '../../types';
import { findBitPosition, getFileAndRank } from '../bitboards';

export function getFenFromGameNode(node: GameNode): string {
  const positions = getFenPositionsFromGameNode(node);
  const { boardState, gameState } = node;

  let gameStateFen = gameState.isWhitesTurn ? 'w' : 'b';
  gameStateFen += ' ';
  gameStateFen += gameState.whiteKingCanCastleShort ? 'K' : '';
  gameStateFen += gameState.whiteKingCanCastleLong ? 'Q' : '';
  gameStateFen += gameState.blackKingCanCastleShort ? 'k' : '';
  gameStateFen += gameState.blackKingCanCastleShort ? 'q' : '';
  gameStateFen += ' ';
  if (gameState.lastBlackDoublePawnMove + gameState.lastWhiteDoublePawnMove === BigInt(0)) {
    gameStateFen += '-';
  } else {
    if (gameState.isWhitesTurn && gameState.lastBlackDoublePawnMove > 0) {
      const blackDoubleMovePosition = findBitPosition(gameState.lastBlackDoublePawnMove);
      if (blackDoubleMovePosition) {
        const fileAndRank = getFileAndRank(blackDoubleMovePosition);
        gameStateFen += `${fileAndRank.file}${fileAndRank.rank}`;
      }
    }
    if (!gameState.isWhitesTurn && gameState.lastWhiteDoublePawnMove > 0) {
      const whiteDoubleMovePosition = findBitPosition(gameState.lastWhiteDoublePawnMove);
      if (whiteDoubleMovePosition) {
        const fileAndRank = getFileAndRank(whiteDoubleMovePosition);
        gameStateFen += `${fileAndRank.file}${fileAndRank.rank}`;
      }
    }
  }
  gameStateFen += ' ';
  gameStateFen += countHalfMoves(gameState.moveHistory);
  gameStateFen += ' ';
  gameStateFen += countFullMoves(gameState.moveHistory);
  return positions + ' ' + gameStateFen;
}

export function countHalfMoves(moves: BoardMove[]) {
  let halfMoves = 0;
  moves.forEach((move) => {
    if (move.PieceTaken != null || move.PieceMoved?.toLowerCase().includes('pawn')) {
      halfMoves = 0;
      return;
    }
    halfMoves += 1;
  });
  return halfMoves;
}

export function countFullMoves(moves: BoardMove[]) {
  const fullMoves = Math.floor(moves.length / 2);
  return fullMoves + 1;
}

export function getFenPositionsFromGameNode(node: GameNode): string {
  const { boardState } = node;

  const boardArray = BoardArray(boardState);
  let fenArray: string[] = [];
  let emptySquareCounter = 0;

  boardArray.reverse().forEach((row, rowCount) => {
    row.reverse().forEach((piece) => {
      if (emptySquareCounter > 7) {
        fenArray.push(emptySquareCounter.toString());
        emptySquareCounter = 0;
      }

      const fenName = pieceNameToFenName(piece);
      if (fenName !== '') {
        if (emptySquareCounter > 0) {
          fenArray.push(emptySquareCounter.toString());
          emptySquareCounter = 0;
        }
        fenArray.push(fenName);
      } else {
        emptySquareCounter += 1;
      }
    });

    if (emptySquareCounter > 0) {
      fenArray.push(emptySquareCounter.toString());
      emptySquareCounter = 0;
    }

    fenArray.push('/');
  });

  if (emptySquareCounter > 0) {
    fenArray.push(emptySquareCounter.toString());
    emptySquareCounter = 0;
  }

  if (fenArray[0] == '/') {
    fenArray[0] = '';
  }
  if (fenArray[fenArray.length - 1] == '/') {
    fenArray[fenArray.length - 1] = '';
  }
  return fenArray.join('');
}

export function pieceNameToFenName(pieceName: string | null) {
  switch (pieceName) {
    case 'blackPawn':
      return 'p';
    case 'blackKnight':
      return 'n';
    case 'blackRook':
      return 'r';
    case 'blackBishop':
      return 'b';
    case 'blackKing':
      return 'k';
    case 'blackQueen':
      return 'q';
    case 'whitePawn':
      return 'P';
    case 'whiteKnight':
      return 'N';
    case 'whiteRook':
      return 'R';
    case 'whiteBishop':
      return 'B';
    case 'whiteKing':
      return 'K';
    case 'whiteQueen':
      return 'Q';
    case null:
      return '';
    default:
      return '';
  }
}
