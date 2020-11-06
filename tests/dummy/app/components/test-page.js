import Component from '@ember/component';
import {
  inject as service
} from '@ember/service';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.cleanupTasks = [];
  },

  viewport: service(),
  clear() {
    let childRoot = document.getElementById('childContainer');

    for (let i = 0; i < this.cleanupTasks.length; i++) {
      this.cleanupTasks.pop()();
    }

    childRoot.removeEventListener('scroll', this.onIsDirty.bind(this), false);
  },

  didInsertElement() {
    let viewport = this.viewport;
    let first = document.getElementById("item-1");
    let second = document.getElementById('item-5');
    let third = document.getElementById('item-5');
    let fourth = document.getElementById('item-100');
    let childFirst = document.getElementById('child-item-3');
    let childSecond = document.getElementById('child-item-10');
    let childThird = document.getElementById('child-item-100');
    let childRoot = document.getElementById('childContainer');
    let childRootHor = document.getElementById('childHorizontalContainer');
    let childFirstHor = document.getElementById('child-item-horizontal-1');
    let childSecondHor = document.getElementById('child-item-horizontal-2');
    let childThirdHor = document.getElementById('child-item-horizontal-50');

    viewport.isInViewport(first).then(() => {
      first.classList.add('isInViewport');
    });

    viewport.getWatcher().watch(first, (eventName) => {
      first.classList.add(eventName);
    });

    this.cleanupTasks.push(() => {
      viewport.getWatcher().unwatch(first);
    });

    this.cleanupTasks.push(viewport.onInViewportOnce(second, () => {
      second.classList.add('onInViewportOnce');
    }, {
      ALLOW_CACHED_SCHEDULER: true
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(third, () => {
      third.classList.add('onInViewportOnceCustom');
    }, {
      ALLOW_CACHED_SCHEDULER: true,
      rootMargin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(fourth, () => {
      fourth.classList.add('unreachable-onInViewportOnce');
    }, {
      ALLOW_CACHED_SCHEDULER: true
    }));

    // CHILD ROOT

    this.cleanupTasks.push(viewport.onInViewportOnce(childFirst, () => {
      childFirst.classList.add('childOnInViewportOnce');
    }, {
      root: childRoot,
      ALLOW_CACHED_SCHEDULER: true
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childSecond, () => {
      childSecond.classList.add('childOnInViewportOnce');
    }, {
      root: childRoot,
      ALLOW_CACHED_SCHEDULER: true
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childThird, () => {
      childThird.classList.add('childOnInViewportOnce');
    }, {
      root: childRoot,
      ALLOW_CACHED_SCHEDULER: true
    }));


    // CHILD HORIZONTAL ROOT
    this.cleanupTasks.push(viewport.onInViewportOnce(childFirstHor, () => {
      childFirstHor.classList.add('childHorOnInViewportOnce');
    }, {
      root: childRootHor,
      ALLOW_CACHED_SCHEDULER: false
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childSecondHor, () => {
      childSecondHor.classList.add('childHorOnInViewportOnce');
    }, {
      root: childRootHor,
      ALLOW_CACHED_SCHEDULER: true
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childThirdHor, () => {
      childThirdHor.classList.add('childHorOnInViewportOnce', 'child-unreachable-onInViewportOnceHor');
    }, {
      root: childRootHor,
      ALLOW_CACHED_SCHEDULER: false
    }));

    childRoot.addEventListener('scroll', this.onIsDirty.bind(this), false);
  },
  onIsDirty() {
    let viewport = this.viewport;
    viewport.invalidate();
  },
  willDestroyElement() {
    this._super(...arguments);
    this.clear();
  }
});
