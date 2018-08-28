'use strict'; 
const rollup = require('ember-rollup/src/prebuild'); 
const addonPath = __dirname; 
 
rollup.preBuild(addonPath);