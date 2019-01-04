import Service from '@ember/service';
import {
  getOwner
} from '@ember/application';
import {
  merge
} from '@ember/polyfills';
import {
  Promise
} from 'rsvp';
import spaniel from 'spaniel';

export default Service.extend({
  spaniel,

  // Private, don't touch this, use getWatcher()
  _globalWatcher: null,

  init() {
    this._super(...arguments);
    let config = getOwner(this).resolveRegistration('config:environment');
    let defaultRootMargin = config && config.defaultRootMargin;

    this.set('rootMargin', merge({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }, defaultRootMargin));

  },

  getWatcher(root = window, ALLOW_CACHED_SCHEDULER = true) {
    return this._globalWatcher || (this._globalWatcher = new spaniel.Watcher({
      rootMargin: this.get('rootMargin'),
      ALLOW_CACHED_SCHEDULER: ALLOW_CACHED_SCHEDULER,
      root: root
    }));
  },

  isInViewport(el, {
    ratio,
    rootMargin
  } = {}) {
    rootMargin = rootMargin || this.get('rootMargin');
    return new Promise((resolve, reject) => {
      spaniel.elementSatisfiesRatio(el, ratio, (flag) => {
        if (flag) {
          resolve({
            el
          });
        } else {
          reject({
            el
          });
        }
      }, rootMargin);
    });
  },

  onInViewportOnce(el, callback, {
    context,
    rootMargin,
    ratio,
    root = window,
    ALLOW_CACHED_SCHEDULER = true
  } = {}) {
    const canUseGlobalWatcher = !(rootMargin || ratio || (root !== window));
    let watcher = canUseGlobalWatcher ? this.getWatcher(root, ALLOW_CACHED_SCHEDULER) : new spaniel.Watcher({
      rootMargin,
      ratio,
      root,
      ALLOW_CACHED_SCHEDULER
    });

    watcher.watch(el, function onInViewportOnceCallback() {
      callback.apply(context, arguments);
      watcher.unwatch(el);
    });

    return function clearOnInViewportOnce() {
      watcher.unwatch(el);
      if (!canUseGlobalWatcher) {
        watcher.destroy();
      }
    };
  },

  willDestroy() {
    if (this._globalWatcher) {
      this._globalWatcher.destroy();
    }
  },

  invalidate() {
    spaniel.invalidate();
  }
});
