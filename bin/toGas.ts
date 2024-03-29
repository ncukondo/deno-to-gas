import * as path from "https://deno.land/std@0.179.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.179.0/fs/ensure_dir.ts";
import { bundle, BundleOptions } from "https://deno.land/x/emit@0.28.0/mod.ts";

type ImportMap = { imports: Record<string, string> };
type ConvertOption = {
  importmap: ImportMap;
  cachePath: string;
  globalName: string;
  exposeExports?: boolean;
};
type BuildOption = ConvertOption & {
  outfile: string;
};

const buildiif = async (
  sourcePath: string,
  { importmap, globalName }: { importmap?: ImportMap; globalName: string },
) => {
  const additional = importmap ? { importMap: importmap } : {};
  const opt: BundleOptions = {
    type: "classic",
    ...additional,
  };
  const code = `const ${globalName} = ${(await bundle(sourcePath, opt)).code}`;
  return code;
};

const exposeEntryExports = (code: string, globalName: string) => {
  console.log(code);
  const exports = new Function(`${code} return ${globalName}`)();
  const isFunction = (x: unknown): x is (...args: unknown[]) => unknown =>
    typeof x === "function";
  return Object.entries(exports).map(([name, obj]) => {
    return isFunction(obj)
      ? `function ${name}(...args){ return ${globalName}.${name}(...args);}`
      : `const ${name} = ${globalName}.${name};`;
  }).join("\n");
};

const loadImportmap = async () => {
  const nameCandidates = [
    "deno.jsonc",
    "deno.json",
    "import_map.json",
  ];
  const candidates = nameCandidates.flatMap((name) =>
    ["./", "../"].map((dir) => dir + name)
  );
  const file = (await Promise.all(candidates.map((path) =>
    (async () => {
      try {
        const info = Deno.stat(path);
        return { isFile: (await info).isFile, path };
      } catch {
        return { isFIle: false, path };
      }
    })()
  ))).find((info) => info?.isFile)?.path;
  if (file) return JSON.parse(await Deno.readTextFile(file)) as ImportMap;
  return { "imports": {} as Record<string, string> };
};

const getGlobalName = (sourcePath: string) => {
  const basename = path.basename(sourcePath);
  const [globalName] = basename.split(".").map((t) => t.replaceAll("-", "_"));
  return globalName;
};

const makeDefaultOption = async (sourcePath: string): Promise<BuildOption> => {
  const globalName = getGlobalName(sourcePath);
  const dir = path.dirname(sourcePath);
  const outfile = path.join(dir, `${globalName}.js`);
  const importmap = await loadImportmap();
  const cachePath = path.join(
    Deno.env.get("HOME") ?? "./",
    ".deno_build_cache",
  );
  return {
    globalName,
    importmap,
    cachePath,
    outfile,
    exposeExports: true,
  };
};

const convert = async (
  sourcePath: string,
  options?: Partial<ConvertOption>,
) => {
  const defaultOption = makeDefaultOption(sourcePath);
  const { ...opt } = {
    ...await defaultOption,
    ...options,
  };
  const code = await buildiif(sourcePath, opt);
  const tail = opt.exposeExports
    ? "\n" + exposeEntryExports(code, opt.globalName)
    : "";
  return { code: code + tail, options: opt };
};

const build = async (
  sourcePath: string,
  options?: Partial<BuildOption>,
) => {
  const defaultOption = makeDefaultOption(sourcePath);
  const { code, options: opt } = await convert(sourcePath, options);
  const { outfile } = { ...await defaultOption, ...opt, ...options };
  const dir = path.dirname(outfile);
  await ensureDir(dir);
  await Deno.writeTextFile(outfile, code);
  return { code, info: { entry: sourcePath, ...opt, outfile } };
};

export { build, convert };
export type { BuildOption, ConvertOption };
