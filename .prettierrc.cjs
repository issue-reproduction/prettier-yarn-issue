/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = prettierConfig;
