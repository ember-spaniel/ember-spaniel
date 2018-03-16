import { run } from '@ember/runloop';
import Application from '@ember/application';
import SpanielInitializer from 'dummy/initializers/spaniel';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | spaniel', {
  beforeEach() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  },
  afterEach() {
     run(application, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  SpanielInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
