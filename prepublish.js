/*eslint no-process-exit: "off"*/
'use strict';

const rollup = require('ember-rollup/src/prebuild');
const addonPath = __dirname;

rollup.preBuild(addonPath).catch(error => {
  console.error(error);
  process.exit(1);
});
