import { rollup } from "npm:rollup";
import { rollupImportMapPlugin } from "npm:rollup-plugin-import-map";

import typescript from "npm:rollup-plugin-typescript2";
import url from "npm:rollup-plugin-url-resolve";

const moduleName = "apptest";

const options = {
  input: "src/main.ts",
  output: {
    name: moduleName,
    file: `./dist/index.js`,
    format: "iife",
    generatedCode: {
      preset: "es2015",
      constBindings: true,
      arrowFunctions: true,
    },
    interop: "esModule",
  },

  plugins: [
    typescript({
      check: false,
      "compilerOptions": {
        "target": "esNEXT",
        "module": "esNEXT",
        "lib": [
          "esNEXT",
        ],
      },
    }),
    rollupImportMapPlugin("deno.jsonc"),
    url(),
  ],
} as const;

const bundle = await rollup(options);
await bundle.write(options.output);
await bundle.close();
