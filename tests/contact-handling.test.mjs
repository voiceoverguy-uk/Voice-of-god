// node --test tests/contact-handling.test.mjs
// Execute the real handlers with an isolated environment and a mocked provider.
// No real credentials, network requests, emails, or persistent files are used.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { buildSync } from "esbuild";

const require = createRequire(import.meta.url);
const compile = (entry) => buildSync({
  entryPoints: [entry],
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  packages: "external",
  logLevel: "silent",
}).outputFiles[0].text;

const compiled = {
  serverless: compile("api/contact.ts"),
  express: compile("server/routes.ts"),
};
const clientRequest = compile("client/src/lib/queryClient.ts");

const submission = {
  name: "Test Client",
  email: "client@example.test",
  phone: "01234567890",
  eventType: "Awards",
  message: "Please check availability for our upcoming awards event and explain the booking process.",
};

async function loadHandler(path, { configured = true, send }) {
  const calls = [];
  let constructors = 0;
  class MockResend {
    constructor() {
      constructors++;
      this.emails = {
        send: async (payload) => {
          calls.push(payload);
          return send(payload);
        },
      };
    }
  }
  const module = { exports: {} };
  runInNewContext(compiled[path], {
    module,
    exports: module.exports,
    require: (name) => name === "resend" ? { Resend: MockResend } : require(name),
    process: { env: configured ? {
      RESEND_API_KEY: "test-only-not-a-real-key",
      CONTACT_FROM_EMAIL: "sender@example.test",
      CONTACT_TO_EMAIL: "recipient@example.test",
    } : {} },
    crypto: { randomUUID },
    console: { log() {}, warn() {}, error() {} },
    fetch: () => { throw new Error("Unexpected network request in contact test"); },
  });

  let handler;
  if (path === "serverless") {
    handler = module.exports.default;
  } else {
    const app = {
      get() {},
      post(route, callback) {
        assert.equal(route, "/api/contact");
        handler = callback;
      },
    };
    await module.exports.registerRoutes({}, app);
  }
  assert.equal(typeof handler, "function");
  return { handler, calls, constructors };
}

async function invoke(handler, body = submission, method = "POST") {
  const response = {
    statusCode: 200,
    body: undefined,
    jsonCalls: 0,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; this.jsonCalls++; return this; },
  };
  await handler({ method, body, headers: {}, ip: "127.0.0.1" }, response);
  assert.equal(response.jsonCalls, 1, "Handler must respond exactly once");
  return response;
}

function assertFailure(response, status) {
  assert.equal(response.statusCode, status);
  assert.equal(response.body.success, undefined);
  assert.equal(response.body.id, undefined);
  assert.equal(typeof response.body.error, "string");
  assert.ok(response.body.error.length > 0);
}

for (const path of Object.keys(compiled)) {
  test(`${path}: provider acceptance preserves successful response and email payload`, async () => {
    const { handler, calls } = await loadHandler(path, {
      send: async () => ({ data: { id: "provider-accepted-id" }, error: null }),
    });
    const response = await invoke(handler);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(Object.keys(response.body).sort(), ["id", "success"]);
    assert.equal(response.body.success, true);
    assert.match(response.body.id, /^[0-9a-f-]{36}$/i);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].from, "sender@example.test");
    assert.equal(calls[0].to, "recipient@example.test");
    assert.equal(calls[0].replyTo, submission.email);
    assert.equal(calls[0].subject, "Voice of God enquiry: Awards");
    assert.ok(calls[0].html.includes(submission.name));
    assert.ok(calls[0].html.includes(submission.message));
  });

  test(`${path}: non-throwing provider error returns 502, not success`, async () => {
    const { handler, calls } = await loadHandler(path, {
      send: async () => ({ data: null, error: { message: "Provider rejected email" } }),
    });
    assertFailure(await invoke(handler), 502);
    assert.equal(calls.length, 1);
  });

  test(`${path}: thrown provider error returns 502, not success`, async () => {
    const { handler, calls } = await loadHandler(path, {
      send: async () => { throw new Error("Provider connection failed"); },
    });
    assertFailure(await invoke(handler), 502);
    assert.equal(calls.length, 1);
  });

  test(`${path}: unconfigured sending returns 503 without calling provider`, async () => {
    const { handler, calls, constructors } = await loadHandler(path, {
      configured: false,
      send: async () => assert.fail("Unconfigured provider must not be called"),
    });
    assertFailure(await invoke(handler), 503);
    assert.equal(calls.length, 0);
    assert.equal(constructors, 0);
  });

  test(`${path}: missing or invalid acceptance ID never reports success`, async () => {
    for (const data of [null, {}, { id: "" }, { id: "   " }, { id: 123 }]) {
      const { handler } = await loadHandler(path, {
        send: async () => ({ data, error: null }),
      });
      assertFailure(await invoke(handler), 502);
    }
  });

  test(`${path}: provider error takes precedence over a returned ID`, async () => {
    const { handler } = await loadHandler(path, {
      send: async () => ({
        data: { id: "not-confirmed" },
        error: { message: "Rejected" },
      }),
    });
    assertFailure(await invoke(handler), 502);
  });

  test(`${path}: invalid submission still returns 400 without sending`, async () => {
    const { handler, calls } = await loadHandler(path, {
      send: async () => assert.fail("Invalid form must not send"),
    });
    const response = await invoke(handler, { ...submission, email: "invalid" });
    assertFailure(response, 400);
    assert.ok(response.body.details);
    assert.equal(calls.length, 0);
  });
}

test("serverless: non-POST requests remain rejected with 405", async () => {
  const { handler, calls } = await loadHandler("serverless", {
    send: async () => assert.fail("GET must not send"),
  });
  assertFailure(await invoke(handler, submission, "GET"), 405);
  assert.equal(calls.length, 0);
});

test("existing frontend request helper rejects both failure statuses and accepts 200", async () => {
  for (const status of [200, 502, 503]) {
    const module = { exports: {} };
    runInNewContext(clientRequest, {
      module,
      exports: module.exports,
      require,
      fetch: async () => new Response(JSON.stringify(
        status === 200 ? { success: true, id: "submission-id" } : { error: "Sending failed" },
      ), { status }),
    });
    const request = module.exports.apiRequest("POST", "/api/contact", submission);
    if (status === 200) assert.equal((await request).status, 200);
    else await assert.rejects(request, new RegExp(`^Error: ${status}:`));
  }
});