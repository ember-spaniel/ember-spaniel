import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Basic Functionality');

test('isInViewport calls callback with true when in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.isInViewport');
    assert.equal(results.length, 1, 'Item observed in viewport');
  });
});

test('onInViewportOnce called when item in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.onInViewportOnce');
    assert.equal(results.length, 1, 'Item observed in viewport');
  });
});

test('onInViewportOnce not called when item not in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.unreachable-onInViewportOnce');
    assert.equal(results.length, 0, 'Item not observed in viewport');
  });
});
