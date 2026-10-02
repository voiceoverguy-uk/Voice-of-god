// Build first: npm run build && node --test tests/*.test.mjs
// Real Express development/production HTTP tests; Vercel config contract checks.
// Child servers have no provider credentials. Only invalid contact data is sent.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

const config = JSON.parse(readFileSync("vercel.json", "utf8"));
const mediaFile = readdirSync("client/public", { recursive: true })
  .find(file => /\.(mp3|mp4|webp|jpg)$/i.test(file));
assert.ok(mediaFile, "A real media fixture must exist");
const mediaPath = "/" + mediaFile.split("/").map(encodeURIComponent).join("/");

async function startServer(mode, t) {
  const reservation = createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, mode === "production"
    ? ["dist/index.cjs"] : ["--import", "tsx", "server/index.ts"], {
    env: { PATH: process.env.PATH, HOME: process.env.HOME,
      NODE_ENV: mode, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", data => { logs += data; });
  child.stderr.on("data", data => { logs += data; });
  t.after(async () => {
    if (child.exitCode !== null) return;
    const exited = once(child, "exit");
    child.kill("SIGTERM");
    const timer = setTimeout(() => child.kill("SIGKILL"), 3000);
    await exited;
    clearTimeout(timer);
  });
  const base = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (child.exitCode !== null) assert.fail(`Server exited: ${logs}`);
    if (logs.includes("serving on port")) return base;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.fail(`Server did not start: ${logs}`);
}

for (const mode of ["development", "production"]) {
  test(`${mode}: real HTTP routing`, { timeout: 45000 }, async t => {
    const base = await startServer(mode, t);
    const get = (path, options = {}) => fetch(base + path, {
      redirect: "manual", ...options,
    });
    await t.test("homepage and query strings remain 200", async () => {
      for (const path of ["/", "/?utm_source=routing-test"]) {
        const res = await get(path);
        assert.equal(res.status, 200);
        assert.match(await res.text(), /id="root"/);
      }
    });
    await t.test("deliberate legacy redirects remain 301", async () => {
      for (const path of ["/guy-harris", "/guy-harris/", "/about", "/contact/",
        "/wp-content/old-image.jpg", "/wp-includes/old.js", "/?page_id=42"]) {
        const res = await get(path);
        assert.equal(res.status, 301, path);
        assert.equal(res.headers.get("location"), "/");
      }
    });
    await t.test("unknown pages, files and APIs are 404, never homepage HTML", async () => {
      for (const path of ["/unknown-routing-test", "/unknown-routing-test/",
        "/nested/missing/page", "/images/nonexistent-routing-test.jpg",
        "/nonexistent-routing-test.pdf", "/assets/nonexistent-routing-test.js",
        "/api/nonexistent-routing-test", "/api", "/robots.txt/missing"]) {
        const res = await get(path);
        assert.equal(res.status, 404, path);
        assert.doesNotMatch(await res.text(), /id="root"|<html/i, path);
      }
      assert.equal((await get("/missing-head-test", { method: "HEAD" })).status, 404);
    });
    await t.test("robots, sitemap and real media still served", async () => {
      for (const [path, content] of [
        ["/robots.txt", /User-agent:/i], ["/sitemap.xml", /<urlset/],
      ]) {
        const res = await get(path);
        assert.equal(res.status, 200);
        assert.match(await res.text(), content);
      }
      const media = await get(mediaPath);
      assert.equal(media.status, 200);
      assert.match(media.headers.get("content-type"), /^(image|audio|video)\//);
      assert.ok((await media.arrayBuffer()).byteLength > 100);
      const audio = mode === "production"
        ? "/assets/" + encodeURIComponent(readdirSync("dist/public/assets").find(file => file.endsWith(".mp3")))
        : "/@fs/" + process.cwd() + "/attached_assets/" +
          encodeURIComponent(readdirSync("attached_assets").find(file => file.endsWith(".mp3")));
      const playback = await get(audio, { headers: { Range: "bytes=0-99" } });
      assert.equal(playback.status, 206, "Audio range requests support playback/seeking");
      assert.match(playback.headers.get("content-type"), /^audio\//);
      assert.equal((await playback.arrayBuffer()).byteLength, 100);
      if (mode === "development") {
        const module = await get("/src/main.tsx");
        assert.equal(module.status, 200, "Vite must still serve client modules");
        assert.match(module.headers.get("content-type"), /javascript/);
      }
    });
    await t.test("real API handlers still receive requests without sending email", async () => {
      const reviews = await get("/api/reviews");
      assert.equal(reviews.status, 200);
      assert.deepEqual(await reviews.json(), { available: false });
      const invalid = await get("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
      });
      assert.equal(invalid.status, 400);
      assert.equal((await invalid.json()).error, "Invalid form data");
    });
  });
}

test("Vercel uses native filesystem/API routing and native missing-file 404s", () => {
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, "dist/public");
  assert.equal(config.rewrites, undefined, "No SPA rewrite may mask missing URLs");
  assert.equal(config.routes, undefined, "No alternate catch-all may mask missing URLs");
  for (const path of ["index.html", "robots.txt", "sitemap.xml", mediaFile]) {
    assert.ok(existsSync(`dist/public/${path}`), path);
  }
  for (const path of ["contact", "reviews"]) assert.ok(existsSync(`api/${path}.ts`));
  for (const source of ["/guy-harris", "/guy-harris/", "/about", "/contact/",
    "/wp-content/:path*", "/wp-includes/:path*", "/:path*.php"]) {
    assert.deepEqual(config.redirects.find(rule => rule.source === source),
      { source, destination: "/", statusCode: 301 });
  }
});

test("existing client Not Found fallback and component remain available", () => {
  const app = readFileSync("client/src/App.tsx", "utf8");
  assert.match(app, /<Route path="\/" component=\{Home\} \/>[\s\S]*<Route component=\{NotFound\} \/>/);
  const code = buildSync({
    entryPoints: ["client/src/pages/not-found.tsx"], bundle: true, write: false,
    platform: "node", format: "cjs", packages: "external", jsx: "automatic",
  }).outputFiles[0].text;
  const module = { exports: {} };
  runInNewContext(code, { module, exports: module.exports,
    require: createRequire(import.meta.url) });
  const html = renderToStaticMarkup(React.createElement(module.exports.default));
  assert.match(html, /404 Page Not Found/);
});