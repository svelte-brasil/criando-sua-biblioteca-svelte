import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "doc/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js",
    },
    plugins: [
      svelte({ dev: !production }),
      css({ output: "bundle.css" }),
      resolve({
        browser: true,
        dedupe: (importee) =>
          importee === "svelte" || importee.startsWith("svelte/"),
      }),
      commonjs(),
      !production && serve(),
      !production && livereload("public"),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/ErrorScreen.svelte",
    output: { file: pkg.main, format: "umd", name: "ErrorScreen" },
    plugins: [svelte({ emitCss: false }), resolve(), commonjs()],
  },
  {
    input: "src/ErrorScreen.svelte",
    output: { file: pkg.module, format: "es" },
    external: ["svelte/internal"],
    plugins: [svelte({ emitCss: false }), commonjs()],
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
