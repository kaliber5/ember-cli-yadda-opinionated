import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { currentURL, pauseTest, settled } from '@ember/test-helpers';
import { pause } from './helpers';

const steps = {

  "Then pause ?(\\d+)?"(countRaw) {
    if (countRaw) {
      const count = parseInt(countRaw, 10);
      return pause(count);
    } else {
      return pauseTest();
    }
  },

  "Then debugger"() {
    debugger; // eslint-disable-line no-debugger
  },

  async "Then I should (?:still )?be (?:at|on) URL $text"(url) {
    await settled();
    expect(currentURL()).to.equal(url);
  },

  "Then there should be (?:(\\d+) )?$element"(countRaw, element) {
    if (countRaw) {
      assert("Should receive an array of elements. Did you use a/the unintentionally?", Array.isArray(element));

      const count = parseInt(countRaw, 10);

      expect(element, this.step).to.have.length(count);
    } else {
      expect(element, this.step).to.be.ok;
    }
  },

  "Then $element should have text \"$text\""(element, text) {
    assert("Expected a single element, did you forget a/the in the label?", !Array.isArray(element));
    assert(`Element not found: ${this.step}`, element);
    expect(element.textContent.trim(), this.step).equal(text);
  },

};

export default steps;
