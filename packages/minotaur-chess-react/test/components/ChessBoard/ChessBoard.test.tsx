import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import {
  BoardOffset,
  ChessBoard,
  ChessGame,
  MinotaurConfig,
} from '@karmacarrot/minotaur-chess-react';
import { Piece } from '@karmacarrot/minotaur-chess-engine';

const minotaurConfig: MinotaurConfig = {
  pieceImages: {
    blackPawn: '/chess-pieces/pawn_b.png',
    blackRook: '/chess-pieces/rook_b.png',
    blackKnight: '/chess-pieces/knight_b.png',
    blackBishop: '/chess-pieces/bishop_b.png',
    blackQueen: '/chess-pieces/queen_b.png',
    blackKing: '/chess-pieces/king_b.png',
    whitePawn: '/chess-pieces/pawn_w.png',
    whiteRook: '/chess-pieces/rook_w.png',
    whiteKnight: '/chess-pieces/knight_w.png',
    whiteBishop: '/chess-pieces/bishop_w.png',
    whiteQueen: '/chess-pieces/queen_w.png',
    whiteKing: '/chess-pieces/king_w.png',
  },
};

describe('ChessBoard', () => {
  it('should render', () => {
    const movePiece = (
      piece: Piece,
      xFrom: number,
      yFrom: number,
      xTo: number,
      yTo: number,
      boardOffset: BoardOffset
    ) => {
      return;
    };

    const { asFragment } = render(
      <ChessBoard
        boardArray={[]}
        blackKingCheck={false}
        whiteKingCheck={false}
        movePiece={movePiece}
        config={minotaurConfig}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
