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

  "When I click (?:on )?$element"(element) {
    assert("Expected a single element, did you forget a/the in the label?", !Array.isArray(element));
    assert(`Element not found: ${this.step}`, element);
    return click(element);
  },


  "When I fill \"$text\" into $element"(text, element) {
    assert("Expected a single element, did you forget a/the in the label?", !Array.isArray(element));
    assert(`Element not found: ${this.step}`, element);
    return fillIn(element, text);
  },

};

export default steps;
