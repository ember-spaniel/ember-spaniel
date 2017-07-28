/* eslint-env node */
'use strict';

var emberRollup = require('ember-rollup');
var caclculateCacheKeyForTree = require('calculate-cache-key-for-tree');

module.exports = emberRollup([{
  name: 'spaniel',
  namespaced: false
}], {
  name: 'ember-spaniel',

  // ember-rollup implements a custom treeForVendor hook, we restore the caching
  // for that hook here
  cacheKeyForTree: function(treeType) {
    if (treeType === 'vendor') {
      // The treeForVendor returns a different value based on whether or not
      // this addon is a nested dependency
      return caclculateCacheKeyForTree(treeType, this, [!this.parent.parent]);
    } else {
      return this._super.cacheKeyForTree.call(this, treeType);
    }
  }
});
