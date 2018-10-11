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

test('isInViewport does not call callback with true when not in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.unreachable-isInViewport');
    assert.equal(results.length, 0, 'Item not observed in viewport');
  });
});


test('onInViewportOnce called when item in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.onInViewportOnce');
    assert.equal(results.length, 1, 'Item observed in viewport');
  });
});

test('onInViewportOnce called when item in viewport using custom rootMargin', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.onInViewportOnceCustom');
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

test('onInViewportOnce called when child item in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.childOnInViewportOnce');
    assert.equal(results.length, 2, 'Item observed in viewport');
  });
});

test('onInViewportOnce not called when child item is not in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.child-unreachable-onInViewportOnce');
    assert.equal(results.length, 0, 'Item not observed in viewport');
  });
});

test('onInViewportOnce called when child item in viewport with poly', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.child-onInViewportOnce-poly');
    assert.equal(results.length, 1, 'Item observed in viewport');
  });
});

test('onInViewportOnce not called when child item is not in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.child-unreachable-onInViewportOnce-poly');
    assert.equal(results.length, 0, 'Item not observed in viewport');
  });
});

test('onInViewportOnce called when horizontal child item in viewport', function(assert) {
  visit('/');

  andThen(function() {
    let results = find('.childHorOnInViewportOnce');
    assert.equal(results.length, 1, 'Item observed in viewport');
  });
});
