import {
  bigIntToBinaryString,
  BitBoard,
  BoardArray,
} from "@karmacarrot/minotaur-chess-engine";
import styles from "./DataDump.module.css";
export default function DataDump({ boardState }: { boardState: BitBoard }) {
  const boardAsArray = BoardArray(boardState);
  return (
    <div className={styles.datadump}>
      <h2>Data dump</h2>
      <div>
        {boardAsArray.map((row, rowIndex) => {
          return row.map((col, colIndex) => {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.arrayvalue}
              >
                {col ? col : "null"}
              </div>
            );
          });
        })}
      </div>
      <div>
        <ul>
          <li>White Pawns:{bigIntToBinaryString(boardState.whitePawn)}</li>
        </ul>
      </div>
    </div>
  );
}
