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
    "space-before-function-paren": "off",
    indent: ["error", 4, {
      SwitchCase: 1
    }],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
    quotes: ["error", "double"]
  }
}
