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
javascript:(function%20()%20%7B%0A%20%20window.bookmarkver%20%3D%20%221.4%22%3B%0A%20%20var%20CANONICAL_REPO%20%3D%20%22JustinHoMi%2FPowerDeleteSuite-updated%22%3B%0A%20%20var%20PINNED_REF%20%3D%20%225d675638a44740412496e23150105f7531f8e569%22%3B%0A%20%20var%20SCRIPT_SHA256%20%3D%0A%20%20%20%20%2290aef45aa10b771bad2e1c4838a001208012ebdc81b22982c2cbe512f0e7a5ce%22%3B%0A%20%20var%20isReddit%20%3D%0A%20%20%20%20document.location.hostname.split(%22.%22).slice(-2).join(%22.%22)%20%3D%3D%3D%20%22reddit.com%22%3B%0A%20%20var%20isOverview%20%3D%20document.location.href.match(%2F%5C%2Foverview%5Cb%2F)%3B%0A%20%20if%20(isReddit%20%26%26%20isOverview)%20%7B%0A%20%20%20%20load()%3B%0A%20%20%7D%20else%20if%20(%0A%20%20%20%20confirm(%0A%20%20%20%20%20%20%22This%20script%20can%20only%20be%20run%20from%20your%20own%20user%20profile%20on%20reddit.%20Would%20you%20like%20to%20go%20there%20now%3F%22%0A%20%20%20%20)%0A%20%20)%20%7B%0A%20%20%20%20document.location%20%3D%20%22https%3A%2F%2Fold.reddit.com%2Fu%2Fme%2Foverview%22%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20alert(%22Please%20go%20to%20your%20reddit%20profile%20before%20running%20this%20script%22)%3B%0A%20%20%7D%0A%0A%20%20async%20function%20load()%20%7B%0A%20%20%20%20var%20url%20%3D%0A%20%20%20%20%20%20%22https%3A%2F%2Fraw.githubusercontent.com%2F%22%20%2B%0A%20%20%20%20%20%20CANONICAL_REPO%20%2B%0A%20%20%20%20%20%20%22%2F%22%20%2B%0A%20%20%20%20%20%20PINNED_REF%20%2B%0A%20%20%20%20%20%20%22%2Fpowerdeletesuite.js%22%3B%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20var%20response%20%3D%20await%20fetch(url)%3B%0A%20%20%20%20%20%20if%20(!response.ok)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22Error%20retrieving%20PowerDeleteSuite%20(HTTP%20%22%20%2B%20response.status%20%2B%20%22)%22)%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20var%20bytes%20%3D%20await%20response.arrayBuffer()%3B%0A%20%20%20%20%20%20if%20(!window.crypto%20%7C%7C%20!window.crypto.subtle)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22PowerDeleteSuite%20cannot%20verify%20its%20own%20integrity%20in%20this%20browser.%22)%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20var%20digest%20%3D%20await%20window.crypto.subtle.digest(%22SHA-256%22%2C%20bytes)%3B%0A%20%20%20%20%20%20var%20digestBytes%20%3D%20new%20Uint8Array(digest)%3B%0A%20%20%20%20%20%20var%20hex%20%3D%20%22%22%3B%0A%20%20%20%20%20%20for%20(var%20i%20%3D%200%3B%20i%20%3C%20digestBytes.length%3B%20i%2B%2B)%20%7B%0A%20%20%20%20%20%20%20%20hex%20%2B%3D%20(%220%22%20%2B%20digestBytes%5Bi%5D.toString(16)).slice(-2)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(hex%20!%3D%3D%20SCRIPT_SHA256)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22PowerDeleteSuite%20integrity%20check%20failed%3B%20not%20executing.%22)%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20var%20existing%20%3D%20document.getElementById(%22pd-script%22)%3B%0A%20%20%20%20%20%20if%20(%0A%20%20%20%20%20%20%20%20existing%20%26%26%0A%20%20%20%20%20%20%20%20existing.getAttribute(%22data-pd-hash%22)%20%3D%3D%3D%20SCRIPT_SHA256%20%26%26%0A%20%20%20%20%20%20%20%20window.pd%20%26%26%0A%20%20%20%20%20%20%20%20typeof%20window.pd.init%20%3D%3D%3D%20%22function%22%0A%20%20%20%20%20%20)%20%7B%0A%20%20%20%20%20%20%20%20window.pd.init()%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(existing)%20%7B%0A%20%20%20%20%20%20%20%20existing.parentNode.removeChild(existing)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20window.pd%20%3D%20undefined%3B%0A%0A%20%20%20%20%20%20var%20code%20%3D%20new%20TextDecoder(%22utf-8%22).decode(bytes)%3B%0A%20%20%20%20%20%20var%20script%20%3D%20document.createElement(%22script%22)%3B%0A%20%20%20%20%20%20script.id%20%3D%20%22pd-script%22%3B%0A%20%20%20%20%20%20script.setAttribute(%22data-pd-hash%22%2C%20SCRIPT_SHA256)%3B%0A%20%20%20%20%20%20script.textContent%20%3D%20code%3B%0A%20%20%20%20%20%20document.head.appendChild(script)%3B%0A%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20alert(%22Error%20retrieving%20PowerDeleteSuite%20from%20GitHub%22)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)()%3B%0A
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
