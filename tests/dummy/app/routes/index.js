import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let result = [];
    for (let i = 0; i < 100; i++) {
      result.push(i + 1);
    }
    return result;
  }
});
