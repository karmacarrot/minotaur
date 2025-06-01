'use client';
import { ChessGame, MinotaurHeader } from '@karmacarrot/minotaur-chess-react';
import styles from './page.module.css';
import { minotaurConfig } from '../minotaur';

export default function Home() {
  return (
    <>
      <MinotaurHeader />

      <main className={styles.main}>
        <ChessGame config={minotaurConfig}></ChessGame>
      </main>
      <footer className={styles.footer}></footer>
    </>
  );
}
