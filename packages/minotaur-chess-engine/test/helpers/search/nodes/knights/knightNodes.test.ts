/**
 * @jest-environment node
 */

import { LoggerConfig } from "../../../../../../logger.config";
import {
  createEvalLogs,
  outputEvalLogsHtml,
} from "../../../../../Logging/evaluationLogs";
import { StartingNode } from "../nodeGenerators";
import { knightNodes } from "./knightNodes";
const showEvalOutputs = LoggerConfig.enableEvaluationLogs;
describe("knightNodes", () => {
  it("returns 4 legal knight moves from white opening positions", () => {
    const startNode = StartingNode();
    const evalLogs = createEvalLogs();
    const potentialMoves = knightNodes(startNode, evalLogs);

    if (showEvalOutputs) {
      outputEvalLogsHtml(
        evalLogs,
        "returns 4 legal knight moves from white opening positions"
      );
    }

    expect(potentialMoves.length).toBe(4);
  });
  it("returns 4 legal knight moves from black opening positions", () => {
    const startNode = StartingNode();
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = knightNodes(startNode, evalLogs);

    if (showEvalOutputs) {
      outputEvalLogsHtml(
        evalLogs,
        "returns 4 legal knight moves from black opening positions"
      );
    }

    expect(potentialMoves.length).toBe(4);
  });
});
