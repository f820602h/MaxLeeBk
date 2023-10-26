module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "vue-eslint-parser",
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
