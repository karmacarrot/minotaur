"use client";

import { Tile } from "./../Tile/Tile";
import { useState } from "react";
import {
  xOrYTileLength,
  ChessboardArray,
  Piece,
} from "@karmacarrot/minotaur-chess-engine";
import { BoardOffset } from "./definitions";
import { MinotaurConfig } from "@karmacarrot/minotaur-chess-engine";
import styled from "styled-components";

const TileContainer = styled.div`
  width: 400px;
  height: 400px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  margin: 50px;
  border: 1px;
  border-style: solid;
`;

export function ChessBoard({
  boardArray,
  blackKingCheck,
  whiteKingCheck,
  movePiece,
  config,
}: {
  boardArray: ChessboardArray;
  blackKingCheck: boolean;
  whiteKingCheck: boolean;
  movePiece: (
    piece: Piece,
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    boardOffset: BoardOffset
  ) => void;
  config: MinotaurConfig;
}) {
  let tiles = [];
  let useDark = false;

  const [movingPiece, setMovingPiece] = useState<Piece>(null);
  const [movingFrom, setMovingFrom] = useState({ x: 0, y: 0 });
  let boardOffset = { x: 0, y: 0 };

  const dragPiece = (piece: Piece, x: number, y: number) => {
    //console.log(`drag ${piece} ${x}, ${y}`);
  };
  const startDragPiece = (piece: Piece, x: number, y: number) => {
    setMovingPiece(piece);
    setMovingFrom({ x, y });
  };
  const endDragPiece = (piece: Piece, x: number, y: number) => {
    // console.log(`drag end ${piece} ${x}, ${y}`);
    movePiece(piece, movingFrom.x, movingFrom.y, x, y, boardOffset);
  };

  for (
    let columnCount = boardArray.length - 1;
    columnCount >= 0;
    columnCount--
  ) {
    const row = boardArray[columnCount];
    for (
      let rowCount = boardArray[columnCount]!.length - 1;
      rowCount >= 0;
      rowCount--
    ) {
      let threat =
        (blackKingCheck &&
          boardArray[columnCount]![rowCount] === "blackKing") ||
        (whiteKingCheck && boardArray[columnCount]![rowCount] === "whiteKing");
      tiles.push(
        useDark ? (
          <Tile
            key={columnCount + "-" + rowCount}
            tiletype='dark'
            piece={boardArray[columnCount]![rowCount]!}
            pickUpPiece={startDragPiece}
            putDownPiece={endDragPiece}
            movePiece={dragPiece}
            threat={threat}
            config={config}
          />
        ) : (
          <Tile
            key={columnCount + "-" + rowCount}
            tiletype='light'
            piece={boardArray[columnCount]![rowCount]!}
            pickUpPiece={startDragPiece}
            putDownPiece={endDragPiece}
            movePiece={dragPiece}
            threat={threat}
            config={config}
          />
        )
      );
      if (rowCount % xOrYTileLength !== 0) {
        useDark = !useDark;
      }
    }
  }

  return (
    <TileContainer
      ref={(el) => {
        if (!el) return;
        boardOffset = {
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
        };
      }}
    >
      {tiles}
    </TileContainer>
  );
}
