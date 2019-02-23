/* global server */

import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { currentURL, pauseTest, settled } from '@ember/test-helpers';
import { isVisible, pause } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';
import { findRadioForLabelWithText } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';
import { camelize }  from '@ember/string';
import { pluralize } from 'ember-inflector';

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

  async "Then I should (?:still )?be (?:at|on) URL (.+)"(url) {
    await settled();
    expect(currentURL()).to.equal(url);
  },

  async "Then current URL's pathname should be (.+)"(pathname) {
    await settled();
    const url = new URL(currentURL(), location.origin);
    expect(url.pathname).to.equal(pathname);
  },

  async "Then current URL should (NOT |not )?have query param \"(\\w+)\""(not, key) {
    await settled();
    const url = new URL(currentURL(), location.origin);
    expect(url.searchParams.has(key)).to.equal(!!not);
  },

  async "Then current URL should (NOT |not )?have query param \"(\\w+)\" with value \"(.*)\""(not, key, expectedValue) {
    await settled();
    const url = new URL(currentURL(), location.origin);
    const actualValue = url.searchParams.get(key);

    not
     ? expect(actualValue).not.to.equal(expectedValue)
     : expect(actualValue).to.equal(expectedValue);
  },

  "Then there should be (NO |no )?(?:(\\d+) )?$opinionatedElement"(no, countRaw, [collection/* , label, selector */]) {
    assert(`Don't use NO and number at the same time`, !(no && countRaw));

    let count =
      no       ? 0                      :
      countRaw ? parseInt(countRaw, 10) :
                 1;

    expect(collection).to.have.length(count);
  },

  "Then (?:(\\d+) )?$opinionatedElement should (NOT |not )?be visible"(countRaw, [collection/* , label, selector */], no) {
    assert(`Don't use NOT and number at the same time`, !(no && countRaw));

    let count =
      no       ? 0                      :
      countRaw ? parseInt(countRaw, 10) :
                 1;

    let m = `Element count`;
    expect(collection, m).to.have.length(count);

    collection.forEach((element, i) => {
      m = `Element #${i} (zero-indexed) visibility`;
      expect(isVisible(element), m).to.be.true;
    });
  },

  "Then I should see (NO |no )?(?:(\\d+) )?$opinionatedElement"(no, countRaw, [collection, label, selector]) {
    return steps["Then (?:(\\d+) )?$opinionatedElement should (NOT |not )?be visible"](countRaw, [collection, label, selector], no);
  },

  "Then $opinionatedElement should (NOT |not )?(?:have text|say) \"$text\""([collection/* , label, selector */], not, text) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    not
      ? expect(collection[0].textContent.trim()).not.equal(text)
      : expect(collection[0].textContent.trim()).equal(text);
  },

  "Then $opinionatedElement should (NOT |not )?have HTML class \"(.*)\""([collection/* , label, selector */], not, text) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    not
      ? expect(collection[0]).not.to.have.class(text)
      : expect(collection[0]).to.have.class(text);
  },

  "Then $opinionatedElement should (NOT |not )?have HTML attr \"(.+?)\"(?: with value \"(.+?)\")?"([collection/* , label, selector */], not, attrName, attrValue) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    not
      ? expect(collection[0]).not.to.have.attr(attrName, attrValue)
      : expect(collection[0]).to.have.attr(attrName, attrValue);
  },

  "Then record of type (\\w+) and id (\\w+) should have attribute (\\w+) with value (.+)"(typeRaw, idStr, key, valueRaw) {
    const typePlural = pluralize(camelize(typeRaw));

    const collection = server.db[typePlural];
    assert(`Collection ${typeRaw} does not exist in Mirage DB`, collection);

    const value = (() => {
      try {
        return JSON.parse(valueRaw);
      } catch (e) {
        throw new Error("Invalid JSON passed as value");
      }
    })();

    const record = collection.find(idStr);
    assert(`Record of type ${typeRaw} with id ${idStr} not found in Mirage DB`, record);

    expect(record[key]).deep.equal(value);
  },

  "Then radio button \"(.+?)\" should be selected in $opinionatedElement"(text, [collection/* , label, selector */]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    const radioButton = findRadioForLabelWithText(element, text);

    return radioButton.checked;
  }

};

export default steps;
