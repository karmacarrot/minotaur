import { LogLevels } from "./definitions";

function MultiLog(
  outputType: LogLevels,
  message: string,
  outputVerbosity: LogLevels
) {
  if (
    (outputType === LogLevels.warn || outputType === LogLevels.info) &&
    outputVerbosity === LogLevels.error
  ) {
    return;
  }

  if (outputType === LogLevels.info && outputVerbosity !== LogLevels.info) {
    return;
  }

  switch (outputType) {
    case LogLevels.info:
      console.info(message);
    case LogLevels.warn:
      console.warn(message);
    case LogLevels.error:
      console.error(message);
    case LogLevels.log:
      console.log(message);
    default:
      console.log(message);
  }
}

export default MultiLog;
