const fs = require("fs");
const path = require("path");

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, ".prettierrc"), "utf8"),
);

module.exports = {
  extends: [
    "react-app",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["prettier", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": ["error", prettierOptions],
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      rules: {
        "prettier/prettier": ["warn", prettierOptions],
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
      },
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  ],
};
