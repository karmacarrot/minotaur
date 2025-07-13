'use client';
import { ChessGameController, MinotaurHeader } from '@karmacarrot/minotaur-chess-react';
import styles from './page.module.css';
import { minotaurConfig } from '../../minotaur';

export default function Engine() {
  return (
    <>
      <MinotaurHeader />

      <main className={styles.main}>
        <ChessGameController config={minotaurConfig}></ChessGameController>
      </main>
      <footer className={styles.footer}></footer>
    </>
  );
}
