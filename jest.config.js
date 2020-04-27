module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    // registers babel.config.js with jest
    "^.+\\.js$": "babel-jest",
    // alternative to preset: "ts-jest"
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // explicitly `(` + include + `)` any libs using ESM modules
  transformIgnorePatterns: ["node_modules/?!(@-0)"],
  // keep playing in the REPL (Quokka) from rerunning tests
  // in watch mode
  watchPathIgnorePatterns: ["^.+\\.repl.(ts|js)$"],
}

// TROUBLE SHOOTING: https://github.com/facebook/jest/issues/2081#issuecomment-619441551
