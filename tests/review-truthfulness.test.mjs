// Isolated real backend handlers and client components; no Google/email requests.
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { buildSync } from "esbuild";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const compile = path => buildSync({
  entryPoints: [path], bundle: true, write: false, platform: "node",
  format: "cjs", packages: "external", jsx: "automatic",
}).outputFiles[0].text;
const compiled = {
  serverless: compile("api/reviews.ts"),
  express: compile("server/routes.ts"),
  client: compile("client/src/components/google-reviews.tsx"),
};
const ttl = 24 * 60 * 60 * 1000;
const initialTime = 1800000000000;
const valid = { status: "OK", result: { rating: 4.7, user_ratings_total: 137 } };

async function backend(kind, { configured = true } = {}) {
  let now = initialTime;
  let calls = 0;
  let reply = async () => ({ ok: true, json: async () => valid });
  const module = { exports: {} };
  runInNewContext(compiled[kind], {
    module, exports: module.exports, require, AbortSignal,
    Date: class extends Date { static now() { return now; } },
    process: { env: configured ? { GOOGLE_PLACES_API_KEY: "fictional-test-key" } : {} },
    fetch: async () => { calls++; return reply(); },
  });
  let handler = module.exports.default;
  if (kind === "express") {
    await module.exports.registerRoutes({}, {
      get(path, callback) { if (path === "/api/reviews") handler = callback; },
      post() {},
    });
  }
  return {
    advance(ms) { now += ms; },
    reply(fn) { reply = fn; },
    calls: () => calls,
    async invoke(method = "GET") {
      const res = {
        statusCode: 200, headers: {}, body: null,
        status(code) { this.statusCode = code; return this; },
        setHeader(key, value) { this.headers[key] = value; },
        json(value) { this.body = JSON.parse(JSON.stringify(value)); return this; },
      };
      await handler({ method }, res);
      return res;
    },
  };
}

for (const kind of ["serverless", "express"]) {
  test(`${kind} reviews: valid Google data is timestamped and cached only within TTL`, async () => {
    const app = await backend(kind);
    const res = await app.invoke();
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["Cache-Control"], "no-store");
    assert.deepEqual(res.body, { rating: 4.7, reviewCount: 137, fetchedAt: initialTime });
    app.advance(ttl - 1);
    assert.deepEqual((await app.invoke()).body, res.body);
    assert.equal(app.calls(), 1);
    app.advance(1);
    app.reply(async () => ({ ok: true, json: async () => ({
      status: "OK", result: { rating: 4.8, user_ratings_total: 138 },
    }) }));
    assert.deepEqual((await app.invoke()).body, {
      rating: 4.8, reviewCount: 138, fetchedAt: initialTime + ttl,
    });
    assert.equal(app.calls(), 2);
  });

  test(`${kind} reviews: missing/malformed numbers or provider status never become claims`, async () => {
    for (const payload of [
      null, {}, { status: "OK" }, { status: "OK", result: {} },
      { result: valid.result }, { status: "REQUEST_DENIED", result: valid.result },
      ...[undefined, null, "5", NaN, Infinity, 0, 5.1].map(rating => ({
        status: "OK", result: { rating, user_ratings_total: 137 },
      })),
      ...[undefined, null, "137", NaN, Infinity, -1, 2.5, 1e20].map(count => ({
        status: "OK", result: { rating: 4.7, user_ratings_total: count },
      })),
    ]) {
      const app = await backend(kind);
      app.reply(async () => ({ ok: true, json: async () => payload }));
      assert.deepEqual((await app.invoke()).body, { available: false });
      // Failures aren't cached as a fresh success; recovery is possible immediately.
      app.reply(async () => ({ ok: true, json: async () => valid }));
      assert.equal((await app.invoke()).body.reviewCount, 137);
    }
  });

  test(`${kind} reviews: unconfigured, HTTP, JSON and network failures have no numbers`, async () => {
    const unconfigured = await backend(kind, { configured: false });
    assert.deepEqual((await unconfigured.invoke()).body, { available: false });
    assert.equal(unconfigured.calls(), 0);
    for (const reply of [
      async () => ({ ok: false, json: async () => valid }),
      async () => ({ ok: true, json: async () => { throw new Error("bad JSON"); } }),
      async () => { throw new Error("network failure or timeout"); },
    ]) {
      const app = await backend(kind);
      app.reply(reply);
      assert.deepEqual((await app.invoke()).body, { available: false });
    }
  });

  test(`${kind} reviews: expired cache is hidden on refresh failure, not relabelled fresh`, async () => {
    const app = await backend(kind);
    await app.invoke();
    app.advance(ttl);
    app.reply(async () => { throw new Error("offline"); });
    assert.deepEqual((await app.invoke()).body, { available: false });
  });
}

test("serverless reviews still reject non-GET requests", async () => {
  const app = await backend("serverless");
  assert.equal((await app.invoke("POST")).statusCode, 405);
  assert.equal(app.calls(), 0);
});

function renderClient(data, isError = false) {
  const module = { exports: {} };
  runInNewContext(compiled.client, {
    module, exports: module.exports,
    Date: class extends Date { static now() { return initialTime; } },
    require: name => name === "@tanstack/react-query"
      ? { useQuery: () => ({ data, isError }) } : require(name),
  });
  return {
    summary: renderToStaticMarkup(React.createElement(module.exports.GoogleReviewSummary)),
    stat: renderToStaticMarkup(React.createElement(module.exports.GoogleRatingValue)),
  };
}

test("client displays validated fresh rating/count in both numeric locations", () => {
  const html = renderClient({ rating: 4.7, reviewCount: 137, fetchedAt: initialTime });
  assert.match(html.summary, /Rated 4\.7 on Google · 137 reviews/);
  assert.match(html.summary, /Google reviews for Guy Harris \/ VoiceoverGuy, shared here\./);
  assert.match(html.summary, /width:70/); // partial final star, not a fixed five-star claim
  assert.match(html.stat, /^4\.7<span/);
  assert.match(html.stat, /Guy \/ VoiceoverGuy/);
});

test("client loading, unavailable, malformed, expired, future and error states hide numeric claims", () => {
  const fresh = { rating: 4.7, reviewCount: 137, fetchedAt: initialTime };
  for (const [data, error] of [
    [undefined], [{ available: false }], [{}], [{ ...fresh, fetchedAt: undefined }],
    [{ ...fresh, fetchedAt: initialTime - ttl }], [{ ...fresh, fetchedAt: initialTime + 1 }],
    [{ ...fresh, rating: 6 }], [{ ...fresh, reviewCount: "137" }], [fresh, true],
  ]) {
    const html = renderClient(data, error);
    assert.match(html.summary, />Google Reviews</);
    assert.doesNotMatch(html.summary, /Rated |Happy Clients/);
    assert.match(html.summary, /invisible/);
    assert.match(html.stat, /^—<span/);
  }
});

test("both homepage review claims use validated components, not numeric fallbacks", () => {
  const home = readFileSync("client/src/pages/home.tsx", "utf8");
  assert.match(home, /value: <GoogleRatingValue \/>/);
  assert.match(home, /<GoogleReviewSummary \/>/);
  assert.doesNotMatch(home, /reviewCount\s*\?\?|rating\s*\?\?|value: "5\.0"/);
});