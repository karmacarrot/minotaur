import { defineConfig } from "tsup";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cssModulesPlugin = require("esbuild-css-modules-plugin");

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  plugins: [cssModulesPlugin()],
  clean: true,
});
