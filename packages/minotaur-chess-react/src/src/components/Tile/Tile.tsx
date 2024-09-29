"use client";

import styled from "styled-components";
import { MinotaurConfig, Piece } from "@karmacarrot/minotaur-chess-engine";

const TileContainer = styled.div<{ tileType: string }>`
  height: 50px;
  width: 50px;
  display: grid;
  background-color: ${({ tileType }) =>
    tileType === "dark" ? "#975bba" : "#e6cdf3"};
`;

const PieceContainer = styled.div<{ threat: boolean; pieceImage: string }>`
  background-repeat: no-repeat;
  background-position: center;
  background-size: 45px;
  height: 50px;
  width: 50px;
  background-image: url(${({ pieceImage }) => pieceImage});
  hover {
    cursor: grab;
  }
  active {
    cursor: grabbing;
  }
  pointer-events: auto;
  ${({ threat }) =>
    threat &&
    `
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgb(134, 12, 12);
    background-size: 45px;
    height: 50px;
    width: 50px;
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
  let pieceImage = "";
  if (piece && config.pieceImages[piece]) {
    pieceImage = config.pieceImages[piece];
  }

  return (
    <TileContainer tileType={tiletype}>
      {piece && (
        <div
          draggable
          onDragStart={(e) => {
            pickUpPiece(piece, e.pageX, e.pageY);
          }}
          onDrag={(e) => {
            movePiece(piece, e.pageX, e.pageY);
          }}
          onDragEnd={(e) => {
            putDownPiece(piece, e.pageX, e.pageY);
          }}
        >
          <PieceContainer threat={threat} pieceImage={pieceImage} id={piece} />
        </div>
      )}
    </TileContainer>
  );
}
