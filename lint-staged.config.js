let formatFileNames = filenames => filenames.map(f => `'${f}'`).join(" ");

module.exports = {
  "**/*.ts?(x)": filenames => [
    `eslint --cache --fix ${formatFileNames(filenames)}`,
    `prettier --loglevel warn --write ${formatFileNames(filenames)}`,
    `yarn compile-ts --noEmit false --incremental --project tsconfig.json --outDir .ts-build`,
  ],
};
