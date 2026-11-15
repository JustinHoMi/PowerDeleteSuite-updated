"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { TextDecoder } = require("node:util");
const { run } = require("./harness");

const ROOT = path.join(__dirname, "..");
const LOADER = fs.readFileSync(path.join(ROOT, "bookmarklet.js"), "utf8");
const SCRIPT = fs.readFileSync(path.join(ROOT, "powerdeletesuite.js"));
const SCRIPT_TEXT = SCRIPT.toString("utf8");
const SCRIPT_HASH = crypto.createHash("sha256").update(SCRIPT).digest("hex");

function loaderWithHash(hash) {
  return LOADER.replace(
    /var SCRIPT_SHA256 =\s*"[0-9a-f]{64}"/,
    'var SCRIPT_SHA256 =\n    "' + hash + '"'
  );
}

async function waitFor(predicate, label) {
  const deadline = Date.now() + 1000;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error("timed out waiting for " + label);
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function makeEnvironment(options) {
  const opts = options || {};
  const alerts = [];
  const calls = { fetch: [], init: 0 };
  const existing = opts.existing || null;
  const nodes = existing ? [existing] : [];
  const head = {
    children: nodes,
    appendChild(node) {
      node.parentNode = this;
      this.children.push(node);
    },
    removeChild(node) {
      node.parentNode = null;
      const index = this.children.indexOf(node);
      if (index !== -1) this.children.splice(index, 1);
    },
  };
  if (existing) existing.parentNode = head;

  const document = {
    location: {
      hostname: "old.reddit.com",
      href: "https://old.reddit.com/u/me/overview",
    },
    head,
    createElement(tagName) {
      return {
        tagName,
        id: "",
        textContent: "",
        attributes: {},
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
        getAttribute(name) {
          return this.attributes[name];
        },
      };
    },
    getElementById(id) {
      if (id === "pd-script" && existing) return existing;
      return null;
    },
  };

  const fetch = async (url) => {
    calls.fetch.push(url);
    if (opts.fetchError) throw new Error("network");
    if (opts.responseOk === false) {
      return { ok: false, status: opts.status || 500 };
    }
    const bytes = opts.bytes || SCRIPT;
    return {
      ok: true,
      status: 200,
      async arrayBuffer() {
        return Uint8Array.from(bytes).buffer;
      },
    };
  };

  const context = run(
    opts.source || loaderWithHash(SCRIPT_HASH),
    {
      document,
      fetch,
      crypto: opts.noSubtle || opts.noCrypto ? undefined : crypto.webcrypto,
      TextDecoder,
      Uint8Array,
      alert(message) {
        alerts.push(message);
      },
      confirm() {
        return false;
      },
      pd: opts.pd,
    },
    "bookmarklet.js"
  );
  context.document = document;
  context.calls = calls;
  context.alerts = alerts;
  return context;
}

function makeExisting(hash, onInit) {
  return {
    id: "pd-script",
    attributes: { "data-pd-hash": hash },
    getAttribute(name) {
      return this.attributes[name];
    },
    onInit,
  };
}

test("executes the exact bytes that were hashed", async () => {
  const env = makeEnvironment({});
  await waitFor(() => env.document.head.children.length === 1, "script injection");
  const script = env.document.head.children[0];
  const pinned = LOADER.match(/var PINNED_REF = "([0-9a-f]{40})"/)[1];
  assert.equal(script.tagName, "script");
  assert.equal(script.id, "pd-script");
  assert.equal(script.getAttribute("data-pd-hash"), SCRIPT_HASH);
  assert.equal(script.textContent, SCRIPT_TEXT);
  assert.equal(
    env.calls.fetch[0],
    "https://raw.githubusercontent.com/JustinHoMi/PowerDeleteSuite-updated/" +
      pinned +
      "/powerdeletesuite.js"
  );
  assert.deepEqual(env.alerts, []);
});

test("rejects a single-byte mismatch without executing", async () => {
  const tampered = Buffer.from(SCRIPT);
  tampered[0] ^= 0x01;
  const env = makeEnvironment({ bytes: tampered });
  await waitFor(() => env.alerts.length === 1, "integrity alert");
  assert.equal(
    env.alerts[0],
    "PowerDeleteSuite integrity check failed; not executing."
  );
  assert.equal(env.document.head.children.length, 0);
});

test("requires crypto.subtle before executing", async () => {
  const env = makeEnvironment({ noCrypto: true });
  await waitFor(() => env.alerts.length === 1, "crypto alert");
  assert.equal(
    env.alerts[0],
    "PowerDeleteSuite cannot verify its own integrity in this browser."
  );
  assert.equal(env.document.head.children.length, 0);
});

test("rejects an unsuccessful HTTP response", async () => {
  const env = makeEnvironment({ responseOk: false, status: 503 });
  await waitFor(() => env.alerts.length === 1, "HTTP alert");
  assert.equal(
    env.alerts[0],
    "Error retrieving PowerDeleteSuite (HTTP 503)"
  );
  assert.equal(env.document.head.children.length, 0);
});

test("second click reuses a matching script node", async () => {
  let initCalls = 0;
  const existing = makeExisting(SCRIPT_HASH);
  const env = makeEnvironment({
    existing,
    pd: {
      init() {
        initCalls += 1;
      },
    },
  });
  await waitFor(() => initCalls === 1, "pd.init");
  assert.equal(env.document.head.children.length, 1);
  assert.equal(env.document.head.children[0], existing);
});

test("different pinned hash re-injects and does not call the old init", async () => {
  let initCalls = 0;
  const existing = makeExisting("old-hash");
  const env = makeEnvironment({
    existing,
    pd: {
      init() {
        initCalls += 1;
      },
    },
  });
  await waitFor(
    () =>
      env.document.head.children.length === 1 &&
      env.document.head.children[0] !== existing,
    "replacement"
  );
  assert.equal(initCalls, 0);
  assert.notEqual(env.document.head.children[0], existing);
  assert.equal(
    env.document.head.children[0].getAttribute("data-pd-hash"),
    SCRIPT_HASH
  );
});

test("checked-in pin matches the checked-in script bytes", () => {
  const source = fs.readFileSync(path.join(ROOT, "bookmarklet.js"), "utf8");
  const ref = source.match(/var PINNED_REF = "([0-9a-f]{40})"/);
  const hash = source.match(/var SCRIPT_SHA256 =\s*"([0-9a-f]{64})"/);
  assert.ok(ref, "PINNED_REF is not a 40-character commit SHA");
  assert.ok(hash, "SCRIPT_SHA256 is not a lowercase SHA-256");
  assert.equal(hash[1], SCRIPT_HASH);
});
