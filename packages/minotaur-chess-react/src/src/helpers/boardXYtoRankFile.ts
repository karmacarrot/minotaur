import { BoardXY } from '@karmacarrot/minotaur-chess-engine';

export type BoardPosition = {
  Rank: number;
  File: string;
};

export function convertBoardXYtoRankFile(
  offset: BoardXY,
  tileSize: number,
  boardTarget: BoardXY
): BoardPosition {
  const file = String.fromCharCode(97 + Math.floor((boardTarget.x - offset.x) / tileSize));

  const rank = 8 - Math.floor((boardTarget.y - offset.y) / tileSize);

  return { Rank: rank, File: file };
}

export function convertRankFileToBoardXY(
  rank: number,
  file: string,
  offset: BoardXY,
  tileSize: number
): BoardXY {
  const y = (8 - rank) * tileSize + offset.y;
  const x = (file.charCodeAt(0) - 97) * tileSize + offset.x;
  return { x, y };
}
