"use client";
import { ChessGame } from "@karmacarrot/minotaur-chess-react";
import { minotaurConfig } from "./../minotaur";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <ChessGame config={minotaurConfig}></ChessGame>
    </div>
  );
}
