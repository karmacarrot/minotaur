import { ChessboardArray, MinotaurConfig, Piece } from '@karmacarrot/minotaur-chess-engine';

import blackPawn from '../assets/chess-pieces/pawn_b.png';
import blackRook from '../assets/chess-pieces/rook_b.png';
import blackKnight from '../assets/chess-pieces/knight_b.png';
import blackBishop from '../assets/chess-pieces/bishop_b.png';
import blackQueen from '../assets/chess-pieces/queen_b.png';
import blackKing from '../assets/chess-pieces/king_b.png';
import whitePawn from '../assets/chess-pieces/pawn_w.png';
import whiteRook from '../assets/chess-pieces/rook_w.png';
import whiteKnight from '../assets/chess-pieces/knight_w.png';
import whiteBishop from '../assets/chess-pieces/bishop_w.png';
import whiteQueen from '../assets/chess-pieces/queen_w.png';
import whiteKing from '../assets/chess-pieces/king_w.png';

export const minotaurConfig: MinotaurConfig = {
  pieceImages: {
    blackPawn: blackPawn.src,
    blackRook: blackRook.src,
    blackKnight: blackKnight.src,
    blackBishop: blackBishop.src,
    blackQueen: blackQueen.src,
    blackKing: blackKing.src,
    whitePawn: whitePawn.src,
    whiteRook: whiteRook.src,
    whiteKnight: whiteKnight.src,
    whiteBishop: whiteBishop.src,
    whiteQueen: whiteQueen.src,
    whiteKing: whiteKing.src,
  },
};

export const emptyBoard: ChessboardArray = Array(8)
  .fill(null)
  .map(() => Array(8).fill(null));

export const getCheckedStateBoard = () => {
  const checkedStateBoard = emptyBoard;
  checkedStateBoard && checkedStateBoard[7] && (checkedStateBoard[7][4] = 'blackRook');
  checkedStateBoard && checkedStateBoard[0] && (checkedStateBoard[0][4] = 'whiteKing');
  return emptyBoard;
};

export const fullBoard: Piece[][] = [
  [
    'whiteRook',
    'whiteKnight',
    'whiteBishop',
    'whiteKing',
    'whiteQueen',
    'whiteBishop',
    'whiteKnight',
    'whiteRook',
  ],
  [
    'whitePawn',
    'whitePawn',
    'whitePawn',
    'whitePawn',
    'whitePawn',
    'whitePawn',
    'whitePawn',
    'whitePawn',
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    'blackPawn',
    'blackPawn',
    'blackPawn',
    'blackPawn',
    'blackPawn',
    'blackPawn',
    'blackPawn',
    'blackPawn',
  ],
  [
    'blackRook',
    'blackKnight',
    'blackBishop',
    'blackKing',
    'blackQueen',
    'blackBishop',
    'blackKnight',
    'blackRook',
  ],
];
