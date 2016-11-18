import spaniel from 'spaniel';
import emberSpanielEngine from './../spaniel-engines/ember-spaniel-engine';

export function initialize() {
  spaniel.setGlobalEngine(emberSpanielEngine);
}

export default {
  name: 'spaniel',
  initialize
};
