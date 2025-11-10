import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["app/index.ts"],
  format: ["esm"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  target: "es2022",
  platform: "node",
  bundle: true,
});
