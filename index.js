/* jshint node: true */
'use strict';

var emberRollup = require('ember-rollup');
var cacheKeyForStableTree = require('calculate-cache-key-for-tree').cacheKeyForStableTree;

module.exports = emberRollup([{
  name: 'spaniel',
  namespaced: false
}], {
  name: 'ember-spaniel',
  cacheKeyForTree: cacheKeyForStableTree
});
