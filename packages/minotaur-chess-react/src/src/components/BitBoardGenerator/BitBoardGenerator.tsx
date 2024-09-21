import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { ChessBoard } from "../ChessBoard/ChessBoard";
import {
  BoardArray,
  initBoard,
  BoardArrangements,
  bigIntToBinaryString,
} from "@karmacarrot/minotaur-chess-engine";

import { useState } from "react";
import { CheckBoxBoard } from "./CheckBoxBoard";
import styles from "./BitBoardGenerator.module.css";

export function BitBoardGenerator() {
  const [currentBoard, setCurrentBoard] = useState(
    initBoard(BoardArrangements.EmptyBoard)
  );
  const [selectedPiece, setSelectedPiece] = useState("whitePawns");
  const boardAsArray = BoardArray({ ...currentBoard });
  const movePiece = () => {
    return false;
  };

  const handlePieceChange = (event: SelectChangeEvent<string>) => {
    setSelectedPiece(event.target.value);
  };
  const [checkboxStates, setCheckboxStates] = useState(
    Array.from({ length: 8 }, () => Array(8).fill(false))
  );

  const setCheckboxState = (row: number, col: number, isChecked: boolean) => {
    setCheckboxStates((prevStates) =>
      prevStates.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? isChecked : c)) : r
      )
    );
  };
  const applyPositions = () => {
    let binaryString = "";

    for (let i = 7; i >= 0; i--) {
      for (let j = 0; j < 8; j++) {
        binaryString += checkboxStates[i]![j] ? "1" : "0";
      }
    }

    const newBitboard = BigInt("0b" + binaryString);

    setCurrentBoard((prevBoard) => {
      const updatedBoard = { ...prevBoard };
      switch (selectedPiece) {
        case "whitePawns":
          updatedBoard.whitePawn = newBitboard;
          break;
        case "blackPawns":
          updatedBoard.blackPawn = newBitboard;
          break;
        // Add cases for other piece types as needed
        default:
          break;
      }
      return updatedBoard;
    });
  };

  return (
    <>
      <ChessBoard
        movePiece={movePiece}
        boardArray={boardAsArray}
        blackKingCheck={false}
        whiteKingCheck={false}
      ></ChessBoard>
      <div className={styles.generator}>
        <CheckBoxBoard
          checkboxStates={checkboxStates}
          setCheckboxState={setCheckboxState}
        ></CheckBoxBoard>
      </div>
      <div>
        {" "}
        <Stack spacing={2} direction='row'>
          <Select
            labelId='piece-select-label'
            id='piece-select'
            value='whitePawns'
            label='Piece'
            onChange={handlePieceChange}
          >
            <MenuItem value='whitePawns'>White Pawns</MenuItem>
            <MenuItem value='blackPawns'>Black Pawns</MenuItem>
          </Select>
          <Button
            variant='contained'
            onClick={(e) => {
              applyPositions();
            }}
          >
            Apply
          </Button>
        </Stack>
      </div>
      <TextField
        id='standard-multiline-static'
        label='Bitboard'
        multiline
        rows={8}
        variant='standard'
        value={bigIntToBinaryString(currentBoard.whitePawn)}
      />
    </>
  );
}
