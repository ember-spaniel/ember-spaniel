import Ember from 'ember';
const rAF = (typeof window === 'object') && typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame : (callback) => callback();

export default {
  reads: [],
  work: [],
  running: false,
  scheduleRead(callback) {
    this.reads.unshift(callback);
    this.run();
  },
  scheduleWork(callback) {
    this.work.unshift(callback);
    this.run();
  },
  run() {
    if (!this.running) {
      this.running = true;
      rAF(() => {
        Ember.run.join(() => {
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
