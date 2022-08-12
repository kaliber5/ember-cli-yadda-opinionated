/* global server */

import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { currentURL, pauseTest, settled } from '@ember/test-helpers';
import { isVisible, pause } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';
import { findEditable, findInputForLabelWithText } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';
import { camelize }  from '@ember/string';
import { pluralize } from 'ember-inflector';
import isSubset from 'is-subset/module';
import { STR_STRING_WITH_ESCAPE as opinonatedString } from '../regex';

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

  async "Then I should (?:still )?be (?:at|on) URL $opinionatedString"(url) {
    await settled();
    expect(currentURL()).to.equal(url);
  },

  async "Then current URL's pathname should be $opinionatedString"(pathname) {
    await settled();
    const url = new URL(currentURL(), location.origin);
    expect(url.pathname).to.equal(pathname);
  },

  async "Then current URL should (not |NOT )?have query param $opinionatedString"(not, key) {
    await settled();
    const url = new URL(currentURL(), location.origin);
    expect(url.searchParams.has(key)).to.equal(!!not);
  },

  async "Then current URL should (not |NOT )?have query param $opinionatedString with value $opinionatedString"(not, key, expectedValue) {
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

  "Then (?:(\\d+) )?$opinionatedElement should (not |NOT )?be visible"(countRaw, [collection/* , label, selector */], no) {
    const count =
      countRaw ? parseInt(countRaw, 10) :
                 1;
    const countVisible = collection.filter(element => isVisible(element)).length;
    if (no) {
      if (countRaw !== undefined) {
        // check exact match of invisible elements
        expect(collection.length - countVisible, 'Invisible element count').to.equal(count);
      } else {
        // check no element is visible
        expect(countVisible, 'Visible element count').to.equal(0);
      }
    } else {
      expect(countVisible, 'Visible element count').to.equal(count);
    }
  },

  "Then I should see (NO |no )?(?:(\\d+) )?$opinionatedElement"(no, countRaw, [collection, label, selector]) {
    return steps["Then (?:(\\d+) )?$opinionatedElement should (not |NOT )?be visible"](countRaw, [collection, label, selector], no);
  },

  "Then $opinionatedElement should (not |NOT )?(?:have text|say|be) \"(.*)\""([collection/* , label, selector */], not, text) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const [element] = collection;

    if (element.matches("input, textarea")) {
      not
        ? expect(element).not.to.have.value(text)
        : expect(element).to.have.value(text);
    } else {
      not
        ? expect(element).not.to.have.trimmed.text(text)
        : expect(element).to.have.trimmed.text(text);
    }
  },

  "Then $opinionatedElement should (not |NOT )?(?:match|have text matching) /(.*)/"([collection/* , label, selector */], not, regexString) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const regex = new RegExp(regexString);
    const [element] = collection;

    const text =
      element.matches("input, textarea")
        ? element.value
        : element.textContent.trim();

    not
      ? expect(regex.test(text)).false
      : expect(regex.test(text)).true;
  },

  "Then $opinionatedElement should (not |NOT )?have the following text:\n$opinionatedText"() {
    return steps["Then $opinionatedElement should (not |NOT )?(?:have text|say|be) \"(.*)\""](...arguments);
  },

  "Then $opinionatedElement should (not |NOT )?have the following text with collapsed whitespace: $opinionatedString"([collection/* , label, selector */], not, expectedText) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const [element] = collection;
    const actualText = element.textContent.trim().replace(/\s+/g, ' ');

    not
      ? expect(actualText).not.equal(expectedText)
      : expect(actualText).equal(expectedText);
  },

  "Then $opinionatedElement should (not |NOT )?have the following text with collapsed whitespace:\n$opinionatedText"([collection/* , label, selector */], not, expectedText) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const [element] = collection;
    const actualText = element.textContent.trim().replace(/\s+/g, ' ');
    expectedText = expectedText.trim().replace(/\s+/g, ' ');

    not
      ? expect(actualText).not.equal(expectedText.trim())
      : expect(actualText).equal(expectedText.trim());
  },

  "Then $opinionatedElement should (not |NOT )?have value \"(.*)\""([collection/* , label, selector */], not, value) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const element = collection[0];
    const target = findEditable(element, false);

    not
      ? expect(target).not.to.have.value(value)
      : expect(target).to.have.value(value);
  },

  "Then $opinionatedElement should (not |NOT )?have HTML class \"(.*)\""([collection/* , label, selector */], not, text) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    not
      ? expect(collection[0]).not.to.have.class(text)
      : expect(collection[0]).to.have.class(text);
  },

  [`Then $opinionatedElement should (not |NOT )?have HTML attr $opinionatedString(?: with value ${opinonatedString})?`]([collection/* , label, selector */], not, attrName, attrValue) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    not
      ? expect(collection[0]).not.to.have.attr(attrName, attrValue)
      : expect(collection[0]).to.have.attr(attrName, attrValue);
  },

  [`Then $opinionatedElement should (not |NOT )?have HTML attr $opinionatedString with value matching /(.*)/`]([collection/* , label, selector */], not, attrName, regexString) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const regex = new RegExp(regexString);
    const [element] = collection;

    const text = element.getAttribute(attrName);

    if (not && text == null) {
      return;
    }

    not
      ? expect(regex.test(text)).false
      : expect(regex.test(text)).true;
  },

  "Then $opinionatedElement should (not |NOT )?have CSS property $opinionatedString with value $opinionatedString"([collection/* , label, selector */], not, propName, expectedValue) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const actualValue = collection[0].style[camelize(propName)];

    not
      ? expect(actualValue).not.equal(expectedValue)
      : expect(actualValue).equal(expectedValue);
  },

  "Then record of type $opinionatedString and id $opinionatedString should have attribute $opinionatedString with value $opinionatedJSON"(typeRaw, idStr, key, value) {
    const typePlural = pluralize(camelize(typeRaw));

    const collection = server.db[typePlural];
    assert(`Collection ${typeRaw} does not exist in Mirage DB`, collection);

    const record = collection.find(idStr);
    assert(`Record of type ${typeRaw} with id ${idStr} not found in Mirage DB`, record);

    expect(record[key]).deep.equal(value);
  },

  "Then (?:the )?(?:radio button|checkbox) $opinionatedElement should (not |NOT )?be selected"([collection/* , label, selector */], not) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    let input;

    if (element.type === 'checkbox' || element.type === 'radio') {
      input = element;
    } else {
      const inputs = element.querySelectorAll('input[type="radio"], input[type="checkbox"]');
      assert(`Expected one checkbox/radio, but ${inputs.length} found`, inputs.length === 1);
      [input] = inputs;
    }

    not
      ? expect(input.checked).to.be.false
      : expect(input.checked).to.be.true;
  },

  "Then (?:the )?(?:radio button|checkbox) $opinionatedString should (not |NOT )?be selected in $opinionatedElement"(text, not, [collection/* , label, selector */]) {
    if (not && !collection.length) {
      return;
    }

    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    const input = findInputForLabelWithText(text, element);

    assert('Expected input to exist', input)
    assert('Expected input to be a checkbox or radio button', input.type === 'checkbox' || input.type === 'radio');

    not
      ? expect(input.checked).to.be.false
      : expect(input.checked).to.be.true;
  },

  "Then local storage value for $opinionatedString should (not |NOT )?be equal to $opinionatedString"(key, not, expectedValue) {
    const actualValue = window.localStorage.getItem(key);

    not
      ? expect(actualValue).not.to.equal(expectedValue)
      : expect(actualValue).to.equal(expectedValue);
  },

  "Then local storage value for $opinionatedString should (not |NOT )be equal to the following value:\n$opinionatedText":
    "Then local storage value for $opinionatedString should (not |NOT )?be equal to $opinionatedString",

  "Then local storage value for $opinionatedString should (not |NOT )be deeply equal to the following JSON:\n$opinionatedJSON"(key, not, expectedJSON) {
    const actualJSON = JSON.parse(window.localStorage.getItem(key));

    not
      ? expect(actualJSON).not.to.deep.equal(expectedJSON)
      : expect(actualJSON).to.deep.equal(expectedJSON);
  },

  "Then local storage value for $opinionatedString should (not |NOT )be a subset of the following JSON:\n$opinionatedJSON"(key, not, superset) {
    const subset = JSON.parse(window.localStorage.getItem(key));
    const result = isSubset(superset, subset);

    not
      ? expect(result).to.be.false
      : expect(result).to.be.true;
  },

  "Then local storage value for $opinionatedString should (not |NOT )be a superset of the following JSON:\n$opinionatedJSON"(key, not, subset) {
    const superset = JSON.parse(window.localStorage.getItem(key));
    const result = isSubset(superset, subset);

    not
      ? expect(result).to.be.false
      : expect(result).to.be.true;
  },

  "Then local storage key $opinionatedString should (not |NOT )?exist"(key, not) {
    const result = window.localStorage.getItem(key);

    not
      ? expect(result).to.be.null
      : expect(result).not.to.be.null;
  },

  "Then local storage should (not |NOT )?be empty"(not) {
    const result = window.localStorage.key(0);

    not
      ? expect(result).not.to.be.null
      : expect(result).to.be.null;
  },
};

export default steps;
