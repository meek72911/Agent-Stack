/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./apps/dashboard/tailwind.config.ts",
  overrides: [
    {
      files: "*.py",
      options: {
        tabWidth: 4,
        printWidth: 120,
      },
    },
  ],
};
