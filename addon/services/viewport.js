import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { merge } from '@ember/polyfills';
import { Promise } from 'rsvp';
import spaniel from 'spaniel';

export default Service.extend({
  spaniel,

  // Private, don't touch this, use getWatcher()
  _globalWatcher: null,
  _isNativeIntersectionObserver: false,

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

    this._isNativeIntersectionObserver = this._checkIfIntersectionObserver();
  },

  getWatcher(root = window, ALLOW_CACHED_SCHEDULER = false) {
    return this._globalWatcher || (this._globalWatcher = new spaniel.Watcher({
      rootMargin: this.get('rootMargin'),
      ALLOW_CACHED_SCHEDULER: ALLOW_CACHED_SCHEDULER,
      root: root
    }));
  },

  isInViewport(el, { ratio, rootMargin } = {}) {
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

  onInViewportOnce(el, callback, { context, rootMargin, ratio, root = window, ALLOW_CACHED_SCHEDULER = false, SPANIEL_WATCHER = false } = {}) {
    if(SPANIEL_WATCHER || !this._isNativeIntersectionObserver){
      this._initSpanielWatcher(el, callback, { context, rootMargin, ratio, root, ALLOW_CACHED_SCHEDULER });
    }else{
      this._initNativeObserver(el, callback, { context, rootMargin, ratio, root });
    }
  },

  willDestroy() {
    if (this._globalWatcher) {
      this._globalWatcher.destroy();
    }
  },

  invalidate() {
    spaniel.invalidate();
  },

  _checkIfIntersectionObserver() {
    if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
      if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
        Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
          get: function() { return this.intersectionRatio > 0; }
        });
      }

      return true;
    }

    return false;
  },

  _initSpanielWatcher(el, callback, { context, rootMargin, ratio, root, ALLOW_CACHED_SCHEDULER }) {
    const canUseGlobalWatcher = !(rootMargin || ratio || (root !== window));
    let watcher = canUseGlobalWatcher ? this.getWatcher(root, ALLOW_CACHED_SCHEDULER) : new spaniel.Watcher({ rootMargin, ratio, root, ALLOW_CACHED_SCHEDULER });    

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

  _initNativeObserver(el, callback, { context, rootMargin, ratio, root }) {      
    if (typeof rootMargin === 'object') {
      rootMargin = `${rootMargin.top || 0}px ${rootMargin.right || 0}px ${rootMargin.bottom || 0}px ${rootMargin.left || 0}px`
    }

    if (root === window) {
      root = null;
    }

    let options = {
      root: root,
      rootMargin: rootMargin,
      threshold: ratio
    }
    
    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          callback.apply(context, arguments);
          observer.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);

    return function clearOnInViewportOnce() {
      observer.unobserve(el);
      observer.disconnect();
    };
  }
});