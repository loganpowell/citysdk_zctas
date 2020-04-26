module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    // registers babel.config.js with jest
    "^.+\\.js$": "babel-jest",
  },
  // explicitly `(` + include + `)` any libs using ESM modules
  transformIgnorePatterns: ["node_modules/?!(@-0)"],
}

// TROUBLE SHOOTING: https://github.com/facebook/jest/issues/2081#issuecomment-619441551
