# ember-spaniel [![Build Status](https://travis-ci.org/asakusuma/ember-spaniel.svg?branch=master)](https://travis-ci.org/asakusuma/ember-spaniel) [![npm version](https://badge.fury.io/js/ember-spaniel.svg)](https://www.npmjs.com/package/ember-spaniel)

Ember addon wrapping [spaniel](https://github.com/linkedin/spaniel), a viewport tracking library, [IntersectionObserver](https://github.com/WICG/IntersectionObserver) polyfill, and `requestAnimationFrame` task utility.

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

#### `onInViewportOnce(el, callback, { context, rootMargin, ratio })` => `Function`

Register a callback that will be called when the provided element first enters the viewport. Will get called on the next `requestAnimationFrame` if the element is already in the viewport. Returns a function that, when called, will cancel and clear the callback.

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

#### `isInViewport(el, { ratio, rootMargin } = {}) ` => `Promise`

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

## Requirements

Ember `2.x.x` is required. Tests are only run against [latest LTS and latest release](http://emberjs.com/builds/).

## Installation

* `git clone https://github.com/asakusuma/ember-spaniel.git` this repository
* `cd ember-spaniel`
* `npm install`
* `bower install`

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
