import { ChessboardArray, MinotaurConfig } from '@karmacarrot/minotaur-chess-engine';

export const minotaurConfig: MinotaurConfig = {
  pieceImages: {
    blackPawn: '/assets/chess-pieces/pawn_b.png',
    blackRook: '/assets/chess-pieces/rook_b.png',
    blackKnight: '/assets/chess-pieces/knight_b.png',
    blackBishop: '/assets/chess-pieces/bishop_b.png',
    blackQueen: '/assets/chess-pieces/queen_b.png',
    blackKing: '/assets/chess-pieces/king_b.png',
    whitePawn: '/assets/chess-pieces/pawn_w.png',
    whiteRook: '/assets/chess-pieces/rook_w.png',
    whiteKnight: '/assets/chess-pieces/knight_w.png',
    whiteBishop: '/assets/chess-pieces/bishop_w.png',
    whiteQueen: '/assets/chess-pieces/queen_w.png',
    whiteKing: '/assets/chess-pieces/king_w.png',
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
