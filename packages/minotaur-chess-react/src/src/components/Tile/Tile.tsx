"use client";

import { Piece, pieceImages } from "@karmacarrot/minotaur-chess-engine";
import styles from "./Tile.module.css";

export default function Tile({
  movePiece,
  pickUpPiece,
  putDownPiece,
  tiletype,
  piece,
  threat,
}: {
  movePiece: (piece: Piece, x: number, y: number) => any;
  pickUpPiece: (piece: Piece, x: number, y: number) => any;
  putDownPiece: (piece: Piece, x: number, y: number) => any;
  tiletype: string;
  piece: Piece;
  threat: boolean;
}) {
  let pieceImage = "";
  if (piece) {
    pieceImage = `/assets/images/${pieceImages[piece]}.png`;
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
