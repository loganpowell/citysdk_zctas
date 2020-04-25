module.exports = {
  env: {
    test: {
      plugins: [
        // compiles ESM to cjs modules (powered by jest.config.js)
        "@babel/plugin-transform-modules-commonjs",
        //"babel-plugin-transform-es2015-modules-commonjs",
      ],
    },
  },
}
