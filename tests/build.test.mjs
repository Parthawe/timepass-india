import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  readdir,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { buildSite } from "../scripts/build.mjs";
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "timepass-build-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, "src"),
    output = join(root, "out");
  await mkdir(source);
  await writeFile(
    join(source, "index.html"),
    '<link href="./style.css"><script type="module" src="./app.js"></script>',
  );
  await writeFile(join(source, "style.css"), "body{color:black}");
  await writeFile(
    join(source, "app.js"),
    'import {value} from "./engine.js"; console.log(value);',
  );
  await writeFile(join(source, "engine.js"), "export const value=1;");
  return { source, output, version: "test" };
}
test("a changed dependency invalidates parent entry and HTML references", async (t) => {
  const f = await fixture(t),
    before = await buildSite(f);
  await writeFile(join(f.source, "engine.js"), "export const value=2;");
  const after = await buildSite(f);
  assert.notEqual(before.entry, after.entry);
  assert.notEqual(before.modules["engine.js"], after.modules["engine.js"]);
  const html = await readFile(join(f.output, "index.html"), "utf8");
  assert.ok(html.includes(after.entry));
  const code = await readFile(join(f.output, after.entry), "utf8");
  assert.ok(code.includes(after.modules["engine.js"]));
  assert.equal((await readdir(f.output)).includes(before.entry), false);
});
test("unchanged source produces deterministic filenames and release metadata", async (t) => {
  const f = await fixture(t),
    before = await buildSite(f),
    after = await buildSite(f);
  assert.deepEqual(after, before);
  assert.deepEqual(
    JSON.parse(await readFile(join(f.output, "release.json"), "utf8")),
    after,
  );
  assert.ok(
    (await readFile(join(f.output, "index.html"), "utf8")).includes(
      after.stylesheet,
    ),
  );
});
test("missing dependencies fail before deleting the prior successful output", async (t) => {
  const f = await fixture(t),
    before = await buildSite(f);
  await writeFile(join(f.source, "app.js"), 'import {x} from "./missing.js";');
  await assert.rejects(buildSite(f), /Missing module/);
  assert.ok((await readdir(f.output)).includes(before.entry));
});
test("original asset URLs remain available for cached first-release HTML", async (t) => {
  const f = await fixture(t);
  await buildSite(f);
  assert.equal(
    await readFile(join(f.output, "app.js"), "utf8"),
    await readFile(join(f.source, "app.js"), "utf8"),
  );
  assert.equal(
    await readFile(join(f.output, "engine.js"), "utf8"),
    await readFile(join(f.source, "engine.js"), "utf8"),
  );
  assert.equal(
    await readFile(join(f.output, "style.css"), "utf8"),
    await readFile(join(f.source, "style.css"), "utf8"),
  );
});
