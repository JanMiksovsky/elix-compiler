import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./demo/app.ts",
    output: {
      dir: "dist",
      format: "module",
      sourcemap: true,
    },
    plugins: [resolve(), typescript()],
  },
];
