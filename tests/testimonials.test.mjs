import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("homepage includes Colin Thompson's supplied Clever Duck testimonial verbatim", () => {
  const source = readFileSync("client/src/pages/home.tsx", "utf8");
  assert.match(source, /quote: "We have used Guy on our awards ceremony for many years, he has been superb everytime, always prompt, professional and ready to help\. Would highly recommend\."/);
  assert.match(source, /name: "Colin Thompson",\s*title: "Clever Duck Media Ltd"/);
});
