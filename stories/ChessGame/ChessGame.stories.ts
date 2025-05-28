import type { Meta, StoryObj } from '@storybook/react';
import { ChessGame } from '../../packages/minotaur-chess-react/src/src/components/ChessGame/ChessGame';
import { minotaurConfig } from '../mocks/config.mocks';

const meta = {
  title: 'Minotaur/ChessGame',
  component: ChessGame,
  parameters: {
    layout: 'centered',
  },
  args: {
    config: minotaurConfig,
  },
} satisfies Meta<typeof ChessGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
