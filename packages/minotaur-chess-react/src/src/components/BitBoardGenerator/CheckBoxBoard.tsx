import { Checkbox } from "@mui/material";

interface CheckBoxBoardProps {
  checkboxStates: boolean[][];
  setCheckboxState: (row: number, col: number, isChecked: boolean) => void;
}

export default function CheckBoxBoard({
  checkboxStates,
  setCheckboxState,
}: CheckBoxBoardProps) {
  const createCheckBoxGrid = () => {
    let grid = [];
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        row.push(
          <Checkbox
            key={`${i}-${j}`}
            checked={checkboxStates[i]![j]}
            onChange={(e) => setCheckboxState(i, j, e.target.checked)}
          />
        );
      }

      grid.push(
        <div key={i} className='flex justify-center gap-2'>
          {row}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className='grid grid-cols-8 gap-4 p-4'>{createCheckBoxGrid()}</div>
  );
}
