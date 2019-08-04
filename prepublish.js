'use strict';
const rollup = require('ember-rollup/src/prebuild');
const addonPath = __dirname;

rollup
  .preBuild(addonPath)
  .then(() => {
    // Work around https://github.com/ember-spaniel/ember-rollup/issues/44
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    // Work around https://github.com/ember-spaniel/ember-rollup/issues/44
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
