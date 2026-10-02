// Exercise unbundled emitted ESM with native Node, as deployed serverless
// functions do. Bundling hides missing extensions in local imports.
import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

test("serverless reviews load and respond under native Node ESM without a bundler", async () => {
  const dir = await mkdtemp(join(tmpdir(), "reviews-runtime-"));
  try {
    await writeFile(join(dir, "package.json"), '{"type":"module"}');
    for (const file of ["api/reviews.ts", "server/google-reviews.ts", "shared/google-reviews.ts"]) {
      const output = join(dir, file.replace(/\.ts$/, ".js"));
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, ts.transpileModule(await readFile(file, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText);
    }
    const script = `
      import assert from 'node:assert/strict';
      import handler from './api/reviews.js';
      process.env.GOOGLE_PLACES_API_KEY = 'fictional-test-key';
      let now = 1800000000000;
      Date.now = () => now;
      let payload = {status:'OK', result:{rating:4.8,user_ratings_total:142}};
      globalThis.fetch = async () => ({ok:true,json:async()=>payload});
      async function request() {
        const res = {statusCode:200,status(n){this.statusCode=n;return this},
          setHeader(){},json(value){this.body=value;return this}};
        await handler({method:'GET'},res);
        assert.equal(res.statusCode,200);
        return res.body;
      }
      assert.deepEqual(await request(),{rating:4.8,reviewCount:142,fetchedAt:now});
      now += 86400000;
      payload = {status:'OK',result:{rating:4.8}};
      assert.deepEqual(await request(),{available:false});
      globalThis.fetch = async () => {throw new Error('mock provider failure')};
      assert.deepEqual(await request(),{available:false});
      delete process.env.GOOGLE_PLACES_API_KEY;
      assert.deepEqual(await request(),{available:false});
    `;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
      cwd: dir, encoding: "utf8", timeout: 15000,
      env: { PATH: process.env.PATH },
    });
    assert.equal(result.status, 0, result.stderr || String(result.error));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});