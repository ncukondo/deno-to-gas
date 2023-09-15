import { build } from "../bin/toGas.ts";
const url = import.meta.resolve("./main.ts");
const { code } = await build("./sample/main.ts");
console.log(code);
