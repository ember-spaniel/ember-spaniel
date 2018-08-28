'use strict'; 
const rollup = require('ember-rollup/src/prebuild'); 
const addonPath = __dirname; 
 
rollup.preBuild(addonPath).then(() => { 
  process.exit(0); 
}).catch(error => { 
  console.error(error); 
  process.exit(1); 
});   