import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { currentURL, pauseTest, settled } from '@ember/test-helpers';
import { isVisible, pause } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';

const steps = {

  "Then pause(?: for ?(\\d+) ?ms)?"(countRaw) {
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

  "Then there should be (?:(\\d+) )?$opinionatedElement"(countRaw = "1", [collection,, selector]) {
    const count = parseInt(countRaw, 10);
    const m = `Step: ${this.step}, selector: ${selector}`;

    expect(collection, m).to.have.length(count);
  },

  "Then (?:(\\d+) )?$opinionatedElement should be visible"(countRaw = "1", [collection,, selector]) {
    const count = parseInt(countRaw, 10);

    let m = `Element count. Step: ${this.step}, selector: ${selector}`;
    expect(collection, m).to.have.length(count);

    collection.forEach((element, i) => {
      let m = `Element #${i} (zero-indexed) visibility. Step: ${this.step}, selector: ${selector}`;
      expect(isVisible(element), m).to.be.true;
    });
  },

  "Then I should see (?:(\\d+) )?$opinionatedElement": "Then (?:(\\d+) )?$opinionatedElement should be visible",

  "Then $opinionatedElement should (?:have text|say) \"$text\""([collection, label, selector], text) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);
    expect(collection[0].textContent.trim(), this.step).equal(text);
  },

};

export default steps;
