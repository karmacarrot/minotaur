import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { EvaluationBar } from '@karmacarrot/minotaur-chess-react';

describe('EvaluationBar', () => {
  it('should render', () => {
    const { asFragment } = render(<EvaluationBar score={10} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
