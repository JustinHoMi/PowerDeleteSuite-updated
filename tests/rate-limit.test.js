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

function jqXHR(status, headers, body) {
  return {
    status,
    responseText: body || "",
    getResponseHeader(name) {
      return (headers && Object.prototype.hasOwnProperty.call(headers, name))
        ? headers[name]
        : null;
    },
  };
}

const BLOCK_PAGE =
  "<!doctype html><html><head>" +
  "<style>.theme-light,:root{--rem360:22.5rem;--rem320:20rem}</style>" +
  "</head><body><h1>You've been blocked by network security.</h1></body></html>";

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
  rate.consecutiveThrottles = 0;
  rate.successStreak = 0;
  rate.nextSlot = 0;
  rate.penaltyUntil = 0;
  return rate;
}

test("starts with eight-second spacing and unlimited 429 retries", () => {
  const context = makeContext();
  const rate = context.pd.rateLimit;

  assert.equal(rate.intervalMs, 8000);
  assert.equal(rate.minIntervalMs, 8000);
  assert.equal(rate.maxRetries, 0);
  assert.equal(rate.shouldRetry(100), true);
});

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

test("retries an HTML 403 block page automatically", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);

  const result = rate.request({ url: "/search.json" });
  await sleep(5);
  assert.equal(context.calls.length, 1);
  context.calls[0].failHandler(
    jqXHR(403, { "Content-Type": "text/html; charset=UTF-8" }, BLOCK_PAGE),
    "error",
    ""
  );
  await sleep(30);
  assert.equal(
    context.calls.length,
    2,
    "the block page should be retried through the limiter"
  );
  context.calls[1].doneHandler(
    { data: { children: [] } },
    "success",
    jqXHR(200, { "Content-Type": "application/json" })
  );

  assert.deepEqual(await result, { data: { children: [] } });
});

test("stops retrying block pages after maxBlockedRetries", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.maxBlockedRetries = 1;

  const result = rate.request({ url: "/search.json" }).then(
    () => {
      throw new Error("expected the request to fail");
    },
    (error) => error
  );

  await sleep(5);
  context.calls[0].failHandler(
    jqXHR(403, { "Content-Type": "text/html" }, BLOCK_PAGE),
    "error",
    ""
  );
  await sleep(30);
  assert.equal(context.calls.length, 2);
  context.calls[1].failHandler(
    jqXHR(403, { "Content-Type": "text/html" }, BLOCK_PAGE),
    "error",
    ""
  );
  const error = await result;

  assert.equal(context.calls.length, 2);
  assert.equal(error.blocked, true);
  assert.equal(error.jqXHR.status, 403);
});

test("does not retry a JSON 403", async () => {
  const context = makeContext();
  resetRateLimit(context);

  const result = context.pd.rateLimit.request({ url: "/api/del" }).then(
    () => {
      throw new Error("expected the request to fail");
    },
    (error) => error
  );
  await sleep(5);
  context.calls[0].failHandler(
    jqXHR(403, { "Content-Type": "application/json" }, '{"message":"Forbidden"}'),
    "error",
    "Forbidden"
  );
  const error = await result;

  assert.equal(context.calls.length, 1);
  assert.equal(error.blocked, false);
});

test("block-page error summaries omit inline CSS", () => {
  const context = makeContext();

  context.DOMParser = function () {};
  context.DOMParser.prototype.parseFromString = function (html) {
    return { body: { textContent: html.replace(/<[^>]*>/g, " ") } };
  };

  const message = context.pd.helpers.ajaxErrorMessage(
    jqXHR(403, { "Content-Type": "text/html; charset=UTF-8" }, BLOCK_PAGE),
    "error",
    ""
  );

  assert.match(message, /HTTP 403/);
  assert.match(message, /blocked by network security/);
  assert.doesNotMatch(message, /--rem360|theme-light/);
});

test("skipping a blocked section resets sorts and timeframes", () => {
  const context = makeContext();
  context.pd.task = {
    paths: {
      sections: ["search", "submissions"],
      sorts: ["controversial"],
      timeframes: ["day"],
    },
  };

  context.pd.actions.page.skipSection();

  assert.deepEqual(Array.from(context.pd.task.paths.sections), ["submissions"]);
  assert.deepEqual(Array.from(context.pd.task.paths.sorts), [
    "new",
    "hot",
    "top",
    "controversial",
  ]);
  assert.deepEqual(Array.from(context.pd.task.paths.timeframes), [
    "all",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ]);
});

