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

function item(id) {
  return {
    kind: "t1",
    data: { id: id, name: "t1_" + id, subreddit: "test", body: "hello" },
  };
}

function makeContext() {
  const edits = [];
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
      setTimeout(callback) {
        callback();
        return 0;
      },
      clearTimeout,
      Promise,
    },
    "powerdeletesuite.js"
  );

  context.$ = function () {
    return { length: 0 };
  };
  context.pd.performActions = true;
  context.pd.config = { uh: "" };
  context.pd.ui.updateDisplay = function () {};
  context.pd.ui.status = function () {};
  context.pd.rateLimit.request = function (options) {
    edits.push(options);
    return Promise.resolve({});
  };
  context.pd.filters = {
    subs: { enabled: false, list: [] },
    score: { enabled: false, gt: true, num: 0 },
    date: { enabled: false, gt: true, num: 0 },
    gilded: false,
    saved: false,
    mod: false,
  };
  context.pd.task = {
    after: "",
    editedIds: Object.create(null),
    config: {
      isEditing: true,
      isRemovingPosts: false,
      isRemovingComments: false,
      isExporting: false,
      editText: "edited",
    },
    paths: { sections: ["comments"], sorts: ["new"], timeframes: ["all"] },
    items: [],
    info: {
      doneItems: 0,
      edited: 0,
      deleted: 0,
      ignored: 0,
      errors: 0,
    },
  };
  context.pd.actions.page.next = function () {};
  context.edits = edits;
  return context;
}

async function sweep(context, listed) {
  context.pd.task.items = listed;
  context.pd.actions.children.handleSingle();
  await sleep(10);
}

test("edits each item once even when later sweeps list it again", async () => {
  const context = makeContext();

  await sweep(context, [item("abc")]);
  assert.equal(context.edits.length, 1, "first sweep edits the item");
  assert.equal(context.pd.task.info.edited, 1);

  await sweep(context, [item("abc")]);
  assert.equal(context.edits.length, 1, "relisted item must not be edited again");
  assert.equal(context.pd.task.info.edited, 1, "re-edit must not be counted");

  await sweep(context, [item("def")]);
  assert.equal(context.edits.length, 2, "distinct items still get edited");
  assert.equal(context.pd.task.info.edited, 2);
});

test("tracks edits across sections that list the same self post", async () => {
  const context = makeContext();
  const post = {
    kind: "t3",
    data: { id: "post1", name: "t3_post1", subreddit: "test", is_self: true },
  };

  await sweep(context, [post]);
  assert.equal(context.edits.length, 1);
  assert.equal(context.edits[0].url, "/api/editusertext");

  await sweep(context, [
    {
      kind: "t3",
      data: { id: "post1", name: "t3_post1", subreddit: "test", is_self: true },
    },
  ]);
  assert.equal(context.edits.length, 1, "search results must not re-edit submissions");
});
