import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { build } from "./bin/toGas.ts";

const { args: [entry], options } = await new Command()
  .name("deno-to-gas")
  .version("0.0.3")
  .description("Convert deno modules to google apps scripts file")
  .option("-o, --outfile <path:string>", "path to output.")
  .option(
    "-e, --exposeExports <expose:boolean>",
    "wether expose exports in entry file",
    {
      default: true as boolean,
    },
  )
  .option("-n, --globalName <name:string>", "Global name for iife.")
  .arguments("<entryfile:string>")
  .parse(Deno.args);

const { info } = await build(entry, options);
console.log(`

  Converted🎉: "${info.entry}" -> "${info.outfile}"

  `);
Deno.exit();
