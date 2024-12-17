import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { GameStatus } from '@karmacarrot/minotaur-chess-react';
import { InitialGameStatus, StartingBoard, StartingNode } from '@karmacarrot/minotaur-chess-engine';

describe('GameStatus', () => {
  it('should render', () => {
    const { asFragment } = render(
      <GameStatus boardState={StartingBoard} gameStatus={InitialGameStatus}></GameStatus>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
