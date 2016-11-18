import Ember from 'ember';
import SpanielInitializer from 'dummy/initializers/spaniel';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | spaniel', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  SpanielInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
