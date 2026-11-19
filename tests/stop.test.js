"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { run } = require("./harness");

const SCRIPT = fs.readFileSync(
  path.join(__dirname, "..", "powerdeletesuite.js"),
  "utf8"
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function item(id, body) {
  return {
    kind: "t1",
    data: {
      id: id,
      name: "t1_" + id,
      subreddit: "test",
      body: body,
      permalink: "/r/test/comments/x/" + id + "/",
      score: 1,
      created_utc: 1000,
    },
  };
}

function fakeJQuery(records) {
  function node(key) {
    const obj = {
      length: 0,
      first() {
        return obj;
      },
      find(sub) {
        return node(key + " " + sub);
      },
      html(value) {
        if (value !== undefined) records[key + ".html"] = value;
        return obj;
      },
      text(value) {
        if (value !== undefined) records[key + ".text"] = value;
        return obj;
      },
      prepend(value) {
        records[key + ".prepend"] = (records[key + ".prepend"] || "") + value;
        return obj;
      },
      click(handler) {
        records[key + ".click"] = handler;
        return obj;
      },
      prop() {
        return obj;
      },
      attr() {
        return obj;
      },
      css() {
        return obj;
      },
      addClass() {
        return obj;
      },
      toggle() {
        return obj;
      },
      hide() {
        return obj;
      },
      show() {
        return obj;
      },
      val() {
        return "";
      },
      is() {
        return false;
      },
      get() {
        return [];
      },
      map() {
        return { get: () => [] };
      },
    };
    return obj;
  }

  const $ = function (selector) {
    return node(typeof selector === "string" ? selector : "element");
  };
  $.inArray = (value, list) => list.indexOf(value);
  return $;
}

function makeEnv(stubRequests) {
  const records = {};
  const timers = [];
  const requests = [];
  const ajaxCalls = [];
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
      document: { title: "" },
      setTimeout(callback, delay) {
        timers.push({ callback, delay });
        return timers.length;
      },
      clearTimeout() {},
      Promise,
    },
    "powerdeletesuite.js"
  );

  context.$ = fakeJQuery(records);
  context.$.ajax = function (options) {
    const call = { options };
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
    ajaxCalls.push(call);
    return chain;
  };
  context.pd.performActions = true;
  context.pd.config = { uh: "", user: "tester" };
  context.pd.exportItems = [];
  context.pd.exportIds = [];
  context.pd.ui.status = function () {};
  context.pd.ui.updateDisplay = function () {};
  context.pd.actions.page.next = function () {};
  context.pd.filters = {
    subs: { enabled: false, list: [] },
    score: { enabled: false, gt: true, num: 0 },
    date: { enabled: false, gt: true, num: 0 },
    gilded: false,
    saved: false,
    mod: false,
  };
  if (stubRequests) {
    const request = context.pd.rateLimit.request;
    context.pd.rateLimit.request = function (options) {
      return new Promise((resolve, reject) => {
        requests.push({ options, resolve, reject });
      });
    };
    context.realRequest = request;
  }
  return {
    context,
    records,
    timers,
    requests,
    ajaxCalls,
    runByDelay(delay) {
      const index = timers.findIndex((entry) => entry.delay === delay);
      assert.notEqual(index, -1, "no timer scheduled for " + delay + "ms");
      const entry = timers.splice(index, 1)[0];
      entry.callback();
    },
  };
}

function task(overrides) {
  return Object.assign(
    {
      after: "",
      stopped: false,
      finished: false,
      timers: [],
      editedIds: Object.create(null),
      info: {
        numPages: 1,
        numItems: 2,
        donePages: 1,
        doneItems: 0,
        pageCalls: 0,
        edited: 0,
        deleted: 0,
        errors: 0,
        ignored: 0,
        exported: 0,
        ajaxCalls: 3,
        ignoreReasons: {
          subs: 0,
          gold: 0,
          saved: 0,
          mod: 0,
          score: 0,
          date: 0,
        },
      },
      config: {
        isExporting: true,
        isRemovingPosts: false,
        isRemovingComments: true,
        isEditing: false,
        editText: "edited",
      },
      paths: { sections: ["comments"], sorts: ["new"], timeframes: ["all"] },
      items: [],
    },
    overrides
  );
}

test("stopping prevents a queued request from being sent", async () => {
  const env = makeEnv(false);
  const rate = env.context.pd.rateLimit;

  rate.intervalMs = 60000;
  rate.minIntervalMs = 0;
  rate.maxBackoffMs = 60000;
  rate.nextSlot = Date.now() + 60000;
  env.context.pd.task = { stopped: false };

  const settled = rate.request({ url: "/api/del" }).then(
    () => null,
    (error) => error
  );
  await sleep(5);
  assert.equal(env.ajaxCalls.length, 0, "the request is still waiting for a slot");

  env.context.pd.task.stopped = true;
  rate.cancelPending();

  const error = await settled;
  assert.equal(error && error.stopped, true);
  assert.equal(env.ajaxCalls.length, 0, "stopped runs must not send the request");
});

test("stopping finishes the run and ignores remaining items", () => {
  const env = makeEnv(true);
  const context = env.context;
  context.pd.task = task({ items: [item("a", "alpha body"), item("b", "beta body")] });

  context.pd.actions.stop();

  assert.equal(context.pd.task.stopped, true);
  assert.equal(context.pd.task.finished, true);
  assert.match(
    env.records["#pd__central .complete .summary.html"],
    /Stopped after making 3 calls/
  );

  context.pd.actions.children.handleSingle();
  assert.equal(env.requests.length, 0, "no new actions after stopping");
});

test("an in-flight delete still reaches the downloadable backup", async () => {
  const env = makeEnv(true);
  const context = env.context;
  context.pd.task = task({ items: [item("a", "alpha body"), item("b", "beta body")] });
  context.pd.exportItems = [];
  context.pd.exportIds = [];

  context.pd.actions.children.handleSingle();
  assert.equal(context.pd.task.timers.length, 1, "delete is scheduled");
  env.runByDelay(20000);
  assert.equal(env.requests.length, 1, "the in-flight delete was issued");
  assert.equal(env.requests[0].options.url, "/api/del");

  context.pd.rateLimit.inFlight = 1;
  context.pd.actions.stop();
  assert.equal(context.pd.task.stopped, true);
  assert.equal(
    context.pd.task.finished,
    false,
    "the run waits for the in-flight request"
  );

  env.requests[0].resolve({});
  await sleep(10);

  assert.equal(context.pd.task.info.deleted, 1);
  assert.deepEqual(context.pd.exportIds, ["a"]);
  const backup = context.pd.exportItems.join("");
  assert.match(backup, /alpha body/);
  assert.doesNotMatch(backup, /beta body/, "unprocessed items stay out of the backup");

  context.pd.rateLimit.inFlight = 0;
  env.runByDelay(100);

  assert.equal(context.pd.task.finished, true);
  assert.match(
    env.records["#pd__central .complete .summary.html"],
    /Stopped after making 3 calls/
  );
  assert.match(
    env.records["#pd__central .complete .goodbye.prepend"],
    /Download Exported Items/
  );
  assert.match(
    env.records["#pd__central .complete .goodbye.prepend"],
    /alpha%20body|alpha body/
  );
});
