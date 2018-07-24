import Component from '@ember/component';
import { inject as service} from '@ember/service';

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
    let viewport = this.get('viewport');
    let first = document.getElementById("item-1");
    let second = document.getElementById('item-5');
    let third = document.getElementById('item-5');
    let fourth = document.getElementById('item-100');
    let fifth = document.getElementById('item-80');
    let sixth = document.getElementById('item-75');
    let childFirst = document.getElementById('child-item-3');
    let childSecond = document.getElementById('child-item-10');
    let childThird = document.getElementById('child-item-100');
    let childFourth = document.getElementById('child-item-6');
    let childFifth = document.getElementById('child-item-35');
    let childSixth = document.getElementById('child-item-50');
    let childRoot = document.getElementById('childContainer');

    viewport.isInViewport(first, () => {
      first.classList.add('isInViewport');
      console.log('IS IN VIEWPORT');
    });

    viewport.isInViewport(fifth, () => {
      first.classList.add('unreachable-isInViewport');
      console.log('IS IN VIEWPORT');
    });

    this.cleanupTasks.push(viewport.onInViewportOnce(second, () => {
      second.classList.add('onInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(third, () => {
      third.classList.add('onInViewportOnceCustom');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      rootMargin: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(fourth, () => {
      fourth.classList.add('unreachable-onInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(fifth, () => {
      fifth.classList.add('onInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    },{
      ALLOW_CACHED_SCHEDULER: true,
      SPANIEL_IO_POLY: true
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(sixth, () => {
      sixth.classList.add('onInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    },{
      SPANIEL_IO_POLY: true
    }));


    // CHILD ROOT

    this.cleanupTasks.push(viewport.onInViewportOnce(childFirst, () => {
      childFirst.classList.add('childOnInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      root: childRoot
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childSecond, () => {
      childSecond.classList.add('childOnInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      root: childRoot
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childThird, () => {
      childThird.classList.add('childOnInViewportOnce', 'child-unreachable-onInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      root: childRoot
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childFourth, () => {
      childFourth.classList.add('childOnInViewportOnce', 'child-onInViewportOnce-poly');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      root: childRoot,
      ALLOW_CACHED_SCHEDULER: true,
      SPANIEL_IO_POLY: true
    }));


    this.cleanupTasks.push(viewport.onInViewportOnce(childFifth, () => {
      childFifth.classList.add('childOnInViewportOnce');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      root: childRoot,
      SPANIEL_IO_POLY: true
    }));

    this.cleanupTasks.push(viewport.onInViewportOnce(childSixth, () => {
      childFourth.classList.add('childOnInViewportOnce', 'child-unreachable-onInViewportOnce-poly');
      console.log('IS IN VIEWPORT ONCE');
    }, {
      root: childRoot,
      ALLOW_CACHED_SCHEDULER: true,
      SPANIEL_IO_POLY: true
    }));

    childRoot.addEventListener('scroll', this.onIsDirty.bind(this), false);
  },
  onIsDirty() {
    let viewport = this.get('viewport');
    viewport.invalidate();
  },
  willDestroyElement() {
    this._super(...arguments);
    this.clear();
  }
});
