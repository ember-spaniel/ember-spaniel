import Ember from 'ember';

export default Ember.Component.extend({
  viewport: Ember.inject.service(),
  message: "Scroll around and see what happens",
  didInsertElement() {
    let viewport = this.get('viewport');
    let el = document.getElementById('item-20');
    viewport.onInViewportOnce(el, () => {
      console.log('HO');
      this.set('message', '20 in da viewport');
    });
  }
});
