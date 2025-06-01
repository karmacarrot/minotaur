'use client';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import { BoardArrangements } from '@karmacarrot/minotaur-chess-engine';
import styled from 'styled-components';

const GameControlsContainer = styled.div`
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10;
`;

export function GameControls({
  resetGame,
  updateControl,
  engineDepth,
  setDepth,
}: {
  resetGame: (boardArrangment: BoardArrangements) => void;
  updateControl: (action: 'black' | 'white', payload: boolean) => void;
  engineDepth: number;
  setDepth: (newDepth: number) => void;
}) {
  const [desiredArrangement, setDesiredArrangement] = useState(BoardArrangements.StartingPositions);
  const [whiteComputerControlled, setWhiteComputerControlled] = useState(false);
  const [blackComputerControlled, setBlackComputerControlled] = useState(true);

  const handleArrangementChange = (event: SelectChangeEvent<BoardArrangements>) => {
    const newValue: BoardArrangements = event.target.value as BoardArrangements;
    setDesiredArrangement(newValue);
  };

  const handleDepthChange = (event: SelectChangeEvent<BoardArrangements>) => {
    const newValue: number = event.target.value as number;
    setDepth(newValue);
  };

  const flipBlackControl = () => {
    setBlackComputerControlled(!blackComputerControlled);
    updateControl('black', !blackComputerControlled);
  };
  const flipWhiteControl = () => {
    setWhiteComputerControlled(!whiteComputerControlled);
    updateControl('white', !whiteComputerControlled);
  };

  return (
    <GameControlsContainer>
      <Stack spacing={2} direction="row">
        <Select
          labelId="board-state-select-label"
          id="board-state-select"
          value={desiredArrangement}
          label="Setup"
          onChange={handleArrangementChange}
          style={{ backgroundColor: '#e6cdf3', color: '#ffffff' }}
        >
          <MenuItem value={BoardArrangements.StartingPositions}>Start</MenuItem>
          <MenuItem value={BoardArrangements.MiddleGame}>Middle</MenuItem>
          <MenuItem value={BoardArrangements.EndGame}>End</MenuItem>
          <MenuItem value={BoardArrangements.DuellingPawns}>Duelling Pawns</MenuItem>
          <MenuItem value={BoardArrangements.MiniMaxOne}>MiniMax 1</MenuItem>
          <MenuItem value={BoardArrangements.MateInOneForBlackGameBoard}>Mate for black</MenuItem>
          <MenuItem value={BoardArrangements.MateInOneForWhiteGameBoard}>Mate for white</MenuItem>
          <MenuItem value={BoardArrangements.CastleForBlackGameBoard}>Castle for black</MenuItem>
          <MenuItem value={BoardArrangements.CastleForBlackAfter}>Castle for black after</MenuItem>
          <MenuItem value={BoardArrangements.BlackShortCastledGameBoard}>
            Black Short Castled
          </MenuItem>
          <MenuItem value={BoardArrangements.BlackLongCastledGameBoard}>
            Black Long Castled
          </MenuItem>
          <MenuItem value={BoardArrangements.EnPassantBoard}>En-Passant Board</MenuItem>
          <MenuItem value={BoardArrangements.PromoteForBlack}>Promotion for black</MenuItem>
          <MenuItem value={BoardArrangements.PromoteForWhite}>Promotion for white</MenuItem>
        </Select>
        <Button
          variant="contained"
          onClick={(e) => {
            resetGame(desiredArrangement);
          }}
          style={{ backgroundColor: '#975bba', color: '#ffffff' }}
        >
          Reset
        </Button>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={blackComputerControlled} />}
            label="Black computer"
            onChange={flipBlackControl}
          />
          <FormControlLabel
            control={<Checkbox checked={whiteComputerControlled} />}
            label="White Computer"
            onChange={flipWhiteControl}
          />
        </FormGroup>
        <Select
          labelId="engine-depth"
          id="engine-depth-select"
          value={engineDepth}
          label="Depth"
          onChange={handleDepthChange}
          style={{ backgroundColor: '#e6cdf3', color: '#ffffff' }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </Stack>
    </GameControlsContainer>
  );
}
