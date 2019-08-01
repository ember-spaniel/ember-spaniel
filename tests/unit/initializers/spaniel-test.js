import { run } from '@ember/runloop';
import Application from '@ember/application';
import SpanielInitializer from 'dummy/initializers/spaniel';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | spaniel', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  hooks.afterEach(function() {
     run(application, 'destroy');
  });

  // Replace this with your real tests.
  test('it works', function(assert) {
    SpanielInitializer.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
