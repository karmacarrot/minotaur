import { MinotaurConfig } from '@karmacarrot/minotaur-chess-engine';

export interface BoardXY {
  x: number;
  y: number;
}

export interface ChessGameProps {
  config: MinotaurConfig;
}
