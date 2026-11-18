# Power Delete Suite Updated

This fork maintains Power Delete Suite for current old.reddit.com behavior.
The original project is [j0be/PowerDeleteSuite](https://github.com/j0be/PowerDeleteSuite).

## Why use Power Delete Suite

1. There is no tracking or logging, and you never enter your password.
2. It uses Reddit's API instead of automating delete and edit button clicks, so
   it does not depend on loading every page through Never Ending Reddit.
3. It enumerates comments, submissions, and search results across sorts and
   timeframes to find as much content as possible.
4. It supports subreddit, score, date, gilded, saved, and mod-distinguished
   filters.
5. When editing and deleting are both enabled, it edits before deleting.
6. It can export filtered content without deleting it.
7. It can remember non-sensitive preferences locally.

## Changes in this fork

- Loads `powerdeletesuite.js` from the canonical
  `JustinHoMi/PowerDeleteSuite-updated` repository at an immutable commit.
- Verifies the downloaded script's SHA-256 before executing it.
- Reads the old.reddit.com modhash from `window.r.config.modhash` first, with
  safer fallbacks.
- Sends the modhash as both the `uh` form field and the `X-Modhash` header for
  edit/delete API calls.
- Shows the HTTP status and Reddit response text in edit/delete retry dialogs.
- Spaces API requests and automatically retries HTTP 429 responses with
  header-aware exponential backoff instead of stopping the run.
- Stops before destructive actions if Reddit does not expose a modhash for the
  current page.
- Serves the control-center stylesheet and form from reviewed constants in this
  repository. It does not fetch CSS or markup from another repository or the
  PowerDeleteSuite wiki.

## Installation

Click on the name of your browser below to expand the instructions.
When you get to the step that refers to pasting code, this is the code to copy and paste:

<!-- BEGIN GENERATED BOOKMARKLET -->
```
javascript:(function () { window.bookmarkver = "1.4"; var CANONICAL_REPO = "JustinHoMi/PowerDeleteSuite-updated"; var PINNED_REF = "b10ee38fbb5ed5fdec5bf95c490ffd4abe8a326c"; var SCRIPT_SHA256 = "e19e152eddd3415e69798cc378f84614cc4f435c5065b258be6caef29cc91067"; var isReddit = document.location.hostname.split(".").slice(-2).join(".") === "reddit.com"; var isOverview = document.location.href.match(/\/overview\b/); if (isReddit && isOverview) { load(); } else if ( confirm( "This script can only be run from your own user profile on reddit. Would you like to go there now?" ) ) { document.location = "https://old.reddit.com/u/me/overview"; } else { alert("Please go to your reddit profile before running this script"); } async function load() { var url = "https://raw.githubusercontent.com/" + CANONICAL_REPO + "/" + PINNED_REF + "/powerdeletesuite.js"; try { var response = await fetch(url); if (!response.ok) { alert("Error retrieving PowerDeleteSuite (HTTP " + response.status + ")"); return; } var bytes = await response.arrayBuffer(); if (!window.crypto || !window.crypto.subtle) { alert("PowerDeleteSuite cannot verify its own integrity in this browser."); return; } var digest = await window.crypto.subtle.digest("SHA-256", bytes); var digestBytes = new Uint8Array(digest); var hex = ""; for (var i = 0; i < digestBytes.length; i++) { hex += ("0" + digestBytes[i].toString(16)).slice(-2); } if (hex !== SCRIPT_SHA256) { alert("PowerDeleteSuite integrity check failed; not executing."); return; } var existing = document.getElementById("pd-script"); if ( existing && existing.getAttribute("data-pd-hash") === SCRIPT_SHA256 && window.pd && typeof window.pd.init === "function" ) { window.pd.init(); return; } if (existing) { existing.parentNode.removeChild(existing); } window.pd = undefined; var code = new TextDecoder("utf-8").decode(bytes); var script = document.createElement("script"); script.id = "pd-script"; script.setAttribute("data-pd-hash", SCRIPT_SHA256); script.textContent = code; document.head.appendChild(script); } catch (e) { alert("Error retrieving PowerDeleteSuite from GitHub"); } } })();
```
<!-- END GENERATED BOOKMARKLET -->

A new release changes the pinned script hash, so you must replace your existing
bookmark with the current snippet above. The bookmarklet does not update itself.

<details>
<summary>Firefox</summary>

1. Open the Hamburger menu
1. Click "Bookmarks"
1. Click "Manage Bookmarks"
1. Right click on empty space
1. Click "Add Bookmark"
1. Paste the above code into the URL section
1. Click "Save"

</details>
<details>
<summary>Chromium/Chrome</summary>

1. Go to `chrome://bookmarks/`
1. Right click on empty space
1. Click "Add new bookmark"
1. Paste the above code into the URL section
1. Click "Save"

</details>
<details>
<summary>Edge</summary>

1. Press the three dots
1. Click "Favorites"
1. Click on the star with a plus icon
1. Right click the new favorite
1. Click "Edit"
1. Paste the above code into the URL section
1. Click "Save"

</details>
<details>
<summary>Brave</summary>

1. Go to `chrome://bookmarks`
1. Right click on empty space
1. Click "Add new bookmark"
1. Paste the above code into the URL section
1. Click "Save"

</details>

## Trust and network access

The current release pins commit
`5d675638a44740412496e23150105f7531f8e569` and verifies SHA-256
`90aef45aa10b771bad2e1c4838a001208012ebdc81b22982c2cbe512f0e7a5ce`.
The only off-Reddit request is:

`https://raw.githubusercontent.com/JustinHoMi/PowerDeleteSuite-updated/5d675638a44740412496e23150105f7531f8e569/powerdeletesuite.js`

The loader rejects HTTP failures, missing `crypto.subtle`, and any byte
mismatch. The bundled form and stylesheet contain no external resources.

At runtime the script uses same-origin Reddit endpoints for `/user/.../comments`,
`/user/.../submitted`, `/search.json`, `/api/del`, and `/api/editusertext`.
Documentation links go to `github.com/JustinHoMi/PowerDeleteSuite-updated`.

## Usage

1. Go to your [account overview](https://old.reddit.com/u/me/overview).
1. Click on the bookmark you made while focused on the account overview tab.
1. Adjust settings to your preferences.

## Bugs / Issues?

Use the [canonical repository issue tracker](https://github.com/JustinHoMi/PowerDeleteSuite-updated/issues).
