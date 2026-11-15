#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(ROOT, "powerdeletesuite.js");
const USERSCRIPT = path.join(ROOT, "powerdeletesuite.user.js");
const README = path.join(ROOT, "README.md");
const BOOKMARKLET = path.join(ROOT, "bookmarklet.js");
const STYLESHEET = path.join(ROOT, "stylesheet.json");
const CENTRAL_FORM = path.join(ROOT, "vendor", "centralform.html");

const ASSET_BEGIN = "// BEGIN GENERATED ASSETS (scripts/build.js)";
const ASSET_END = "// END GENERATED ASSETS";
const USER_BEGIN = "// BEGIN GENERATED BOOKMARKLET";
const USER_END = "// END GENERATED BOOKMARKLET";
const README_BEGIN = "<!-- BEGIN GENERATED BOOKMARKLET -->";
const README_END = "<!-- END GENERATED BOOKMARKLET -->";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function replaceBlock(text, begin, end, replacement, file) {
  const beginAt = text.indexOf(begin);
  const endAt = text.indexOf(end);
  if (beginAt === -1 || endAt === -1 || endAt < beginAt) {
    fail(file + ": missing generated marker block");
  }
  const afterBegin = text.indexOf("\n", beginAt);
  const endLine = text.lastIndexOf("\n", endAt);
  if (afterBegin === -1 || endLine < afterBegin) {
    fail(file + ": malformed generated marker block");
  }
  return (
    text.slice(0, afterBegin + 1) +
    replacement +
    "\n" +
    text.slice(endLine + 1)
  );
}

function decodeCss(css) {
  const decoded = css
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  if (/&[a-zA-Z#0-9]+;/.test(decoded)) {
    fail("stylesheet.json: undecoded HTML entity remains");
  }
  return decoded;
}

function bookmarkletUrl() {
  const source = read(BOOKMARKLET)
    .replace(/^javascript:\s*/, "")
    .replace(/\r?\n\s*/g, " ")
    .trim();
  if (/\r|\n/.test(source)) {
    fail("bookmarklet.js: bookmarklet source still contains a line break");
  }
  // Keep the install string readable. Only characters that would terminate or
  // corrupt the URL are escaped; everything else stays as normal JavaScript.
  const encoded = source.replace(/%/g, "%25").replace(/#/g, "%23");
  const url = "javascript:" + encoded;
  if (decodeURIComponent(encoded) !== source) {
    fail("bookmarklet.js: bookmarklet URL is not reversible");
  }
  return url;
}

function generatedAssets() {
  const stylesheet = JSON.parse(read(STYLESHEET));
  if (!stylesheet || !stylesheet.data || typeof stylesheet.data.stylesheet !== "string") {
    fail("stylesheet.json: missing data.stylesheet");
  }
  const css = decodeCss(stylesheet.data.stylesheet);
  const html = read(CENTRAL_FORM);
  return (
    "pd.stylesheet = " +
    JSON.stringify(css) +
    ";\n" +
    "pd.centralForm = " +
    JSON.stringify(html) +
    ";"
  );
}

function targets() {
  const url = bookmarkletUrl();
  const list = [
    {
      file: SCRIPT,
      text: replaceBlock(read(SCRIPT), ASSET_BEGIN, ASSET_END, generatedAssets(), "powerdeletesuite.js"),
    },
    {
      file: USERSCRIPT,
      text: replaceBlock(
        read(USERSCRIPT),
        USER_BEGIN,
        USER_END,
        "var PD_BOOKMARKLET_URL = " + JSON.stringify(url) + ";",
        "powerdeletesuite.user.js"
      ),
    },
    {
      file: README,
      text: replaceBlock(
        read(README),
        README_BEGIN,
        README_END,
        "```\n" + url + "\n```",
        "README.md"
      ),
    },
  ];
  return list;
}

const args = process.argv.slice(2);
if (args.includes("--print-bookmarklet")) {
  console.log(bookmarkletUrl());
  process.exit(0);
}

const generated = targets();

if (args.includes("--check")) {
  let drift = false;
  for (const target of generated) {
    if (read(target.file) !== target.text) {
      console.error(path.relative(ROOT, target.file) + ": generated content is stale");
      drift = true;
    }
  }
  if (drift) {
    fail("Run `npm run build` and commit the regenerated files.");
  }
  process.exit(0);
}

for (const target of generated) {
  fs.writeFileSync(target.file, target.text);
  console.log("updated " + path.relative(ROOT, target.file));
}
