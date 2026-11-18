// ==UserScript==
// @name         Power Delete Suite
// @namespace    pds
// @version      2
// @description  Add a power delete suite button to the reddit overview page.
// @author       ObiDriftKenobi
// @match        https://old.reddit.com/user/*/overview
// @grant        none
// ==/UserScript==

// Development/reference aid only. The bookmarklet URL below is generated from
// the pinned release; new releases require regenerating and reinstalling it.
// BEGIN GENERATED BOOKMARKLET
var PD_BOOKMARKLET_URL = "javascript:(function () { window.bookmarkver = \"1.4\"; var CANONICAL_REPO = \"JustinHoMi/PowerDeleteSuite-updated\"; var PINNED_REF = \"a37620445179a6ef0f801c06ebcba6d6ca120580\"; var SCRIPT_SHA256 = \"f705a66c7bcc66d30aa6dbc87d20dd0f5afcbc3c5536d69bb9f5b9b51b65640d\"; var isReddit = document.location.hostname.split(\".\").slice(-2).join(\".\") === \"reddit.com\"; var isOverview = document.location.href.match(/\\/overview\\b/); if (isReddit && isOverview) { load(); } else if ( confirm( \"This script can only be run from your own user profile on reddit. Would you like to go there now?\" ) ) { document.location = \"https://old.reddit.com/u/me/overview\"; } else { alert(\"Please go to your reddit profile before running this script\"); } async function load() { var url = \"https://raw.githubusercontent.com/\" + CANONICAL_REPO + \"/\" + PINNED_REF + \"/powerdeletesuite.js\"; try { var response = await fetch(url); if (!response.ok) { alert(\"Error retrieving PowerDeleteSuite (HTTP \" + response.status + \")\"); return; } var bytes = await response.arrayBuffer(); if (!window.crypto || !window.crypto.subtle) { alert(\"PowerDeleteSuite cannot verify its own integrity in this browser.\"); return; } var digest = await window.crypto.subtle.digest(\"SHA-256\", bytes); var digestBytes = new Uint8Array(digest); var hex = \"\"; for (var i = 0; i < digestBytes.length; i++) { hex += (\"0\" + digestBytes[i].toString(16)).slice(-2); } if (hex !== SCRIPT_SHA256) { alert(\"PowerDeleteSuite integrity check failed; not executing.\"); return; } var existing = document.getElementById(\"pd-script\"); if ( existing && existing.getAttribute(\"data-pd-hash\") === SCRIPT_SHA256 && window.pd && typeof window.pd.init === \"function\" ) { window.pd.init(); return; } if (existing) { existing.parentNode.removeChild(existing); } window.pd = undefined; var code = new TextDecoder(\"utf-8\").decode(bytes); var script = document.createElement(\"script\"); script.id = \"pd-script\"; script.setAttribute(\"data-pd-hash\", SCRIPT_SHA256); script.textContent = code; document.head.appendChild(script); } catch (e) { alert(\"Error retrieving PowerDeleteSuite from GitHub\"); } } })();";
// END GENERATED BOOKMARKLET

(function() {
    'use strict';

    var list = document.querySelector("#header-bottom-right > ul.flat-list");
    if (!list || document.getElementById("pd-delete")) return;
    var separator = list.nextElementSibling;
    if (!separator) return;
    var clone = separator.cloneNode(true);
    var a = document.createElement("a");
    a.id = "pd-delete";
    a.textContent = "PDS";
    a.setAttribute("href", PD_BOOKMARKLET_URL);
    clone.appendChild(a);
    list.parentNode.insertBefore(clone, list.nextSibling);
})();
