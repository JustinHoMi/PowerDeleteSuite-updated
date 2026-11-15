#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const JS_FILES = fs
  .readdirSync(ROOT)
  .filter((name) => name.endsWith(".js"))
  .sort();
const DOC_FILES = ["README.md", "VENDORED.md"];
const ALLOWED_README_ATTRIBUTION =
  /^The original project is \[j0be\/PowerDeleteSuite\]\(https:\/\/github\.com\/j0be\/PowerDeleteSuite\)\.$/;
const FORBIDDEN_THIRD_PARTY = /j0be|saandman|mykola2312|Vaspyyy/;
const PINNED_RAW_URL =
  /^https:\/\/raw\.githubusercontent\.com\/JustinHoMi\/PowerDeleteSuite-updated\/[0-9a-f]{40}\/powerdeletesuite\.js$/;
const LOCAL_STORAGE_KEYS = new Set(["pd_storage_v2", "pd_ver", "pd_storage"]);
const HTML_ALLOWLIST = new Set([
  '$("#pd__central").html(pd.centralForm);',
  'if ($("#pd__style").html() === "") {',
  ".html(",
  '$("#pd__central .complete .summary").html(',
  '$("#pd__central .complete .goodbye").html(',
]);

let failed = false;

function violation(file, line, message) {
  console.error(file + ":" + line + ": " + message);
  failed = true;
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function decodedJavascriptPayloads(text) {
  const payloads = [];
  const marker = "javascript:";
  let from = 0;
  while (true) {
    const start = text.indexOf(marker, from);
    if (start === -1) break;
    let end = start + marker.length;
    while (end < text.length && !/[\s"'`<>\\]/.test(text[end])) end++;
    const payload = text.slice(start + marker.length, end);
    from = end;
    if (!payload) continue;
    try {
      payloads.push(decodeURIComponent(payload));
    } catch (e) {
      violation("(encoded)", 1, "invalid percent-encoded bookmarklet payload");
    }
  }
  return payloads;
}

function checkRawHosts(file, text, payloads) {
  // Generated JS-string constants escape their quotes. Unescape them so a
  // concatenated URL prefix is not mistaken for a complete unpinned URL.
  const scanText = text.replace(/\\"/g, '"');
  const rawUrlPattern = /https?:\/\/raw\.githubusercontent\.com\/[^\s"'`<>)\]]+/g;
  for (const match of scanText.matchAll(rawUrlPattern)) {
    if (PINNED_RAW_URL.test(match[0])) continue;
    if (file === "bookmarklet.js") {
      const line = scanText.slice(0, match.index).split("\n").length;
      const lineText = scanText.split("\n")[line - 1].trim();
      if (lineText === '"https://raw.githubusercontent.com/" +') continue;
    }
    violation(file, lineNumber(scanText, match.index), "unpinned raw GitHub URL");
  }

  for (const payload of payloads) {
    for (const match of payload.matchAll(rawUrlPattern)) {
      if (!PINNED_RAW_URL.test(match[0])) {
        violation(file, 1, "unpinned raw GitHub URL in bookmarklet payload");
      }
    }
  }
}

function checkRootScript(file) {
  const text = read(file);
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (FORBIDDEN_THIRD_PARTY.test(line)) {
      violation(file, lineNo, "third-party host or repository reference");
    }
    if (/\/r\/PowerDeleteSuite\/(?:new\.json|wiki\/centralform\.json)/.test(line)) {
      violation(file, lineNo, "removed third-party endpoint");
    }
    if (/\beval\s*\(|\bnew\s+Function\s*\(/.test(line)) {
      violation(file, lineNo, "dynamic code execution");
    }
    if (/\b(?:innerHTML|outerHTML)\s*(?:=|\+=)/.test(line)) {
      violation(file, lineNo, "HTML assignment sink");
    }
    if (/\.html\s*\(/.test(line) && !HTML_ALLOWLIST.has(line.trim())) {
      violation(file, lineNo, "unreviewed .html() sink");
    }
    for (const match of line.matchAll(
      /localStorage\.(?:getItem|setItem|removeItem)\(\s*["']([^"']+)["']/g
    )) {
      if (!LOCAL_STORAGE_KEYS.has(match[1])) {
        violation(file, lineNo, "unexpected localStorage key " + match[1]);
      }
    }
  });
  checkRawHosts(file, text, decodedJavascriptPayloads(text));
}

function checkDocs(file) {
  const text = read(file);
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    if (!FORBIDDEN_THIRD_PARTY.test(line)) return;
    if (file === "README.md" && ALLOWED_README_ATTRIBUTION.test(line.trim())) {
      return;
    }
    if (file === "VENDORED.md" && !/https?:\/\//.test(line)) {
      return;
    }
    violation(file, index + 1, "third-party reference outside provenance");
  });
  if (/\/r\/PowerDeleteSuite\/(?:new\.json|wiki\/centralform\.json)/.test(text)) {
    violation(file, 1, "removed third-party endpoint");
  }
  checkRawHosts(file, text, decodedJavascriptPayloads(text));
}

function checkVendorAssets() {
  const html = read("vendor/centralform.html");
  const requiredIds = [
    "pd__form",
    "pd__export",
    "pd__submissions",
    "pd__comments",
    "pd__comments-edit",
    "pd__comments-edit-text",
    "pd__subreddits",
    "pd__sub-list",
    "pd__score",
    "pd__score-selector",
    "pd__score-dirtoggle",
    "pd__score-num",
    "pd__date",
    "pd__date-selector",
    "pd__date-dirtoggle",
    "pd__date-num",
    "pd__gilded",
    "pd__saved",
    "pd__mod",
    "pd__remember",
    "progress_page",
    "progress_item",
  ];
  for (const id of requiredIds) {
    if (!html.includes('id="' + id + '"')) {
      violation("vendor/centralform.html", 1, "missing #" + id);
    }
  }
  for (const cls of [
    "progress__byline",
    "gt-toggle",
    "num-only",
    "pd__insert",
    "pd__q",
    "complete",
    "processing",
    "goodbye",
  ]) {
    if (!new RegExp('class="[^"]*\\b' + cls + '\\b').test(html)) {
      violation("vendor/centralform.html", 1, "missing ." + cls);
    }
  }
  if (!/data-help=/.test(html)) {
    violation("vendor/centralform.html", 1, "missing data-help");
  }
  if (/\r/.test(html)) {
    violation("vendor/centralform.html", 1, "CRLF line ending");
  }
  if (/<script\b|\son[a-z]+\s*=|(?:src|action|href)\s*=/i.test(html)) {
    violation("vendor/centralform.html", 1, "executable or external markup");
  }

  const stylesheet = JSON.parse(read("stylesheet.json")).data.stylesheet;
  if (/@import|url\s*\(/i.test(stylesheet)) {
    violation("stylesheet.json", 1, "external stylesheet resource");
  }
}

for (const file of JS_FILES) checkRootScript(file);
for (const file of DOC_FILES) checkDocs(file);
checkVendorAssets();

if (failed) process.exit(1);
console.log("security checks passed");
