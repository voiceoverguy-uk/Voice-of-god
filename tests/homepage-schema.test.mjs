// Offline: node --test tests/homepage-schema.test.mjs
// Provider check: VERIFY_PROVIDER_THUMBNAIL=1 node --test tests/homepage-schema.test.mjs
// Built HTML: SCHEMA_HTML_PATH=dist/public/index.html node --test tests/homepage-schema.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const html = readFileSync(
  process.env.SCHEMA_HTML_PATH || new URL("../client/index.html", import.meta.url),
  "utf8",
);
const documents = [...html.matchAll(
  /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
)].map((match) => JSON.parse(match[1]));
assert.ok(documents.length > 0, "Homepage must expose parseable JSON-LD");

function* objects(value) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value)) yield value;
  for (const child of Object.values(value)) yield* objects(child);
}

const nodes = [...objects(documents)];
const hasType = (node, type) => [node["@type"]].flat().includes(type);
const videos = nodes.filter((node) => hasType(node, "VideoObject"));
const base = "https://voiceofgod.co.uk/";

// Dates are provider-evidenced upload timestamps, not event dates or inferred times.
const expected = [
  {
    id: "video-masked-singer",
    youtube: "e0vZ9cxdilo",
    uploadDate: "2024-02-27T06:11:09-08:00",
    thumbnail: "maxresdefault.jpg",
    name: "The Masked Singer — Voice of God by Guy Harris",
    description: "Guy Harris providing Voice of God announcements for The Masked Singer live show at Butlins.",
  },
  {
    id: "video-takeaway",
    youtube: "W99pMUr6G8Q",
    uploadDate: "2014-08-16T07:43:13-07:00",
    thumbnail: "hqdefault.jpg",
    name: "Ant & Dec's Saturday Night Takeaway — Arena Tour Voice of God",
    description: "Guy Harris as Voice of God announcer for Ant & Dec's Saturday Night Takeaway live arena tour.",
  },
  {
    id: "video-bgt",
    youtube: "4yTnVRDXZfQ",
    uploadDate: "2025-03-19T01:27:41-07:00",
    thumbnail: "maxresdefault.jpg",
    name: "Britain's Got Talent Competition Voiceover — Guy Harris",
    description: "Guy Harris providing competition spot voiceover for Britain's Got Talent 2025.",
  },
  {
    id: "video-tv-choice",
    youtube: "4Le6P6sk7cs",
    uploadDate: "2026-02-09T06:40:41-08:00",
    thumbnail: "maxresdefault.jpg",
    name: "TV Choice Awards — Voice of God by Guy Harris",
    description: "Guy Harris as Voice of God at the annual TV Choice Awards in London.",
  },
];

test("exactly four unique VideoObjects across all JSON-LD documents", () => {
  assert.equal(videos.length, 4);
  assert.equal(new Set(videos.map((node) => node["@id"])).size, 4);
  assert.equal(new Set(videos.map((node) => node.embedUrl)).size, 4);
  assert.deepEqual(
    videos.map((node) => node["@id"]).sort(),
    expected.map((item) => `${base}#${item.id}`).sort(),
  );
});

for (const item of expected) {
  test(`${item.id}: exact verified metadata and preserved remaining fields`, () => {
    assert.deepEqual(videos.find((node) => node["@id"] === `${base}#${item.id}`), {
      "@type": "VideoObject",
      "@id": `${base}#${item.id}`,
      name: item.name,
      description: item.description,
      thumbnailUrl: `https://img.youtube.com/vi/${item.youtube}/${item.thumbnail}`,
      embedUrl: `https://www.youtube.com/embed/${item.youtube}`,
      url: `https://www.youtube.com/watch?v=${item.youtube}`,
      uploadDate: item.uploadDate,
      inLanguage: "en-GB",
      publisher: { "@id": `${base}#person` },
    });
  });
}

test("WebPage still references all four videos without duplicates", () => {
  const page = nodes.find((node) => hasType(node, "WebPage"));
  assert.ok(page);
  assert.deepEqual(
    page.video.map((reference) => reference["@id"]).sort(),
    expected.map((item) => `${base}#${item.id}`).sort(),
  );
});

test("unmatched FAQPage and its references are absent", () => {
  assert.equal(nodes.some((node) => hasType(node, "FAQPage")), false);
  assert.equal(nodes.some((node) => node["@id"] === `${base}#faq`), false);
});

test("no static AggregateRating or Review schema claims", () => {
  assert.equal(nodes.some(node => hasType(node, "AggregateRating") || hasType(node, "Review")), false);
  assert.equal(nodes.some(node => "aggregateRating" in node), false);
});

test("Takeaway schema thumbnail returns a real provider JPEG", {
  skip: process.env.VERIFY_PROVIDER_THUMBNAIL !== "1"
    ? "Opt-in network check: set VERIFY_PROVIDER_THUMBNAIL=1"
    : false,
  timeout: 20000,
}, async () => {
  const video = videos.find((node) => node["@id"] === `${base}#video-takeaway`);
  const response = await fetch(video.thumbnailUrl, {
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /^image\/jpeg\b/i);
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert.ok(bytes.length > 100, "Thumbnail must not be empty");
  assert.deepEqual([...bytes.slice(0, 3)], [0xff, 0xd8, 0xff]);
});