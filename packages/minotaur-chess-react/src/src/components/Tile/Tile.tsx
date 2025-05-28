'use client';

import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { MinotaurConfig, Piece } from '@karmacarrot/minotaur-chess-engine';

const TileContainer = styled.div<{ $tileType: string }>`
  height: 50px;
  width: 50px;
  display: grid;
  background-color: ${({ $tileType }) => ($tileType === 'dark' ? '#975bba' : '#e6cdf3')};
`;

const PieceContainer = styled.div<{ $threat: boolean; $pieceImage: string }>`
  background-repeat: no-repeat;
  background-position: center;
  background-size: 45px;
  height: 50px;
  width: 50px;
  background-image: url(${({ $pieceImage }) => $pieceImage});
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  pointer-events: auto;

  ${({ $threat }) =>
    $threat &&
    `
    background-color: rgb(134, 12, 12);
  `}
`;

export function Tile({
  movePiece,
  pickUpPiece,
  putDownPiece,
  tiletype,
  piece,
  threat,
  config,
}: {
  movePiece: (piece: Piece, x: number, y: number) => any;
  pickUpPiece: (piece: Piece, x: number, y: number) => any;
  putDownPiece: (piece: Piece, x: number, y: number) => any;
  tiletype: string;
  piece: Piece;
  threat: boolean;
  config: MinotaurConfig;
}) {
  const pieceImage = piece && config.pieceImages[piece] ? config.pieceImages[piece] : '';
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    console.log(`drag start: ${e.pageX}, ${e.pageY}`);
    pickUpPiece(piece, e.pageX, e.pageY);
  };

  const handleDrag = (e: React.DragEvent) => {
    movePiece(piece, e.pageX, e.pageY);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log(`drag end: ${e.pageX}, ${e.pageY}`);
    putDownPiece(piece, e.pageX, e.pageY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    pickUpPiece(piece, touch!.clientX, touch!.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    movePiece(piece, touch!.clientX, touch!.clientY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    putDownPiece(piece, touch!.clientX, touch!.clientY);
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      container.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      container.addEventListener('touchend', handleTouchEnd, {
        passive: false,
      });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [piece, movePiece, pickUpPiece, putDownPiece]);

  return (
    <TileContainer ref={containerRef} $tileType={tiletype}>
      {piece && (
        <div draggable onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
          <PieceContainer $threat={threat} $pieceImage={pieceImage} id={piece} />
        </div>
      )}
    </TileContainer>
  );
}
