import { deprecate } from '@ember/debug';
import batcher from 'ember-batcher/batcher';

export default {
  scheduleRead(callback) {
    batcher.scheduleRead(callback);
    deprecate(
      'Import `scheduleRead` from ember-batcher >= v1.x.x.',
      true,
      { id: 'ember-spaniel-scheduleRead', until: '1.1.0' }
    );
  },
  scheduleWork(callback) {
    batcher.scheduleWork(callback);
    deprecate(
      'Import `scheduleWork` from ember-batcher >= v1.x.x.',
      true,
      { id: 'ember-spaniel-scheduleWork', until: '1.1.0' }
    );
  }
};
