import React from "react";
import styles from "./EvaluationBar.module.css";
//import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

function EvaluationBar({ score }: { score: number }) {
  return (
    <div>
      Eval: {score}
      {/* <Gauge
        value={75}
        startAngle={-110}
        endAngle={110}
        sx={{
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 40,
            transform: "translate(0px, 0px)",
          },
        }}
        text={({ value, valueMax }) => `${value} / ${valueMax}`}
      /> */}
    </div>
  );
}

export default EvaluationBar;
