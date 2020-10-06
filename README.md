# ember-spaniel

[![Build Status](https://travis-ci.com/ember-spaniel/ember-spaniel.svg?branch=master)](https://travis-ci.com/ember-spaniel/ember-spaniel)
[![npm version](https://badge.fury.io/js/ember-spaniel.svg)](https://www.npmjs.com/package/ember-spaniel)

Ember addon wrapping [spaniel](https://github.com/linkedin/spaniel), a viewport tracking library, [IntersectionObserver](https://github.com/WICG/IntersectionObserver) polyfill, and `requestAnimationFrame` task utility.

## Compatibility

- Ember.js v3.4 or above
- Ember CLI v2.13 or above
- Node.js v8 or above

## Installation

```bash
ember install my-addon
```

## Usage

Including this addon will add Spaniel to your application, available for direct use in the app.

```JavaScript
import * as spaniel from 'spaniel';
```

The rest of the API is contained in a service.

## `viewport` service API

You can set your `ember-spaniel` config in `config/environment.js`, there are 3 options `defaultRootMargin`, `watcherTime` and `watcherRatio`.

The `viewport` service will look for a `defaultRootMargin` object property on the application config. If not found, will default to `0, 0, 0, 0`. The `watcherTime` and `watcherRatio` will be used as the config of watcher return by `getWatcher()`.

```JavaScript
// environment.js
module.exports = {
  ...
  'ember-spaniel': {
    watcherTime: 100,
    watcherRatio: 0.8,
    defaultRootMargin: {
      top: 100,
      bottom: 200
    }
  }
}
```

### `onInViewportOnce(el, callback, { context, rootMargin, ratio, root, ALLOW_CACHED_SCHEDULER })` => `Function`

Register a callback that will be called when the provided element first enters the viewport. Will get called on the next `requestAnimationFrame` if the element is already in the viewport. Returns a function that, when called, will cancel and clear the callback.

Optionally includes the ability to specify a custom root, which defaults to `window`. When passing a custom root, the common case would include handling state invalidation (referenced below `invalidate()`).

An optional flag `ALLOW_CACHED_SCHEDULER` which defaults to `true`. This feature flag when passed as `false` will disable caching of `getBoundingClientRect` on elements within the `Spaniel#ElementScheduler`.

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let viewport = this.get('viewport');
    let el = this.get('element');
    this.clearViewportCallback = viewport.onInViewportOnce(el, () => {
      console.log('I am in the viewport');
    });
  },
  willDestroyElement() {
    this._super(...arguments);
    this.clearViewportCallback();
  }
});
```

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let viewport = this.get('viewport');
    let fooChildElement = this.get('element');

    this.clearViewportCallback = viewport.onInViewportOnce(fooChildElement, () => {
      console.log('I am in the viewport');
    }, {
      root: fooCustomRoot,
      ALLOW_CACHED_SCHEDULER: false
    });
  },
  willDestroyElement() {
    this._super(...arguments);
    this.clearViewportCallback();
  }
});
```

### `isInViewport(el, { ratio, rootMargin } = {})` => `Promise`

Returns a promise that resolves if the element is in the viewport, otherwise rejects.

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let viewport = this.get('viewport');
    let el = this.get('element');
    viewport.isInViewport(el).then(() => {
      console.log('In the viewport');
    }, () => {
      console.log('Not in the viewport');
    });
  }
});
```

### `getWatcher()`

The service has a `Watcher` instance available for direct use.

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let watcher = this.get('viewport').getWatcher();
    let el = this.get('element');
    watcher.watch(el, (e) => {
      console.log(`${e} happened`);
    });
  }
});
```

### `invalidate()`

Triggers Spaniel#invalidate on the viewport to invalidate cached state. Due to negative performance implications, this method should not be abused and as such should handle edge case scenarios only, such as when leveraging a custom root. The recommended pattern below binds an event to viewports custom root, that when fired triggers the viewports `invalidate()` method. Optionally leveraging Ember's Util #debounce method for improved performance and/or https://github.com/ember-lifeline/ember-lifeline#addeventlistener.

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let viewport = this.get('viewport');
    let el = this.get('element');
    viewport.isInViewport(el).then(() => {
      console.log('In the viewport');
    }, () => {
      console.log('Not in the viewport');
    });

    fooCustomRoot.addEventListener('foo-event', this.onFooMethod.bind(this), false);
  },
  onFooMethod() {
    let viewport = this.get('viewport');

    viewport.invalidate();
  },
  willDestroyElement() {
    this._super(...arguments);
    let viewport = this.get('viewport');

    fooCustomRoot.removeEventListener('foo-event', this.onFooMethod.bind(this), false);
  }
});
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
