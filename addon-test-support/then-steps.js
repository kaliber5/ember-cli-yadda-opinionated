import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { currentURL, pauseTest, settled } from '@ember/test-helpers';
import { pause } from 'ember-cli-yadda-opinionated/test-support/helpers';

const steps = {

  "Then pause(?: for ?(\\d+) ms)?"(countRaw) {
    if (countRaw) {
      const count = parseInt(countRaw, 10);
      return pause(count);
    } else {
      return pauseTest();
    }
  },

  "Then debug(?:ger)?"() {
    debugger; // eslint-disable-line no-debugger
  },

  async "Then I should (?:still )?be (?:at|on) URL $text"(url) {
    await settled();
    expect(currentURL()).to.equal(url);
  },

  "Then there should be (?:(\\d+) )?$element"(countRaw = "1", [collection]) {
    const count = parseInt(countRaw, 10);
    expect(collection, this.step).to.have.length(count);
  },

  "Then $element should (?:have text|say) \"$text\""([collection, label, selector], text) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    expect(collection[0].textContent.trim(), this.step).equal(text);
  },

};

export default steps;
