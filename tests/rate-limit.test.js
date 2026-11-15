"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { run } = require("./harness");

const ROOT = path.join(__dirname, "..");
const SCRIPT = fs.readFileSync(path.join(ROOT, "powerdeletesuite.js"), "utf8");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jqXHR(status, headers) {
  return {
    status,
    getResponseHeader(name) {
      return (headers && Object.prototype.hasOwnProperty.call(headers, name))
        ? headers[name]
        : null;
    },
  };
}

function makeContext() {
  const calls = [];
  const context = run(
    SCRIPT,
    {
      bookmarkver: "1.4",
      pd_processing: true,
      localStorage: {
        getItem() {
          return null;
        },
        setItem() {},
        removeItem() {},
      },
      confirm() {
        return false;
      },
      console,
      setTimeout,
      clearTimeout,
      Promise,
    },
    "powerdeletesuite.js"
  );

  context.$ = function () {
    return { length: 0 };
  };
  context.$.ajax = function (options) {
    const call = { options, doneHandler: null, failHandler: null };
    const chain = {
      done(handler) {
        call.doneHandler = handler;
        return chain;
      },
      fail(handler) {
        call.failHandler = handler;
        return chain;
      },
    };
    calls.push(call);
    return chain;
  };
  context.pd.ui.status = function () {};
  context.calls = calls;
  return context;
}

function resetRateLimit(context) {
  const rate = context.pd.rateLimit;
  rate.minIntervalMs = 0;
  rate.maxIntervalMs = 60000;
  rate.intervalMs = 0;
  rate.minBackoffMs = 0;
  rate.baseBackoffMs = 5;
  rate.maxBackoffMs = 1000;
  rate.jitterRatio = 0;
  rate.maxRetries = 2;
  rate.lowRemaining = 5;
  rate.recoverAfter = 5;
  rate.consecutive429 = 0;
  rate.successStreak = 0;
  rate.nextSlot = 0;
  rate.penaltyUntil = 0;
  return rate;
}

test("retries a 429 automatically and resolves with the eventual response", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);

  const result = rate.request({ url: "/api/del" });
  await sleep(5);
  assert.equal(context.calls.length, 1);
  context.calls[0].failHandler(
    jqXHR(429, { "Retry-After": "0.005" }),
    "error",
    "Too Many Requests"
  );
  await sleep(30);
  assert.equal(context.calls.length, 2);
  context.calls[1].doneHandler({ ok: true }, "success", jqXHR(200));

  assert.deepEqual(await result, { ok: true });
});

test("honors Retry-After and X-Ratelimit-Reset headers", () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.minBackoffMs = 1000;
  rate.maxBackoffMs = 100000;

  assert.equal(
    rate.retryDelay(jqXHR(429, { "Retry-After": "7" }), 1),
    7000
  );
  assert.equal(
    rate.retryDelay(jqXHR(429, { "X-Ratelimit-Reset": "42" }), 1),
    42000
  );
  assert.equal(
    rate.retryDelay(jqXHR(429, { "Retry-After": "2.5" }), 1),
    2500
  );
  assert.equal(
    rate.retryDelay(jqXHR(429, { "Retry-After": "Wed, 21 Oct 2015 07:28:00 GMT" }), 1),
    1000,
    "past Retry-After dates fall back to the minimum backoff"
  );
});

test("spaces requests by the current interval", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.intervalMs = 40;

  const started = Date.now();
  await rate.acquire();
  await rate.acquire();
  assert.ok(
    Date.now() - started >= 30,
    "second slot should wait for the throttle interval"
  );
});

test("grows the backoff and stops retrying at maxRetries", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.maxRetries = 1;
  rate.intervalMs = 10;

  const result = rate.request({ url: "/api/editusertext" }).then(
    () => {
      throw new Error("expected the request to fail");
    },
    (error) => error
  );

  await sleep(5);
  context.calls[0].failHandler(jqXHR(429), "error", "Too Many Requests");
  await sleep(30);
  context.calls[1].failHandler(jqXHR(429), "error", "Too Many Requests");
  const error = await result;

  assert.equal(context.calls.length, 2);
  assert.equal(error.jqXHR.status, 429);
  assert.equal(rate.consecutive429, 1);
  assert.equal(rate.intervalMs, 20);
});

test("does not retry non-429 failures", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);

  const result = rate.request({ url: "/api/del" }).then(
    () => {
      throw new Error("expected the request to fail");
    },
    (error) => error
  );

  await sleep(5);
  context.calls[0].failHandler(jqXHR(500), "error", "Server Error");
  const error = await result;

  assert.equal(context.calls.length, 1);
  assert.equal(error.jqXHR.status, 500);
  assert.equal(error.textStatus, "error");
  assert.equal(error.errorThrown, "Server Error");
});

test("pauses proactively when the rate-limit window is exhausted", () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.intervalMs = 100;
  const before = Date.now();

  rate.noteSuccess(
    jqXHR(200, {
      "X-Ratelimit-Remaining": "0",
      "X-Ratelimit-Reset": "2",
    })
  );

  assert.ok(
    rate.penaltyUntil >= before + 2000,
    "penalty should cover the advertised reset window"
  );
  assert.equal(rate.intervalMs, 200, "interval should increase after exhaustion");
});
