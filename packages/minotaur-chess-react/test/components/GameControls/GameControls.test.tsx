import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { GameControls } from '@karmacarrot/minotaur-chess-react';

describe('GameControls', () => {
  it('should render', () => {
    const { asFragment } = render(
      <GameControls
        updateControl={() => {}}
        resetGame={() => {}}
        engineDepth={2}
        setDepth={() => {}}
      ></GameControls>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
