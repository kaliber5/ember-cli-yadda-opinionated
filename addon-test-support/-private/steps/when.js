import { click, doubleClick, fillIn, settled, triggerEvent, visit } from '@ember/test-helpers';
import { assert }  from '@ember/debug';
import { findInputForLabelWithText, findEditable } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

const steps = {

  async "When I (?:visit|am at|proceed to) URL (.*)"(url) {
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

  "When I fill \"(.*)\" into $opinionatedElement"(text, [collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    const element = collection[0];
    const target = findEditable(element);

    return fillIn(target, text);
  },

  "When I move the mouse pointer into $opinionatedElement"([collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    return triggerEvent(collection[0], 'mouseenter');
  },

  "When I move the mouse pointer out of $opinionatedElement"([collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    return triggerEvent(collection[0], 'mouseeleave');
  },

  "When I (de)?select (?:the )?(?:radio button|checkbox) $opinionatedElement"(de, [collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    let input;

    if (element.type === 'checkbox' || element.type === 'radio') {
      input = element;
    } else {
      const inputs = element.querySelectorAll('input[type="text"], input[type="checkbox"]');
      assert(`Expected one checkbox/radio, but ${inputs.length} found`, inputs.length === 1);
      [input] = inputs;
    }

    assert('A radio button cannot be deselected', !(de && (input.type === 'radio')));
    assert(`Expected input ${de ? 'not ' : ''}to be selected`, de ? input.checked : !input.checked);

    return click(input);
  },

  "When I (de)?select (?:the )?(?:radio button|checkbox) \"(.+?)\" in $opinionatedElement"(de, text, [collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    const input = findInputForLabelWithText(text, element);

    assert('Expected input to exist', input)
    assert('Expected input to be a checkbox or radio button', input.type === 'checkbox' || input.type === 'radio');
    assert('A radio button cannot be deselected', !(de && (input.type === 'radio')));
    assert(`Expected input ${de ? '' : 'not '}to be selected`, de ? input.checked : !input.checked);

    return click(input);
  }

};

export default steps;
