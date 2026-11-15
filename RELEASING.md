# Releasing PowerDeleteSuite

Every change to `powerdeletesuite.js` changes the bytes users execute. A release
therefore has two commits:

1. Commit the fixed `powerdeletesuite.js` and any other runtime files as commit
   `A`.
2. Compute the hash from the committed blob, not the checkout:

   ```sh
   git show A:powerdeletesuite.js | sha256sum
   ```

3. Set `PINNED_REF` to `A` and `SCRIPT_SHA256` to that hash in
   `bookmarklet.js`.
4. Run `node scripts/build.js` to regenerate the userscript constant and the
   README install block. Commit those files as `B`.
5. Publish the string from `node scripts/build.js --print-bookmarklet`. It is
   the same string the generated README block contains.

Users must replace their bookmark with the published snippet for every release.
The bookmarklet loads only the immutable commit embedded in its URL and refuses
to execute bytes that do not match `SCRIPT_SHA256`.

Before publishing, run:

```sh
npm run check
```

`npm run check` verifies that generated assets are current, enforces the
third-party host and sink policy, and runs the loader tests. It never installs
dependencies.
