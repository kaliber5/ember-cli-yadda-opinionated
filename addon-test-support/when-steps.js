import { click, fillIn, settled, visit } from '@ember/test-helpers';
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

  "When I click (?:on )?$element"([collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return click(collection[0]);
  },

  "When I fill \"$text\" into $element"(text, [collection, label, selector]) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    return fillIn(collection[0], text);
  },

};

export default steps;
