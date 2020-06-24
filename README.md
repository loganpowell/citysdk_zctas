## Instructions

1. Change project name in `package.json`

```diff
{
-  "name": "ts-starter",
+  "name": "<whatevs>",
-  "description": "typescript configuration and starter project",
+  "description": "<also whatevs...>",
...
-  "repository": "https://github.com/loganpowell/ts-starter",
+  "repository": "https://github.com/<profile>/<repo>",
-  "homepage": "https://github.com/loganpowell/ts-starter",
+  "homepage": "https://github.com/<profile>/<repo>",
-  "scripts": {
-    "pages": "gh-pages -d @-0/spool",
# referenceTitle from ./jsdoc/jsdoc.json:
+    "pages": "gh-pages -d <referenceTitle>",
    ...
```

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

## Tests

-   Unit tests should live next to (in the same directory as)
    the functions that they test.
-   integration tests (tests that connect unit tests together
    that don't have an associated function definition) should
    live in the `/tests` directory

## Dependencies

1.  `concurrently`: concurrently runs
    -   typescript compiler `watch` mode
    -   jest tests
    -   run with `npm run tests`
2.  compiled from/to esm modules throughout (uses typescript
    compiler)
3.  enables esm modules for tests (uses `babel-jest`)
4.  integrated with jsdoc template from [better-docs]
5.  checks for circular dependencies in `lib` output using `madge`

## Customizing

If you don't need one of the features above, just delete its
directory and any related scripts from `package.json`

[better-docs]: https://github.com/SoftwareBrothers/better-docs

# Development Environment

## IDE: VSCode:

-   [ESLint Setup]
-   [Carbonnight](theme)

I find colors that don't tell me I'm making a mistake,
mostly a distraction. Carbonnight has a minimal
(monochromatic) set of colors. This theme in combination
with ESLint and/or TypeScript error messages and Prettier
instant (on save) feedback (if it gets reformated, it's
valid-ish) allows me to focus on logic and not so much
syntax and type errors.

##### ECMA/JavaScript

-   [Quokka](REPL)
    -   `<filename>.repl.ts/js` = scratchpad space before
        testing. See `src/sum` set for an example and
        `tsconfig.json` for the typescript configuration
-   [Prettier]
    -   formats your code in a consistent way. Also, if
        set up for [format on save], gives you quick
        feedback that your code will - at least - compile
        correctly

## Dev Dependencies (NPM)

#### [`@babel/plugin-transform-modules-commonjs`]

transforms ECMAScript modules to CommonJS

#### [`@types/jest`]

contains type definitions for Jest

#### [`@types/node`]

contains type definitions for Node standard modules

#### [`@typescript-eslint/eslint-plugin`]

so that you can use ESLint and TypeScript together, without
needing to worry about implementation detail differences
wherever possible

#### [`@typescript-eslint/parser`]

ESLint custom parser which leverages TypeScript ESTree to
allow for ESLint to lint TypeScript source

#### [`babel-jest`]

If you are already using jest-cli, add babel-jest and it
will automatically compile JavaScript code using Babel.

#### [`better-docs`]

Documentation toolbox for your javascript / typescript
projects based on JSDoc3 with @category, @component and
@optional plugins.

#### [`cross-env`]

cross-env makes it so you can have a single command without
worrying about setting or using the environment variable
properly for the platform

#### [`eslint`]

ESLint is a tool for identifying and reporting on patterns
found in ECMAScript/JavaScript code 🧐

#### [`gh-pages`]

Publish files to a gh-pages branch on GitHub (or any other
branch anywhere else).

#### [`jest`]

🃏 Delightful JavaScript Testing

#### [`prettier`]

opinionated code formatter. It enforces a consistent style
(so you don't have to argue about it).

#### [`ts-jest`]

TypeScript preprocessor with source map support for Jest
that lets you use Jest to test projects written in
TypeScript

#### [`npm-check-updates`]

upgrades your package.json dependencies to the latest
versions, ignoring specified versions.

## Scripts:

```js
{
  //..,
  "scripts": {
    // automated documentation: see jsdoc/jsdoc.json config
    "pages": "gh-pages -d @-0/spool",
    "clean": "rm -rf ./lib",
    // test for circular dependencies among modules
    "madge": "madge --circular lib/",
    // hmr typescript config
    "typewatch": "tsc --project tsconfig.json",
    // typescript build config extends tsconfig.json
    "types": "tsc --project tsconfig.build.json",
    // uses jsdoc for automated documentation
    "jsdoc": "jsdoc -c jsdoc/jsdoc.json --verbose --debug",
    "docs": "npm run types && npm run jsdoc",
    "patch": "npm version patch && npm run docs && npm run pages && npm publish",
    // run tests in watch mode (hmr)
    "tests": "npm run madge && concurrently \"npm run typewatch\" \"jest --watchAll\"",
    // after `npm run git <your commit message>`, this will run
    "postgit": "git push origin master && npm run patch",
    "git": "npm run ncu && git add . && git commit -m",
    // node-check-updates
    "ncu": "ncu -u && npm i && npm audit fix"
  },
  //..
}
```

<!--links-->

[prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[format on save]: https://scotch.io/tutorials/code-formatting-with-prettier-in-visual-studio-code
[eslint]: https://eslint.org/docs/user-guide/getting-started
[eslint setup]: https://scotch.io/tutorials/linting-and-formatting-with-eslint-in-vs-code
[quokka]: https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode
[carbonnight]: https://marketplace.visualstudio.com/items?itemName=gerane.Theme-Carbonnight
[`@babel/plugin-transform-modules-commonjs`]: https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs
[`@types/jest`]: https://www.npmjs.com/package/@types/jest
[`@types/node`]: https://www.npmjs.com/package/@types/node
[`@typescript-eslint/eslint-plugin`]: https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
[`@typescript-eslint/parser`]: https://www.npmjs.com/package/@typescript-eslint/parser
[`babel-jest`]: https://www.npmjs.com/package/babel-jest
[`better-docs`]: https://www.npmjs.com/package/better-docs
[`cross-env`]: https://www.npmjs.com/package/cross-env
[`eslint`]: https://www.npmjs.com/package/eslint
[`gh-pages`]: https://www.npmjs.com/package/gh-pages
[`jest`]: https://www.npmjs.com/package/jest
[`prettier`]: https://www.npmjs.com/package/prettier
[`ts-jest`]: https://www.npmjs.com/package/ts-jest
[`npm-check-updates`]: https://www.npmjs.com/package/npm-check-updates
