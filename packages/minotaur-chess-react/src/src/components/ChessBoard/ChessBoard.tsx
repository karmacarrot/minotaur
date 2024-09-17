"use client";
import styles from "./ChessBoard.module.css";
import Tile from "./../Tile/Tile";
import { useState } from "react";
import {
  xOrYTileLength,
  ChessboardArray,
  Piece,
} from "@karmacarrot/minotaur-chess-engine";
import { BoardOffset } from "./definitions";

export default function ChessBoard({
  boardArray,
  blackKingCheck,
  whiteKingCheck,
  movePiece,
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
          />
        )
      );
      if (rowCount % xOrYTileLength !== 0) {
        useDark = !useDark;
      }
    }
  }

  return (
    <div
      ref={(el) => {
        if (!el) return;
        boardOffset = {
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
        };
      }}
      className={styles.chessboard}
    >
      {tiles}
    </div>
  );
}
