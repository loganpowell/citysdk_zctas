## Instructions

1. Change project name in `package.json`
2. Update `./jsdoc/jsdoc.json`

```diff
  "source": {
    "include": ["src", "README.md"],
    "includePattern": "\\.(jsx|js|ts|tsx)$",
-   "excludePattern": "(node_modules/|spool/)"
+   "excludePattern": "(node_modules/|<project>/)"
  },
  "templates": {
-   "referenceTitle": "`@-0/spool` docs",
+   "referenceTitle": "<project> docs",
    "disableSort": true,
    "collapse": false
  },
```

3. `npm i`


## Dependencies

01. `concurrently`: concurrently runs 
    - typescript compiler `watch` mode
    - jest tests
    - run with `npm run tests`
02. compiled from/to esm modules throughout (uses typescript
    compiler)
03. enables esm modules for tests (uses `babel-jest`)
04. integrated with jsdoc template from [better-docs]
05. checks for circular dependencies in `lib` output using `madge`


## Customizing

If you don't need one of the features above, just delete its
directory and any related scripts from `package.json`


[better-docs]: https://github.com/SoftwareBrothers/better-docs