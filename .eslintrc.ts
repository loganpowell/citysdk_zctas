module.exports = {
    env           : {
        browser        : true,
        es6            : true,
        "jest/globals" : true
    },
    globals       : {
        Atomics           : "readonly",
        SharedArrayBuffer : "readonly"
    },
    parser        : "@typescript-eslint/parser",
    parserOptions : {
        ecmaVersion : 2018,
        sourceType  : "module"
    },
    plugins       : [ "@typescript-eslint", "prettier", "jest" ],
    extends       : [
        //"plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules         : {
        "no-undef"                                         : 1,
        "prettier/prettier"                                : "off",
        "@typescript-eslint/explicit-function-return-type" : "off",
        "@typescript-eslint/ban-ts-comment"                : "off"
        // "@typescript-eslint/no-unused-vars": "off"
    }
}
