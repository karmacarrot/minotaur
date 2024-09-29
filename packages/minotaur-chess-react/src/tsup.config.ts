import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,

  onSuccess:
    "cross-env npx postcss ./src/**/*.css --dir dist && node ./copy-assets.mjs",
});
