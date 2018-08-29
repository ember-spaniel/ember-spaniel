'use strict'; 
const rollup = require('ember-rollup/src/prebuild'); 
const addonPath = __dirname; 
 
rollup.preBuild(addonPath).then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});