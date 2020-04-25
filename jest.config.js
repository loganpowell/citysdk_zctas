module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    // triggers the plugins from babel.config.js
    "^.+\\.js$": "babel-jest",
  },
  // explicitly include any node libs using ESM modules
  transformIgnorePatterns: ["node_modules/?!(@-0)"],
}
