import Ember from 'ember';
import spaniel from 'spaniel';

export default Ember.Service.extend({
  spaniel,
  init() {
    let { defaultRootMargin } = this.container.lookupFactory('config:environment');
    this.set('rootMargin', Ember.merge({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }, defaultRootMargin));
  },
  watcher: Ember.computed(function() {
    return new spaniel.Watcher({
      rootMargin: this.get('rootMargin')
    });
  }),
  onInViewportOnce(el, callback, { context, rootMargin, ratio } = {}) {
    let watcher = !!(rootMargin || ratio) ? new spaniel.Watcher({ rootMargin, ratio }) : this.get('watcher');
    watcher.watch(el, function onInViewportOnceCallback() {
      Ember.run.join(context, callback, arguments);
      watcher.unwatch(el);
    });
    return function clearOnInViewportOnce() {
      watcher.unwatch(el);
    };
  }
});
