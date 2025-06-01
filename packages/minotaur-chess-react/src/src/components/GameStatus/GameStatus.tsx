'use client';

import {
  bigIntToBinaryString,
  BitBoard,
  evaluateBoard,
  GameStatus as GameStatusModel,
  getFenFromGameNode,
  nodeFromBoardAndGameState,
} from '@karmacarrot/minotaur-chess-engine';

import { EvaluationBar } from '../EvaluationBar/EvaluationBar';
import { Box, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

export function GameStatus({
  gameStatus,
  boardState,
}: {
  gameStatus: GameStatusModel;
  boardState: BitBoard;
}) {
  const evalBoard = evaluateBoard(boardState, gameStatus.isWhitesTurn);
  const currentNode = nodeFromBoardAndGameState(boardState, gameStatus);

  const rows = [
    // { id: uuidv4(), property: 'Game over', value: gameStatus.isGameOver ? 'Yes' : 'No' },
    { id: uuidv4(), property: 'Turn', value: gameStatus.isWhitesTurn ? 'White' : 'Black' },
    {
      id: uuidv4(),
      property: 'White Player',
      value: gameStatus.whiteComputerControl ? 'Computer' : 'Human',
    },
    {
      id: uuidv4(),
      property: 'Black Player',
      value: gameStatus.blackComputerControl ? 'Computer' : 'Human',
    },
    {
      id: uuidv4(),
      property: 'White Can Castle',
      value: `${gameStatus.whiteKingCanCastleLong ? 'Long' : ''}${gameStatus.whiteKingCanCastleShort ? ' | Short' : ''}`,
    },
    {
      id: uuidv4(),
      property: 'Black Can Castle',
      value: `${gameStatus.blackKingCanCastleLong ? 'Long' : ''}${gameStatus.blackKingCanCastleShort ? ' | Short' : ''}`,
    },
    {
      id: uuidv4(),
      property: 'White Last Double Pawn',
      value: gameStatus.lastWhiteDoublePawnMove > 0 ? 'true' : 'false',
    },
    {
      id: uuidv4(),
      property: 'Black Last Double Pawn',
      value: gameStatus.lastBlackDoublePawnMove > 0 ? 'true' : 'false',
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'property',
      headerName: '',
      flex: 1,
      minWidth: 130,
      headerClassName: 'MuiDataGrid-columnHeaderTitle',
    },
    {
      field: 'value',
      headerName: '',
      flex: 2,
      minWidth: 180,
      renderCell: (params) => (
        <Box
          sx={{
            overflowWrap: 'anywhere',
            whiteSpace: 'normal',
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" align="center">
        Game Status
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        hideFooter
        disableColumnMenu
        sx={{
          fontSize: '0.8rem',
          backgroundColor: '#f9f9f9',
          borderRadius: 1,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#e0e0e0',
          },
        }}
      />
      <Box sx={{ width: 500, maxWidth: '100%' }}>
        <TextField
          style={{ backgroundColor: '#e6cdf3', color: '#ffffff' }}
          fullWidth
          label=""
          id="inputFen"
          multiline
          value={getFenFromGameNode(currentNode)}
        />
      </Box>
      <EvaluationBar score={evalBoard} />
    </Box>
  );
}
