import { Plugin, rollup, RollupOptions } from "npm:rollup";
import virtual from "npm:@rollup/plugin-virtual";

type BuildOption = {
  globalName: string;
};

const toIife = async (entryCode: string, opt: BuildOption) => {
  const virtualCode =
    virtual as unknown as ((opt: Record<string, string>) => Plugin);
  const option = {
    input: "entry",
    output: {
      name: opt.globalName,
      format: "iife",
      generatedCode: {
        arrowFunctions: true,
        constBindings: true,
      },
    },
    plugins: [
      virtualCode({
        entry: entryCode,
      }),
    ],
  } satisfies RollupOptions;
  const bundle = await rollup(option);
  const { output: [{ code }] } = await bundle.generate(option.output);
  await bundle.close();
  return code;
};

if (import.meta.main) {
  const src = await Deno.readTextFile("./dist/index.js");
  const code = await toIife(src, {
    globalName: "testapp",
  });
  console.log(code);
}
export { toIife };
