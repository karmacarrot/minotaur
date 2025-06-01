'use client';

import { Box, Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { GameStatus } from '../GameStatus/GameStatus';
import { GameControls } from '../GameControls/GameControls';
import { useMinotaur } from '../../hooks/useMinotaur';
import { ChessGameProps } from '../../definitions';

export const ChessGame: React.FC<ChessGameProps> = ({ config }) => {
  if (!config || !config.pieceImages) {
    throw new Error('minotaurConfig is not provided or missing pieceImages!');
  }

  const {
    currentBoard,
    resetGame,
    boardAsArray,
    engineDepth,
    setEngineDepth,
    updateComputerControl,
    movePiece,
    gameStatus,
  } = useMinotaur(400);

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <Box display="flex" paddingLeft={0} left={0} marginLeft={0} flexDirection="column">
        <GameControls
          updateControl={updateComputerControl}
          resetGame={resetGame}
          engineDepth={engineDepth}
          setDepth={setEngineDepth}
        />

        <Box display="flex" gap={4} paddingLeft={0} left={0} flexWrap="wrap">
          <Box flexShrink={0}>
            <ChessBoard
              boardArray={boardAsArray}
              movePiece={movePiece}
              blackKingCheck={gameStatus.blackKingChecked}
              whiteKingCheck={gameStatus.whiteKingChecked}
              config={config}
            />
          </Box>

          <Box
            paddingLeft={0}
            width={{ xs: '100%', sm: 300 }}
            minWidth={250}
            flexGrow={1}
            sx={{ flexBasis: 'auto' }}
          >
            <GameStatus boardState={currentBoard} gameStatus={gameStatus} />
          </Box>
          <Box>
            <Typography variant="body1" paragraph>
              This chess game is using 64-bit binary integers for each type of piece which are then
              merged into an array for React to render into the board. State is managed by React and
              the piece movement is done through applying bitmasks in pure functions. Datastructures
              are intended to be immutable. Currently only pawns movement rules are enforced. Engine
              analysis is done by a recursive minimax function with alpha beta pruning yet to be
              implemented. The intention is to first create a strong engine for the pawns then
              slowly expand out to the other pieces.
            </Typography>

            <Typography variant="h6">Current feature list</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Basic moves - done" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Basic engine minimax game tree search - done" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Check / checkmate - done" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Castling - done" />
              </ListItem>
              <ListItem>
                <ListItemText primary="en passant - done" />
              </ListItem>
              <ListItem>
                <ListItemText primary="promotions - in progress" />
              </ListItem>
              <ListItem>
                <ListItemText primary="engine refactor for UCI handler - in progress" />
              </ListItem>
              <ListItem>
                <ListItemText primary="alpha / beta pruning, eval optimisations - to do" />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Divider />
      </Box>
    </Container>
  );
};
