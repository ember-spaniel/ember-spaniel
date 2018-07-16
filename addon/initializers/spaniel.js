import spaniel from 'spaniel';
import batcher from 'ember-batcher/batcher';

export function initialize() {
  spaniel.setGlobalEngine(batcher);
}

export default {
  name: 'spaniel',
  initialize
};