"use strict";

const fs = require("fs");
const vm = require("vm");

function run(source, globals, filename) {
  const context = vm.createContext({ ...globals });
  context.window = context;
  vm.runInContext(source, context, { filename: filename || "fixture.js" });
  return context;
}

function load(file, globals) {
  return run(fs.readFileSync(file, "utf8"), globals || {}, file);
}

module.exports = { load, run };