test("a persistent block offers to skip the rest of the section", async () => {
  const context = makeContext();
  const confirmations = [];
  let nextCalls = 0;

  context.pd.task = {
    pageCalls: 0,
    info: { errors: 0 },
    paths: {
      sections: ["search", "submissions"],
      sorts: ["top"],
      timeframes: ["year"],
    },
    config: {},
  };
  context.pd.config = { user: "tester" };
  context.pd.endpoints = { search: "/search.json" };
  context.pd.rateLimit.request = function () {
    return Promise.reject({ blocked: true });
  };
  context.pd.actions.page.next = function () {
    nextCalls++;
  };
  context.confirm = function (message) {
    confirmations.push(message);
    return false;
  };

  context.pd.actions.page.handle();
  await sleep(0);

  assert.equal(confirmations.length, 1);
  assert.match(confirmations[0], /Reddit blocked this search request/);
  assert.match(confirmations[0], /Choose Cancel to skip the rest of search/);
  assert.deepEqual(context.pd.task.paths.sections, ["submissions"]);
  assert.equal(nextCalls, 1);
  assert.equal(context.pd.task.info.errors, 1);
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
  assert.equal(rate.consecutiveThrottles, 1);
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

test("retries Reddit RATELIMIT JSON errors returned with HTTP 200", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.maxRetries = 0;

  const result = rate.request({ url: "/api/editusertext" });
  await sleep(5);
  context.calls[0].doneHandler(
    {
      json: {
        errors: [
          [
            "RATELIMIT",
            "you are doing that too much. try again in 0 minutes.",
            "ratelimit",
          ],
        ],
      },
    },
    "success",
    jqXHR(200)
  );
  await sleep(30);
  assert.equal(context.calls.length, 2);
  context.calls[1].doneHandler({ json: { errors: [] } }, "success", jqXHR(200));

  assert.deepEqual(await result, { json: { errors: [] } });
});

test("parses Reddit's retry hint from RATELIMIT messages", () => {
  const context = makeContext();
  const rate = resetRateLimit(context);

  assert.equal(
    rate.messageDelay("you are doing that too much. try again in 9 minutes."),
    540000
  );
  assert.equal(rate.messageDelay("try again in 30 seconds."), 30000);
  assert.equal(rate.messageDelay("no hint here"), 0);
});

test("keeps retrying 429s when maxRetries is zero", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.maxRetries = 0;

  const result = rate.request({ url: "/api/del" });
  for (let i = 0; i < 3; i++) {
    await sleep(30);
    assert.equal(context.calls.length, i + 1);
    context.calls[i].failHandler(jqXHR(429), "error", "Too Many Requests");
  }
  await sleep(60);
  assert.equal(context.calls.length, 4);
  context.calls[3].doneHandler({ ok: true }, "success", jqXHR(200));

  assert.deepEqual(await result, { ok: true });
});

test("routes edit and delete posts through the throttled retry path", async () => {
  const context = makeContext();
  const rate = resetRateLimit(context);
  rate.maxRetries = 0;
  const item = {
    kind: "t1",
    data: { id: "abc", name: "t1_abc", subreddit: "test" },
  };
  let handled = 0;

  context.setTimeout = function (callback) {
    callback();
    return 0;
  };
  context.pd.performActions = true;
  context.pd.config = { uh: "" };
  context.pd.task = {
    config: { editText: "edited" },
    editedIds: Object.create(null),
    items: [item],
    info: { errors: 0 },
  };
  context.pd.actions.children.handleSingle = function () {
    handled++;
  };

  context.pd.actions.edit(item);
  await sleep(10);
  assert.equal(context.calls.length, 1);
  assert.equal(context.calls[0].options.url, "/api/editusertext");
  context.calls[0].failHandler(jqXHR(429), "error", "Too Many Requests");
  await sleep(30);
  assert.equal(context.calls.length, 2, "edit retry must go through the limiter");
  assert.equal(context.calls[1].options.url, "/api/editusertext");
  context.calls[1].doneHandler({}, "success", jqXHR(200));
  await sleep(5);
  assert.equal(item.pdEdited, true);

  item.pdDeleted = false;
  context.calls.length = 0;
  context.pd.actions.delete(item);
  await sleep(10);
  assert.equal(context.calls.length, 1);
  assert.equal(context.calls[0].options.url, "/api/del");
  context.calls[0].failHandler(jqXHR(429), "error", "Too Many Requests");
  await sleep(30);
  assert.equal(context.calls.length, 2, "delete retry must go through the limiter");
  assert.equal(context.calls[1].options.url, "/api/del");
  context.calls[1].doneHandler({}, "success", jqXHR(200));
  await sleep(5);
  assert.equal(item.pdDeleted, true);
  assert.equal(handled, 2);
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
