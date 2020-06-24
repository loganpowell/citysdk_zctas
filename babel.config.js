module.exports = {
    env: {
        test: {
            plugins: [
                // compiles ESM to cjs modules (powered by jest.config.js)
                "@babel/plugin-transform-modules-commonjs",
            ],
        },
    },
}
