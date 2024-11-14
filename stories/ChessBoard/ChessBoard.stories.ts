import type { Meta, StoryObj } from '@storybook/react';
import { ChessBoard } from '../../packages/minotaur-chess-react/src/src/components/ChessBoard/ChessBoard';
import { Piece } from '@karmacarrot/minotaur-chess-engine';
import { emptyBoard, minotaurConfig, getCheckedStateBoard, fullBoard } from './ChessBoard.mocks';

const meta = {
  title: 'Minotaur/ChessBoard',
  component: ChessBoard,
  parameters: {
    layout: 'centered',
  },
  args: {
    boardArray: emptyBoard,
    blackKingCheck: false,
    whiteKingCheck: false,
    movePiece: (piece: Piece, xFrom: number, yFrom: number, xTo: number, yTo: number) => {
      console.log(`Moving piece ${piece} from (${xFrom}, ${yFrom}) to (${xTo}, ${yTo})`);
    },
    config: minotaurConfig,
  },
} satisfies Meta<typeof ChessBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { boardArray: fullBoard } };

export const WhiteKingInCheck: Story = {
  args: {
    boardArray: getCheckedStateBoard(),
    whiteKingCheck: true,
  },
};
