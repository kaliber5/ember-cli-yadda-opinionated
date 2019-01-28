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

  "Then there should be (NO |no )?(?:(\\d+) )?$opinionatedElement"(no, countRaw, [collection, , selector]) {
    assert(`Don't use NO and number at the same time, step: \`${this.step}\``, !(no && countRaw));

    let count =
      no       ? 0                      :
      countRaw ? parseInt(countRaw, 10) :
                 1;

    let m = `Step: ${this.step}, selector: ${selector}`;
    expect(collection, m).to.have.length(count);
  },

  "Then (NO |no )?(?:(\\d+) )?$opinionatedElement should be visible"(no, countRaw, [collection,, selector]) {
    assert(`Don't use NOT and number at the same time, step: \`${this.step}\``, !(no && countRaw));

    let count =
      no       ? 0                      :
      countRaw ? parseInt(countRaw, 10) :
                 1;

    let m = `Element count. Step: ${this.step}, selector: ${selector}`;
    expect(collection, m).to.have.length(count);

    collection.forEach((element, i) => {
      m = `Element #${i} (zero-indexed) visibility. Step: ${this.step}, selector: ${selector}`;
      expect(isVisible(element), m).to.be.true;
    });
  },

  "Then I should see (NO |no )?(?:(\\d+) )?$opinionatedElement": "Then (NO |no )?(?:(\\d+) )?$opinionatedElement should be visible",

  "Then $opinionatedElement should (NOT |not )?(?:have text|say) \"$text\""([collection, label, selector], not, text) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);

    not
      ? expect(collection[0].textContent.trim(), this.step).not.equal(text)
      : expect(collection[0].textContent.trim(), this.step).equal(text);
  },

  "Then $opinionatedElement should (NOT |not )?have HTML class \"$text\""([collection, label, selector], not, text) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);

    not
      ? expect(collection[0]).not.to.have.class(text)
      : expect(collection[0]).to.have.class(text);
  },

  "Then $opinionatedElement should (NOT |not )?have HTML attr \"(.+?)\"(?: with value \"(.+?)\")?"([collection, label, selector], not, attrName, attrValue) {
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);

    not
      ? expect(collection[0]).not.to.have.attr(attrName, attrValue)
      : expect(collection[0]).to.have.attr(attrName, attrValue);
  },

};

export default steps;
