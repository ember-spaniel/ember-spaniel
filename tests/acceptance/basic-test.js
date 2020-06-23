import { visit, waitFor } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | Basic Functionality', function(hooks) {
  setupApplicationTest(hooks);

  test('isInViewport calls callback with true when in viewport', async function(assert) {
    await visit('/');

    assert.dom('.isInViewport').exists('Item observed in viewport');
  });

  test('onInViewportOnce called when item in viewport', async function(assert) {
    await visit('/');

    assert.dom('.onInViewportOnce').exists('Item observed in viewport');
  });

  test('onInViewportOnce called when item in viewport using custom rootMargin', async function(assert) {
    await visit('/');

    assert.dom('.onInViewportOnceCustom').exists('Item observed in viewport');
  });

  test('onInViewportOnce not called when item not in viewport', async function(assert) {
    await visit('/');

    assert
      .dom('.unreachable-onInViewportOnce')
      .doesNotExist('Item not observed in viewport');
  });

  test('onInViewportOnce called when horizontal child item in viewport', async function(assert) {
    await visit('/');

    assert.dom('.childHorOnInViewportOnce').exists('Item observed in viewport');
  });

  test('onInViewportOnce not called when horizontal child item not in viewport', async function(assert) {
    await visit('/');

    assert
      .dom('.child-unreachable-onInViewportOnceHor')
      .doesNotExist('Item not observed in viewport');
  });

  test('watcher will emit event with custom config', async function(assert) {
    await visit('/');

    assert.dom('.exposed').exists('Item exposed in viewport');

    await waitFor('.impressed', { timeout: 200 })
    assert.dom('.impressed').exists('Item impressed in viewport');
  });
});
