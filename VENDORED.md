# Vendored assets

These files are reviewed constants shipped with the extension. No runtime
request loads markup or styles from a third party.

## `vendor/centralform.html`

- Source: PowerDeleteSuite wiki page `centralform.json` on old.reddit.com.
- Wiki revision: `2b326038-06c4-11e8-bab8-0ec1c7deda00` (2018-02-01).
- Capture date: 2026-11-15.
- Capture source hash (`centralform.json`, raw bytes):
  `4bf43457b2de2bf214efa340ea64f3b9f32c66967ea97f61c4381dec4b896ea7`.
- Normalization: one HTML-entity decode pass, then CRLF to LF. No other
  content changes.
- Targets baseline script commit: `42e3a728cf58106fa5d628e86c9a5ebc786348c3`.
- Redistribution basis: the original PowerDeleteSuite project published this
  form for use by its bookmarklet; this fork preserves attribution to that
  project and ships the form unchanged apart from line endings.

## `stylesheet.json`

- Source: PowerDeleteSuite subreddit stylesheet, captured in the original
  project repository and retained at the repository root.
- Capture date: 2026-11-15 for this fork's provenance record.
- File sha256: `0f9b46a455800b3ea82256186fec301bee3b5c4799e2f052ff620dec2b657f47`.
- Targets baseline script commit: `42e3a728cf58106fa5d628e86c9a5ebc786348c3`.
- Runtime form: `scripts/build.js` reads `data.stylesheet`, applies the fixed
  entity decode map used by the former `innerHTML` insertion, and embeds the
  result as `pd.stylesheet`.
- Redistribution basis: original project stylesheet, retained with attribution
  to PowerDeleteSuite.
