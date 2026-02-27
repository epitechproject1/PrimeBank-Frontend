module.exports = {
    env: { browser: true, es2021: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-types/recommended",
        "prettier"
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    settings: {
        react: { version: "detect" }
    }
}
