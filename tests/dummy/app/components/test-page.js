import Ember from 'ember';

export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  cleanupTasks: [],
  clear() {
    for (let i = 0; i < this.cleanupTasks.length; i++) {
      this.cleanupTasks.pop()();
    }
  },
  didInsertElement() {
    let viewport = this.get('viewport');
    let first = document.getElementById('item-1');
    let second = document.getElementById('item-5');
    let third = document.getElementById('item-100');

    viewport.isInViewport(first).then(() => {
      Ember.$(first).addClass('isInViewport');
    });

    this.cleanupTasks.push(viewport.onInViewportOnce(second, () => {
      Ember.$(second).addClass('onInViewportOnce');
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(second, () => {
      Ember.$(second).addClass('onInViewportOnceCustom');
    }, {
      rootMargin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(third, () => {
      Ember.$(third).addClass('unreachable-onInViewportOnce');
    }));
  },
  willDestroyElement() {
    this._super(...arguments);
    this.clear();
  }
});
