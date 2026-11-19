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

function control(checked, value) {
  return {
    checked: !!checked,
    value: value === undefined ? "" : value,
    is(selector) {
      return selector === ":checked" && this.checked;
    },
    val() {
      return this.value;
    },
    prop(name, next) {
      if (name === "checked" && next !== undefined) {
        this.checked = !!next;
      }
      return this;
    },
  };
}

function subreddit(name, checked) {
  return {
    checked: !!checked,
    attr(attr) {
      return attr === "data-sub" ? name : undefined;
    },
    is(selector) {
      return selector === ":checked" && this.checked;
    },
  };
}

function collection(items) {
  return {
    length: items.length,
    map(callback) {
      const values = items.map((item, index) => callback.call(item, index, item));
      return {
        get() {
          return values;
        },
      };
    },
  };
}

function makePage(subs, masterChecked) {
  const controls = {
    "#pd__export": control(false),
    "#pd__submissions": control(false),
    "#pd__comments": control(false),
    "#pd__comments-edit": control(true),
    "#pd__comments-edit-text": control(true, "edited"),
    "#pd__subreddits": control(masterChecked),
    "#pd__score": control(false),
    "#pd__score-dirtoggle": control(true),
    "#pd__score-num": control(true, "200"),
    "#pd__date": control(false),
    "#pd__date-dirtoggle": control(true),
    "#pd__date-num": control(true, "60"),
    "#pd__gilded": control(false),
    "#pd__saved": control(false),
    "#pd__mod": control(false),
  };

  function $(selector) {
    if (typeof selector === "object" && selector !== null) {
      return selector;
    }
    if (selector === "#pd__sub-list input:checked") {
      return collection(subs.filter((sub) => sub.checked));
    }
    if (selector === "#pd__sub-list input") {
      return collection(subs);
    }
    if (controls[selector]) {
      return controls[selector];
    }
    throw new Error("unexpected selector: " + selector);
  }

  $.inArray = (value, list) => list.indexOf(value);
  return { $, controls, subs };
}

function makeContext(subs, masterChecked) {
  const page = makePage(subs, masterChecked);
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
  context.$ = page.$;
  context.pd.ui.updateDisplay = function () {};
  context.pd.ui.status = function () {};
  context.pd.actions.page.next = function () {};
  context.page = page;
  return context;
}

function item(subredditName) {
  return {
    kind: "t1",
    data: {
      id: "id_" + subredditName,
      name: "t1_id_" + subredditName,
      subreddit: subredditName,
      body: "original",
      is_self: false,
      created_utc: 1000,
      score: 1,
      gilded: 0,
      saved: false,
      distinguished: null,
    },
  };
}

test("checked subreddits still filter when the master checkbox is off", () => {
  const context = makeContext(
    [
      subreddit("Alpha", true),
      subreddit("Beta", false),
      subreddit("Gamma", true),
    ],
    false
  );

  context.pd.setup.createProcessStream();

  assert.equal(context.pd.filters.subs.enabled, true);
  assert.deepEqual(context.pd.filters.subs.list, ["alpha", "gamma"]);
  assert.equal(
    context.page.controls["#pd__subreddits"].checked,
    true,
    "master checkbox reflects the active filter"
  );

  context.pd.task.items = [item("Alpha")];
  assert.equal(
    context.pd.helpers.shouldBeActedOn(context.pd.task.items[0]),
    true
  );

  context.pd.task.items = [item("Beta")];
  assert.equal(
    context.pd.helpers.shouldBeActedOn(context.pd.task.items[0]),
    false
  );
  assert.equal(context.pd.task.info.ignoreReasons.subs, 1);
  assert.equal(context.pd.task.items[0].pdIgnoreReasons.subs, false);
});

test("no subreddit filter applies when nothing is selected", () => {
  const context = makeContext(
    [subreddit("Alpha", false), subreddit("Beta", false)],
    false
  );

  context.pd.setup.createProcessStream();

  assert.equal(context.pd.filters.subs.enabled, false);
  assert.deepEqual(context.pd.filters.subs.list, []);

  context.pd.task.items = [item("Beta")];
  assert.equal(
    context.pd.helpers.shouldBeActedOn(context.pd.task.items[0]),
    true
  );
});

test("only checked subreddits reach the edit action", () => {
  const context = makeContext(
    [subreddit("Alpha", true), subreddit("Beta", false)],
    false
  );
  const edits = [];

  context.pd.setup.createProcessStream();
  context.pd.actions.edit = function (editedItem) {
    edits.push(editedItem.data.subreddit);
    editedItem.pdEdited = true;
    context.pd.actions.children.handleSingle();
  };

  context.pd.task.items = [item("Beta"), item("Alpha")];
  context.pd.actions.children.handleSingle();

  assert.deepEqual(edits, ["Alpha"]);
  assert.equal(context.pd.task.info.ignored, 1);
  assert.equal(context.pd.task.info.edited, 1);
});
