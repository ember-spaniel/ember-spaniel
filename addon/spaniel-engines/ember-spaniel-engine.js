import { join } from '@ember/runloop';
const rAF = (typeof window === 'object') && typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame : (callback) => setTimeout(callback);

import { deprecate } from '@ember/debug';

export default {
  reads: [],
  work: [],
  running: false,
  scheduleRead(callback) {
    this.reads.unshift(callback);
    this.run();
    deprecate(
      'Import `scheduleRead` from ember-batcher >= v1.x.x.',
      true,
      { id: 'ember-spaniel-scheduleRead', until: '1.1.0' }
    );
  },
  scheduleWork(callback) {
    this.work.unshift(callback)
    this.run();
    deprecate(
      'Import `scheduleWrite` from ember-batcher >= v1.x.x.',
      true,
      { id: 'ember-spaniel-scheduleWork', until: '1.1.0' }
    );
  },
  run() {
    if (!this.running) {
      this.running = true;
      rAF(() => {
        join(() => {
          for (let i = 0, rlen = this.reads.length; i < rlen; i++) {
            this.reads.pop()();
          }
          for (let i = 0, wlen = this.work.length; i < wlen; i++) {
            this.work.pop()();
          }
          this.running = false;
          if (this.work.length > 0 || this.reads.length > 0) {
            this.run();
          }
        });
      });
    }
  }
};
