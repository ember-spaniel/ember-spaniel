import Component from '@ember/component';
import { inject as service} from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.cleanupTasks = [];
  },

  viewport: service(),
  clear() {
    for (let i = 0; i < this.cleanupTasks.length; i++) {
      this.cleanupTasks.pop()();
    }
  },

  didInsertElement() {
    let viewport = this.get('viewport');
    let first = document.getElementById("item-1");
    let second = document.getElementById('item-5');
    let third = document.getElementById('item-100');

    viewport.isInViewport(first).then(() => {
      $(first).addClass('isInViewport');
    });

    this.cleanupTasks.push(viewport.onInViewportOnce(second, () => {
      $(second).addClass('onInViewportOnce');
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(second, () => {
      $(second).addClass('onInViewportOnceCustom');
    }, {
      rootMargin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(third, () => {
      $(third).addClass('unreachable-onInViewportOnce');
    }));

  },
  willDestroyElement() {
    this._super(...arguments);
    this.clear();
  }
});
