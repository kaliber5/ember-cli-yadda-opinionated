import { assert } from '@ember/debug';
import { find, findAll, settled } from "@ember/test-helpers";
import { REGEX_SELECTOR_WITH_EQ } from 'ember-cli-yadda-opinionated/test-support/-private/regex';
import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';
import { click, fillIn } from '@ember/test-helpers';



export function findByLabel(label) {
  const selectorCompound = selectorFromLabel(label);
  const selectorsMaybeWithEq = selectorCompound.split(/\s+/);

  const collection = selectorsMaybeWithEq.reduce((parentCollection, selectorMaybeWithEq) => {
    return _findElements(parentCollection, selectorMaybeWithEq);
  }, null);

  const result = [collection, label, selectorCompound];
  result.__isLabelTuple__ = true;
  return result;
}

function _findElements(parentCollection, selectorMaybeWithEq) {
  const [selector, index] = _parseSelectorMaybeWithEq(selectorMaybeWithEq);

  let resulingCollection =
    parentCollection
      ? parentCollection
          .map(parent => _findElement(parent, selector))
          .reduce((a, b) => a.concat(b), []) // flatten
          .filter((a) => a) // compact
      : _findElement(null, selector, index);

  return index == null
    ? resulingCollection
    : [resulingCollection[index]].filter((a) => a); // compact
}

function _parseSelectorMaybeWithEq(selectorMaybeWithEq) {
  const matchResult = selectorMaybeWithEq.match(REGEX_SELECTOR_WITH_EQ);
  assert(`findByLabel failed to parse a selector: "${selectorMaybeWithEq}"`, matchResult);
  const [, selector, indexRaw] = matchResult;
  const index = indexRaw && parseInt(indexRaw, 10);
  return [selector, index];
}

function _findElement(parent, selector) {
  const collection =
    parent
      ? parent.querySelectorAll(selector)
      : findAll(selector);

  return [...collection]; // cast NodeList to Array
}



export function clickByLabel(label) {
  const [collection,, selector] = findByLabel(label);
  assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}`, collection.length === 1);
  return click(collection[0]);
}



export function fillInByLabel(label, text) {
  const [collection,, selector] = findByLabel(label);
  assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}`, collection.length === 1);
  return fillIn(collection[0], text);
}



// https://github.com/cibernox/ember-power-select/blob/v2.2.1/addon-test-support/index.js

const EMBER_POWER_SELECT_TRIGGER_CLASS = 'ember-power-select-trigger';
const EMBER_POWER_SELECT_TRIGGER_SELECTOR = `.${EMBER_POWER_SELECT_TRIGGER_CLASS}`;
const EMBER_POWER_SELECT_DROPDOWN_PLACEHOLDER_CLASS = 'ember-basic-dropdown-content-placeholder';
const EMBER_POWER_SEELCT_OPTION_CLASS = '.ember-power-select-option';
const powerSelectDropdownIdForTrigger = (trigger) => trigger.attributes['aria-owns'] && `${trigger.attributes['aria-owns'].value}`;



export function powerSelectFindTrigger(cssPathOrTrigger) {
  if (cssPathOrTrigger instanceof HTMLElement) {
    if (cssPathOrTrigger.classList.contains(EMBER_POWER_SELECT_TRIGGER_CLASS)) {
      return cssPathOrTrigger;
    } else {
      return cssPathOrTrigger.querySelector(EMBER_POWER_SELECT_TRIGGER_SELECTOR);
    }
  } else {
    let trigger = find(`${cssPathOrTrigger} ${EMBER_POWER_SELECT_TRIGGER_SELECTOR}`);

    if (!trigger) {
      trigger = find(cssPathOrTrigger);
    }

    if (!trigger) {
      throw new Error("Power select not found");
    }

    return trigger;
  }
}



export function powerSelectFindDropdown(trigger) {
  const dropdownId = powerSelectDropdownIdForTrigger(trigger)
  const dropdown = find(`#${dropdownId}`);

  assert('ember-power-select dropdown not found. Not expanded?', dropdown);

  return dropdown;
}


export function powerSelectFindOptions(trigger) {
  const dropdown = powerSelectFindDropdown(trigger);
  return dropdown.querySelectorAll(EMBER_POWER_SEELCT_OPTION_CLASS);
}



export function powerSelectIsDropdownExpanded(trigger) {
  const dropdown = powerSelectFindDropdown(trigger);
  return dropdown && !dropdown.classList.contains(EMBER_POWER_SELECT_DROPDOWN_PLACEHOLDER_CLASS);
}



export async function powerSelectExpand(trigger) {
  // If the dropdown is closed, open it
  if (!powerSelectIsDropdownExpanded(trigger)) {
    await click(trigger);
    await settled();
  }
}



export async function powerSelectCollapse(trigger) {
  // If the dropdown is opened, close it
  if (powerSelectIsDropdownExpanded(trigger)) {
    await click(trigger);
    await settled();
  }
}
