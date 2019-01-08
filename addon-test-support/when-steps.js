import { click } from '@ember/test-helpers';
import { assert }  from '@ember/debug';

const steps = {

  "When I click (?:on )?$element"(element) {
    assert("Expected a single element, did you forget a/the in the label?", !Array.isArray(element));
    assert("Element not found", element);
    return click(element);
  },

};

export default steps;
