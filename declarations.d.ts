declare module '*.png' {
  const value: {
    src: string;
    height: number;
    width: number;
    blurDataURL: string;
  };
  export default value;
}
