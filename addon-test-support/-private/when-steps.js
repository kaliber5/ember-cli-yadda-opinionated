import { click, doubleClick, fillIn, settled, triggerEvent, visit } from '@ember/test-helpers';
import { assert }  from '@ember/debug';

const steps = {

  async "When I (?:visit|am at|proceed to) URL $text"(url) {
    try {
      await visit(url);
    } catch (e) {
      // See https://github.com/emberjs/ember-test-helpers/issues/332
      if (e.message !== 'TransitionAborted') {
        throw e;
      }
    }

    return settled();
  },

  "When the app settles"() {
    return settled();
  },

  "When I click (?:on )?$opinionatedElement"([collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return click(collection[0]);
  },

  "When I double click (?:on )?$opinionatedElement"([collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return doubleClick(collection[0]);
  },

  "When I fill \"$text\" into $opinionatedElement"(text, [collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return fillIn(collection[0], text);
  },

  "When I move the mouse pointer into $opinionatedElement"([collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return triggerEvent(collection[0], 'mouseenter');
  },

  "When I move the mouse pointer out of $opinionatedElement"([collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return triggerEvent(collection[0], 'mouseeleave');
  },

};

export default steps;
