'use client';
import { ChessGame } from '@karmacarrot/minotaur-chess-react';
import styles from './page.module.css';
import { minotaurConfig } from '../minotaur';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ChessGame config={minotaurConfig}></ChessGame>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
