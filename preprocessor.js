// Modifications to
// https://github.com/jsynowiec/node-typescript-boilerplate/blob/32e3b53d62933438291a14e1d09904aed1df19d0/preprocessor.js
// Copyright (c) 2017 Target Brands, Inc.

const tsc = require('typescript');
const tsConfig = require('./tsconfig.json');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts')) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    return src;
  },
};
