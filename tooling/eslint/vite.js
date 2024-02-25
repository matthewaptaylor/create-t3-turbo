/** @type {import('eslint').Linter.Config} */
const config = {
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/require-await": "off",
  },
};

module.exports = config;
