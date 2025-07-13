export const normalizedLineEndings = (fileContents: string) => {
  return fileContents.replace(/\r\n|\r/g, '\n');
};

export const splitOnCarriageReturnsAndSpaces = (fileContents: string) => {
  return fileContents.trim().split(/\s+/);
};
