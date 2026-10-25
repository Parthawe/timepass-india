import { readFile, readdir, mkdir, writeFile, cp, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const digest = (text) =>
  createHash("sha256").update(text).digest("hex").slice(0, 12);
export async function buildSite({
  source = resolve("dist"),
  output = resolve("_site"),
  version = "development",
} = {}) {
  if (resolve(source) === resolve(output))
    throw new Error("Build output must differ from source.");
  const files = await readdir(source),
    modules = new Map(),
    visiting = new Set();
  const compile = async (name) => {
    if (modules.has(name)) return modules.get(name);
    if (!files.includes(name) || !name.endsWith(".js"))
      throw new Error("Missing module: " + name);
    if (visiting.has(name))
      throw new Error("Circular module dependency: " + name);
    visiting.add(name);
    let code = await readFile(resolve(source, name), "utf8");
    const imports = [...code.matchAll(/\bfrom\s*["'](\.\/[^"']+\.js)["']/g)];
    for (const match of imports) {
      const dependency = await compile(match[1].slice(2));
      code = code.replaceAll(match[1], "./" + dependency.file);
    }
    const entry = {
      file: name.slice(0, -3) + "." + digest(code) + ".js",
      code,
    };
    visiting.delete(name);
    modules.set(name, entry);
    return entry;
  };
  for (const name of files.filter((f) => f.endsWith(".js")))
    await compile(name);
  const css = await readFile(resolve(source, "style.css"), "utf8"),
    cssName = "style." + digest(css) + ".css";
  const entry = modules.get("app.js");
  if (!entry) throw new Error("Missing app.js entrypoint.");
  const html = (await readFile(resolve(source, "index.html"), "utf8"))
    .replace("./app.js", "./" + entry.file)
    .replace("./style.css", "./" + cssName);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const name of files.filter((f) => !["index.html"].includes(f)))
    await cp(resolve(source, name), resolve(output, name), { recursive: true });
  for (const { file, code } of modules.values())
    await writeFile(resolve(output, file), code);
  await writeFile(resolve(output, cssName), css);
  await writeFile(resolve(output, "index.html"), html);
  const manifest = {
    version,
    entry: entry.file,
    stylesheet: cssName,
    modules: Object.fromEntries(
      [...modules].map(([name, mod]) => [name, mod.file]),
    ),
  };
  await writeFile(
    resolve(output, "release.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  return manifest;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { version } = JSON.parse(await readFile("package.json", "utf8"));
  const manifest = await buildSite({ version });
  console.log(
    "Built Timepass " + manifest.version + " → _site/" + manifest.entry,
  );
}
