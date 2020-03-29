module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  ignorePatterns: ["node_modules/"],
  rules: {
    indent: ["error", 4],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
    quotes: ["error", "double"]
  }
}
