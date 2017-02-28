import Ember from 'ember';
import spaniel from 'spaniel';

export default Ember.Service.extend({
  spaniel,
  watcher: null,
  init() {
    let config = Ember.getOwner(this).resolveRegistration('config:environment');
    let defaultRootMargin = config && config.defaultRootMargin;
    this.set('rootMargin', Ember.merge({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }, defaultRootMargin));
  },
  getWatcher() {
    return this.watcher || (this.watcher = new spaniel.Watcher({
      rootMargin: this.get('rootMargin')
    }));
  },
  isInViewport(el, { ratio, rootMargin } = {}) {
    rootMargin = rootMargin || this.get('rootMargin');
    return new Ember.RSVP.Promise((resolve, reject) => {
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
  onInViewportOnce(el, callback, { context, rootMargin, ratio } = {}) {
    let watcher = !!(rootMargin || ratio) ? new spaniel.Watcher({ rootMargin, ratio }) : this.getWatcher();
    watcher.watch(el, function onInViewportOnceCallback() {
      callback.apply(context, arguments);
      watcher.unwatch(el);
    });
    return function clearOnInViewportOnce() {
      watcher.unwatch(el);
    };
  }
});
