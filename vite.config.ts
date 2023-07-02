import path from "path";
import colors from "picocolors";

import progress from "vite-plugin-progress";

import typescript from "@rollup/plugin-typescript";
import { visualizer } from "rollup-plugin-visualizer";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    progress({
      format: `Building ${colors.green("[:bar]")} :percent :eta`,
      total: 100,
      width: 60,
    }),
  ],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 3123,
  },
  build: {
    
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
        name: "main",
      entry: path.resolve(__dirname, "src/main.ts"),
      fileName: "main",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
          exclude: ["**/__tests__"],
        }),
        visualizer({
          title: "visualizer - vite-vanilla-ts-module",
          template: "network",
        }),
      ],
    },
  },
});
