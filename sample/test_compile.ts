import { build } from "../bin/toGas.ts";
const { code } = await build("./sample/main.ts");
console.log(code);
