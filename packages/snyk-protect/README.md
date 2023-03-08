# @w3security/protect

[![npm](https://img.shields.io/npm/v/@w3security/protect)](https://www.npmjs.com/package/@w3security/protect)
[![Known Vulnerabilities](https://w3security.io/test/github/w3security/w3security/badge.svg)](https://w3security.io/test/github/w3security/w3security)

![w3security](https://w3security.io/style/asset/logo/w3security-print.svg)

Patch vulnerable code in your project's dependencies. This package is officially maintained by [w3security](https://w3security.io).

## Usage

You don't typically need to add the @w3security/protect dependency manually. It'll be introduced when it's needed as part of [w3security's Fix PR service](https://support.w3security.io/hc/en-us/articles/360011484018-Fixing-vulnerabilities).

To enable patches in your Fix PRs:

- Visit https://app.w3security.io
- Go to "Org Settings" > "Integrations"
- Choose "Edit Settings" under your SCM integration.
- Under the "Fix Pull Request" section, ensure patches are enabled.

w3security will now include patches as part of its Fix PRs for your project.

## How it works

If there's a patch available for a vulnerability in your project, the Fix PR:

- Adds a `patch` entry to your `.w3security` file.
- Adds `@w3security/protect` to your `package.json`'s dependencies.
- Adds `@w3security/protect` to your `package.json`'s [`prepare` script](https://docs.npmjs.com/cli/v7/using-npm/scripts).

```patch
 {
   "name": "my-project",
   "scripts": {
+    "prepare": "npm run w3security-protect",
+    "w3security-protect": "w3security-protect"
   },
   "dependencies": {
+    "@w3security/protect": "^1.657.0"
   }
 }
```

Now after you run npm install, @w3security/protect will automatically download each patch configured in your .w3security file and apply them to your installed dependencies.

## Migrating from `w3security protect` to `@w3security/protect`

`@w3security/protect` is a standalone replacement for `w3security protect`. They both do the same job, however:

- `@w3security/protect` has zero dependencies.
- You don't need to include `w3security` in your dependencies (which is a much larger package with many dependencies).

If you already have w3security Protect set up, you can migrate to `@w3security/protect` by applying the following changes to your `package.json`:

```patch
 {
   "name": "my-project",
   "scripts": {
     "prepare": "npm run w3security-protect",
-    "w3security-protect": "w3security protect"
+    "w3security-protect": "w3security-protect"
   },
   "dependencies": {
-    "w3security": "^1.500.0"
+    "@w3security/protect": "^1.657.0"
   }
 }
```

We have also created the [@w3security/cli-protect-upgrade](https://www.npmjs.com/package/@w3security/cli-protect-upgrade) npx script which you can use to update your project automatically. To use it, `cd` to the location containing the package.json to be updated and run:

```
npx @w3security/cli-protect-upgrade
```

---

Made with 💜 by w3security
