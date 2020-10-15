import Service from '@ember/service';
import {
  getOwner
} from '@ember/application';
import { getProperties, setProperties } from '@ember/object';
import {
  assign
} from '@ember/polyfills';
import {
  Promise
} from 'rsvp';
import * as spaniel from 'spaniel';

export default Service.extend({
  spaniel,

  // Private, don't touch this, use getWatcher()
  _globalWatcher: null,

  init() {
    this._super(...arguments);
    let config = getOwner(this).resolveRegistration('config:environment') || {};
    let {
      watcherTime,
      watcherRatio,
      defaultRootMargin,
    } = config['ember-spaniel'] || {};
    // Keep it only for backward compatiblity
    defaultRootMargin = defaultRootMargin ? defaultRootMargin : config.defaultRootMargin;

    setProperties(this, {
      watcherTime,
      watcherRatio,
      rootMargin: assign({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }, defaultRootMargin),
    });
  },

  getWatcher(root = document, ALLOW_CACHED_SCHEDULER = true) {
    let {
      watcherTime: time,
      watcherRatio: ratio,
      rootMargin,
    } = getProperties(this, 'watcherTime', 'watcherRatio', 'rootMargin');

    return this._globalWatcher || (this._globalWatcher = new spaniel.Watcher({
      time,
      ratio,
      rootMargin,
      root,
      ALLOW_CACHED_SCHEDULER,
    }));
  },

  isInViewport(el, {
    ratio,
    rootMargin
  } = {}) {
    rootMargin = rootMargin || this.rootMargin;
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
    root = document,
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
