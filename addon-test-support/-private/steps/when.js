import { click, doubleClick, fillIn, settled, triggerEvent, visit } from '@ember/test-helpers';
import { assert }  from '@ember/debug';
import { findRadioForLabelWithText } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

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

  "When I click (?:on )?$opinionatedElement"([collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    return click(collection[0]);
  },

  "When I double click (?:on )?$opinionatedElement"([collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    return doubleClick(collection[0]);
  },

  "When I fill \"$text\" into $opinionatedElement"(text, [collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    const element = collection[0];

    const selectors = [
      '[contenteditable]',
      'textarea',
      'input:not([hidden])',
      'select',
    ];

    if (
      element.isContentEditable
      || selectors.some(selector => element.matches(selector))
    ) {
      return fillIn(element, text);
    } else {
      const children = element.querySelectorAll(selectors.join(', '));
      assert(`Expected element to be fillable or have exactly one fillable child, but ${children.length} fillable children found`, children.length === 1);
      return fillIn(children[0], text);
    }
  },

  "When I move the mouse pointer into $opinionatedElement"([collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    return triggerEvent(collection[0], 'mouseenter');
  },

  "When I move the mouse pointer out of $opinionatedElement"([collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    return triggerEvent(collection[0], 'mouseeleave');
  },

  "When I select radio button \"(.+?)\" in $opinionatedElement"(text, [collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    const radioButton = findRadioForLabelWithText(element, text);

    return click(radioButton);
  }

};

export default steps;
