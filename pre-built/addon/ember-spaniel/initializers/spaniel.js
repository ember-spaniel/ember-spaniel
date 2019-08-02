define('ember-spaniel/initializers/spaniel', ['exports', 'spaniel', 'ember-spaniel/spaniel-engines/ember-spaniel-engine'], function (exports, _spaniel, _emberSpanielEngine) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    _spaniel.default.setGlobalEngine(_emberSpanielEngine.default);
  }

  exports.default = {
    name: 'spaniel',
    initialize
  };
});