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
