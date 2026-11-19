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

function item(id, options) {
  const opts = options || {};
  const kind = opts.kind || "t1";
  return {
    kind: kind,
    data: {
      id: id,
      name: kind + "_" + id,
      subreddit: opts.subreddit || "test",
      body: opts.body === undefined ? "hello " + id : opts.body,
      selftext: kind === "t3" ? "self " + id : undefined,
      is_self: kind === "t3",
      permalink: "/r/test/comments/x/" + id + "/",
      score: 1,
      created_utc: 1000,
      saved: !!opts.saved,
      gilded: opts.gilded ? 1 : 0,
      distinguished: opts.distinguished || null,
    },
  };
}

function fakeJQuery(records, checked) {
  const state = checked || {};
  function node(key) {
    const obj = {
      length: 1,
      first() {
        return obj;
      },
      find(sub) {
        return node(key + " " + sub);
      },
      closest(sub) {
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
      append(value) {
        records[key + ".append"] = (records[key + ".append"] || "") + value;
        return obj;
      },
      click(handler) {
        records[key + ".click"] = handler;
        return obj;
      },
      prop(name, value) {
        if (arguments.length > 1) records[key + "." + name] = value;
        return obj;
      },
      attr(name, value) {
        if (value !== undefined) records[key + "." + name] = value;
        return obj;
      },
      css() {
        return obj;
      },
      addClass() {
        return obj;
      },
      removeClass() {
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
      is(selector) {
        return selector === ":checked" ? !!state[key] : false;
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

function makeContext(options) {
  const opts = options || {};
  const records = {};
  const timers = [];
  const requests = [];
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

  context.$ = fakeJQuery(records, opts.checked);
  context.pd.performActions = true;
  context.pd.config = { uh: "uh", user: "tester" };
  context.pd.exportItems = [];
  context.pd.exportIds = [];
  context.pd.ui.status = function (message) {
    records.status = message;
  };
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
  context.pd.rateLimit.request = function (options) {
    requests.push(options);
    return Promise.resolve({});
  };

  const config = Object.assign(
    {
      isAudit: true,
      isExporting: false,
      isRemovingPosts: false,
      isRemovingComments: true,
      isEditing: false,
      editText: "edited",
    },
    opts.config
  );
  context.pd.task = {
    after: "",
    stopped: false,
    finished: false,
    timers: [],
    editedIds: Object.create(null),
    info: {
      numPages: 1,
      numItems: 1,
      donePages: 1,
      doneItems: 0,
      pageCalls: 1,
      edited: 0,
      deleted: 0,
      errors: 0,
      ignored: 0,
      exported: 0,
      ignoreReasons: {
        subs: 0,
        gold: 0,
        saved: 0,
        mod: 0,
        score: 0,
        date: 0,
      },
    },
    config: config,
    paths: { sections: ["comments"], sorts: ["new"], timeframes: ["all"] },
    items: [],
  };

  // A real action must never fire in audit mode; fail loudly if it does.
  context.pd.actions.edit = function () {
    throw new Error("edit called in audit mode");
  };
  context.pd.actions.delete = function () {
    throw new Error("delete called in audit mode");
  };

  return { context, records, timers, requests };
}

function sweep(env, listed) {
  env.context.pd.task.items = listed;
  env.context.pd.actions.children.handleSingle();
}

test("audit reports would-edit and would-delete without touching reddit", () => {
  const env = makeContext({
    config: { isEditing: true, isRemovingComments: true },
  });
  const context = env.context;

  sweep(env, [item("abc")]);

  assert.equal(env.requests.length, 0, "audit must not call the edit/delete API");
  assert.equal(env.timers.length, 0, "audit must not schedule actions");
  assert.equal(context.pd.task.info.edited, 1);
  assert.equal(context.pd.task.info.deleted, 1);
  assert.equal(context.pd.task.info.exported, 1);
  assert.equal(context.pd.exportIds.length, 1);

  const backup = context.pd.exportItems.join("");
  assert.match(backup, /hello abc/);
  assert.match(backup, /edited deleted/);
});

test("audit backs up items even when the backup checkbox is off", () => {
  const env = makeContext({
    config: { isEditing: false, isRemovingComments: true, isExporting: false },
  });
  const context = env.context;

  sweep(env, [item("abc")]);

  assert.equal(context.pd.task.config.isExporting, false);
  assert.equal(context.pd.task.info.deleted, 1);
  assert.equal(context.pd.exportIds[0], "abc", "would-delete item is backed up");
});

test("audit skips no-op edits like a real run and ignores filtered items", () => {
  const env = makeContext({
    config: { isEditing: true, isRemovingComments: false },
  });
  const context = env.context;
  context.pd.filters.saved = true;

  sweep(env, [
    item("same", { body: "edited" }),
    item("deleted", { body: "[deleted]" }),
    item("kept", { saved: true }),
  ]);

  assert.equal(context.pd.task.info.edited, 0, "matching and gone bodies are skipped");
  assert.equal(context.pd.task.info.ignored, 1, "saved item is ignored");
  assert.equal(context.pd.task.info.ignoreReasons.saved, 1);
  assert.equal(env.requests.length, 0);
  assert.equal(context.pd.exportIds.length, 0, "nothing to back up");
});

test("audit counts an item once when a later sweep lists it again", () => {
  const env = makeContext({
    config: { isEditing: true, isRemovingComments: false },
  });
  const context = env.context;

  sweep(env, [item("abc")]);
  sweep(env, [item("abc")]);

  assert.equal(context.pd.task.info.edited, 1, "edit intent is deduplicated by id");
  assert.equal(context.pd.task.info.exported, 1);
});

test("audit counts posts and comments it would delete", () => {
  const env = makeContext({
    config: {
      isEditing: false,
      isRemovingPosts: true,
      isRemovingComments: false,
    },
  });
  const context = env.context;

  sweep(env, [item("post1", { kind: "t3" })]);
  assert.equal(context.pd.task.info.deleted, 1);
  assert.equal(context.pd.task.info.edited, 0);
  assert.equal(context.pd.exportIds[0], "post1");

  sweep(env, [item("comment1", { kind: "t1" })]);
  assert.equal(context.pd.task.info.deleted, 1, "comments are not deleted");
  assert.equal(context.pd.exportIds.length, 1);
});

test("audit accepts runs without a modhash or edit text", () => {
  const env = makeContext({
    config: { isEditing: true, isRemovingComments: true, editText: "" },
  });
  const context = env.context;
  context.pd.config.uh = "";

  const validation = context.pd.helpers.validate();
  assert.equal(validation.valid, true, validation.reason);
});

test("audit asks for at least one action to report on", () => {
  const env = makeContext({
    config: {
      isRemovingPosts: false,
      isRemovingComments: false,
      isEditing: false,
    },
  });
  const validation = env.context.pd.helpers.validate();
  assert.equal(validation.valid, false);
  assert.match(validation.reason, /at least one/i);
});

test("audit completion shows counts and an audit backup link", () => {
  const env = makeContext({ config: { isEditing: true, isRemovingComments: true } });
  const context = env.context;

  context.pd.filters.saved = true;
  sweep(env, [item("abc"), item("def", { saved: true })]);
  context.pd.ui.done();

  const summary = env.records["#pd__central .complete .summary.html"];
  assert.match(summary, /Audit complete/);
  assert.match(summary, /no posts or comments were edited or deleted/i);
  assert.match(summary, /<b>1<\/b> would be edited/);
  assert.match(summary, /<b>1<\/b> would be deleted/);
  assert.match(summary, /<b>1<\/b> were ignored/);

  const goodbye = env.records["#pd__central .complete .goodbye.prepend"];
  assert.match(goodbye, /Download Audit Backup/);
  assert.match(goodbye, /hello%20abc|hello abc/);
});

test("createProcessStream reads the audit checkbox and labels the counters", () => {
  const env = makeContext({
    checked: {
      "#pd__audit": true,
      "#pd__export": true,
      "#pd__comments": true,
    },
    config: { isEditing: true, isRemovingComments: true },
  });
  const context = env.context;

  context.pd.actions.children.handleGroup = function () {};
  context.pd.filters = {
    subs: { enabled: false, list: [] },
    score: { enabled: false, gt: true, num: 0 },
    date: { enabled: false, gt: true, num: 0 },
    gilded: false,
    saved: false,
    mod: false,
  };
  context.pd.setup.createProcessStream();

  assert.equal(context.pd.task.config.isAudit, true);
  assert.match(env.records["#pd__audit-notice.text"], /Audit mode/);
  assert.equal(
    env.records[".progress__byline .edited .caption.text"],
    "would be edited"
  );
  assert.equal(
    env.records[".progress__byline .deleted .caption.text"],
    "would be deleted"
  );

  assert.equal(context.pd.helpers.validate().valid, true);
});
