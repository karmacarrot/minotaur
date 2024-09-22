import { MinotaurConfig } from "@karmacarrot/minotaur-chess-engine";

export interface BoardOffset {
  x: number;
  y: number;
}

export interface ChessGameProps {
  config: MinotaurConfig;
}
