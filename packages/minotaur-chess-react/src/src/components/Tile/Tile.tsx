"use client";

import {
  MinotaurConfig,
  Piece,
  pieceImages,
} from "@karmacarrot/minotaur-chess-engine";
import styles from "./Tile.module.css";

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
    <div className={tiletype === "dark" ? styles.dark : styles.light}>
      {piece && (
        <div
          className={threat ? styles.threat : styles.piece}
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
          id={piece}
          style={{ backgroundImage: `url(${pieceImage})` }}
        ></div>
      )}
    </div>
  );
}
