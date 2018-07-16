# ember-spaniel [![Build Status](https://travis-ci.org/asakusuma/ember-spaniel.svg?branch=master)](https://travis-ci.org/asakusuma/ember-spaniel) [![npm version](https://badge.fury.io/js/ember-spaniel.svg)](https://www.npmjs.com/package/ember-spaniel)

Ember addon wrapping [spaniel](https://github.com/linkedin/spaniel), a viewport tracking library and [IntersectionObserver](https://github.com/WICG/IntersectionObserver) polyfill.

Including this addon will add Spaniel to your application, available for direct use in the app.

```JavaScript
import spaniel from 'spaniel';
```

The rest of the API is contained in a service.

## `viewport` service API

The `viewport` service will look for a `defaultRootMargin` object property on the application config. If not found, will default to 0, 0, 0, 0.

```JavaScript
// environment.js
module.exports = {
  ...
  defaultRootMargin: {
    top: 100,
    bottom: 200
  }
}
```

#### `onInViewportOnce(el, callback, { context, rootMargin, ratio, root, ALLOW_CACHED_SCHEDULER, SPANIEL_WATCHER })` => `Function`

Register a callback that will be called when the provided element first enters the viewport. Will get called on the next `requestAnimationFrame` if the element is already in the viewport. Returns a function that, when called, will cancel and clear the callback. 

Where supported, Native Intersection Observer will be leveraged, resulting in signification performance improvements as these operations are off the main thread. Be aware however, that your *callback is* executed on the main thread, as such the callback should operate as quickly as possible.

Optionally includes the ability to specify a custom root, which defaults to `window`. When passing a custom root, the common case would include handling state invalidation (referenced below `invalidate()`). If a custom root is leveraged, the target must be a descendant of the root element.

Optional flags:
`ALLOW_CACHED_SCHEDULER` which defaults to `false`. This feature flag when passed as `true` will allow for performant caching of `getBoundingClientRect` on elements within the `Spaniel#ElementScheduler`.

`SPANIEL_WATCHER` which defaults to `false`. This feature flag when passed as `true` will force the Intersection Observer Polyfill for all browsers. 

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
      ALLOW_CACHED_SCHEDULER: true
    });
  },
  willDestroyElement() {
    this._super(...arguments);
    this.clearViewportCallback();
  }
});
```

#### `isInViewport(el, { ratio, rootMargin } = {}) ` => `Promise`

Register a callback that will be called when the provided element is in the viewport. Will get called on the next `requestAnimationFrame` if the element is already in the viewport.

Where supported, Native Intersection Observer will be leveraged, resulting in signification performance improvements as these operations are off the main thread. Be aware however, that your *callback is* executed on the main thread, as such the callback should operate as quickly as possible.

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let viewport = this.get('viewport');
    let el = this.get('element');
    viewport.isInViewport(el, () => {
      console.log('In the viewport);
    });
  }
});
```

#### `getWatcher()`

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

#### `invalidate()`

Triggers Spaniel#invalidate on the viewport to invalidate cached state. Due to negative performance implications, this method should not be abused and as such should handle edge case scenarios only, such as when leveraging a custom root. The recommended pattern below binds an event to viewports custom root, that when fired triggers the viewports `invalidate()` method. Optionally leveraging Ember's Util #debounce method for improved performance and/or https://github.com/ember-lifeline/ember-lifeline#addeventlistener.

```JavaScript
export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  didInsertElement() {
    let viewport = this.get('viewport');
    let el = this.get('element');
    viewport.isInViewport(el, () => {
      console.log('In the viewport);
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


## Requirements

Ember `2.x.x` is required. Tests are only run against [latest LTS and latest release](http://emberjs.com/builds/).

## Installation

* `git clone https://github.com/asakusuma/ember-spaniel.git` this repository
* `cd ember-spaniel`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
