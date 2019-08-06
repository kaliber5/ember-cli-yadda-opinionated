import { assert } from '@ember/debug';
import { find, findAll, settled } from "@ember/test-helpers";
import { REGEX_SELECTOR_MAYBE_WITH_EQ, REGEX_SELECTOR_WITH_EQ } from 'ember-cli-yadda-opinionated/test-support/-private/regex';
import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';
import { click, doubleClick, fillIn, triggerEvent, triggerKeyEvent } from '@ember/test-helpers';



export function findSelfOrChild (elementOrSelector, htmlClass) {
  const childSelector = `.${htmlClass}`;

  if (elementOrSelector instanceof HTMLElement) {
    if (elementOrSelector.classList.contains(htmlClass)) {
      return elementOrSelector;
    } else {
      return elementOrSelector.querySelector(childSelector);
    }
  } else {
    return find(`${elementOrSelector} ${childSelector}`);
  }
}



export function findByLabel(label) {
  const selectorCompound = selectorFromLabel(label);

  const selectorsMaybeWithEq =
    selectorCompound
      .split(REGEX_SELECTOR_WITH_EQ)
      .filter((substr) => substr && substr.length > 0);

  const {collection} = selectorsMaybeWithEq.reduce(({collection, parentSelector}, childSelectorMaybeWithEq) => {
    const [childSelectorWithoutEq, index] = _parseSelectorMaybeWithEq(childSelectorMaybeWithEq);
    const childSelectorWithoutEqFull = `${parentSelector} ${childSelectorWithoutEq}`;

    return {
      collection: _findElements(collection, childSelectorWithoutEqFull, index),
      parentSelector: childSelectorWithoutEqFull,
    };
  }, {collection: null, parentSelector: ''});

  const result = [collection, label, selectorCompound];
  result.__isLabelTuple__ = true;
  return result;
}

function _findElements(parentCollection, selector, index) {
  let resulingCollection =
    parentCollection
      ? parentCollection
          .map(parent => _findElement(parent, selector, index))
          .reduce((a, b) => a.concat(b), []) // flatten
          .filter((a) => a) // compact
      : _findElement(null, selector, index);

  return index == null
    ? resulingCollection
    : [resulingCollection[index]].filter((a) => a); // compact
}

function _parseSelectorMaybeWithEq(selectorMaybeWithEq) {
  const matchResult = selectorMaybeWithEq.match(REGEX_SELECTOR_MAYBE_WITH_EQ);
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



export function findAllByLabel(label) {
  return findByLabel(label)[0];
}



export function findSingleByLabel(label) {
  const [collection,, selector] = findByLabel(label);
  assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\n\n`, collection.length === 1);

  return collection[0];
}



export function clickByLabel(label) {
  const element = findSingleByLabel(label);
  return click(element);
}



export function doubleClickByLabel(label) {
  const element = findSingleByLabel(label);
  return doubleClick(element);
}



export function fillInByLabel(label, text) {
  const element = findSingleByLabel(label);
  const target = findEditable(element);
  return fillIn(target, text);
}



export function triggerByLabel(label, eventName, options) {
  const element = findSingleByLabel(label);
  return triggerEvent(element, eventName, options);
}



export function mouseEnterByLabel(label) {
  const element = findSingleByLabel(label);
  return triggerEvent(element, 'mouseenter');
}



export function mouseLeaveByLabel(label) {
  const element = findSingleByLabel(label);
  return triggerEvent(element, 'mouseleave');
}



export function triggerKeyByLabel(label, eventType, key, modifiers) {
  const element = findSingleByLabel(label);
  return triggerKeyEvent(element, eventType, key, modifiers);
}



export function findEditable(element, includeContentEditable = true) {
  const selectors = [
    'textarea',
    'input:not([hidden])',
    'select',
    ...(includeContentEditable ? ['[contenteditable]'] : []),
  ];

  if (selectors.some(selector => element.matches(selector))) {
    return element;
  } else {
    const children = element.querySelectorAll(selectors.join(', '));
    assert(`Expected element to be fillable or have exactly one fillable child, but ${children.length} fillable children found`, children.length === 1);
    return children[0];
  }
}



export function findInputForLabelWithText(text, parent) {

  let labels =
    _findElement(parent, 'label')
      .filter(el => el.textContent.trim() === text);

  assert(`Expected to find exactly one label with text content "${text}", but ${labels.length} found`, labels.length === 1);

  const [label] = labels;
  const id = label.getAttribute('for');

  let input;

  if (id) {
    input = document.getElementById(id);
    assert(`Label with text "${text} had an attr for="${id}", but no input with such id found in element`, input);
  } else {
    const inputs = _findElement(parent, 'input')
    assert(`Expected to find exactly one input inside label with text "${text}", but ${inputs.length} found`, inputs.length === 1);
    input = inputs[0];
  }

  return input;
}



// https://github.com/cibernox/ember-power-select/blob/v2.2.1/addon-test-support/index.js

const POWER_SELECT_TRIGGER_CLASS = 'ember-power-select-trigger';
const POWER_SELECT_DROPDOWN_PLACEHOLDER_CLASS = 'ember-basic-dropdown-content-placeholder';
const POWER_SEELCT_OPTIONS_SELECTOR = '.ember-power-select-options';
const POWER_SEELCT_OPTION_SELECTOR = '.ember-power-select-option';
const POWER_SEELCT_MULTIPLE_OPTIONS_SELECTOR = '.ember-power-select-multiple-options';
const POWER_SEELCT_MULTIPLE_OPTION_SELECTOR = '.ember-power-select-multiple-option';
const POWER_SEELCT_MULTIPLE_OPTION_DISABLED_CLASS = 'ember-power-select-multiple-option--disabled';
const POWER_SELECT_MULTIPLE_OPTION_REMOVE_BUTTON_SELECTOR = '.ember-power-select-multiple-remove-btn';
const powerSelectDropdownIdForTrigger = (trigger) => trigger.attributes['aria-owns'] && `${trigger.attributes['aria-owns'].value}`;



export function powerSelectFindTrigger(elementOrSelector) {
  const result = findSelfOrChild(elementOrSelector, POWER_SELECT_TRIGGER_CLASS);

  assert(`Element with class ${POWER_SELECT_TRIGGER_CLASS} not found in ${elementOrSelector}`, result);

  return result;
}



export function powerSelectIsTriggerDisabled(trigger) {
  assert('ember-power-select trigger expected', trigger);
  const attr = trigger.getAttribute('aria-disabled');
  return attr === '' || !!attr;
}



export function powerSelectFindDropdown(trigger) {
  assert('ember-power-select trigger expected', trigger);

  const dropdownId = powerSelectDropdownIdForTrigger(trigger)
  const dropdown = find(`#${dropdownId}`);

  assert('ember-power-select dropdown not found. Not expanded?', dropdown);

  return dropdown;
}


export function powerSelectFindOptions(trigger) {
  const dropdown = powerSelectFindDropdown(trigger);
  const options = dropdown.querySelectorAll(POWER_SEELCT_OPTION_SELECTOR);
  return Array.from(options);
}



export function powerSelectFindSelectedOptions(trigger) {
  const list = trigger.querySelector(POWER_SEELCT_MULTIPLE_OPTIONS_SELECTOR);
  assert(`${POWER_SEELCT_MULTIPLE_OPTIONS_SELECTOR} not found. Power Select is not in multiple mode?`, list);
  const options = list.querySelectorAll(POWER_SEELCT_MULTIPLE_OPTION_SELECTOR);
  return Array.from(options);
}



export function powerSelectFilterSelectedOptionsByText(selectedOptions, text) {
  return selectedOptions.filter(selectedOption => {
    let trimmedText = selectedOption.textContent.trim();

    trimmedText =
      powerSelectIsSelectedOptionDisabled(selectedOption)
        ? trimmedText
        : trimmedText.slice(1).trim(); // remove the deselect button from text

    return trimmedText === text;
  });
}



export function powerSelectIsSelectedOptionDisabled(option) {
  return option.classList.contains(POWER_SEELCT_MULTIPLE_OPTION_DISABLED_CLASS);
}



export function powerSelectRemoveSelectedOption(option) {
  assert('Attempted to deselect a locked selected option', !powerSelectIsSelectedOptionDisabled(option));

  const removeButton = option.querySelector(POWER_SELECT_MULTIPLE_OPTION_REMOVE_BUTTON_SELECTOR);
  return click(removeButton);
}



export function powerSelectIsDropdownExpanded(trigger) {
  const dropdown = powerSelectFindDropdown(trigger);
  return dropdown && !dropdown.classList.contains(POWER_SELECT_DROPDOWN_PLACEHOLDER_CLASS);
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


export function powerSelectFindOptionByValueOrSelector(trigger, valueOrSelector, optionIndex = 0) {
  const options = powerSelectFindOptions(trigger);
  let target;

  let potentialTargets = options.filter((opt) => opt.textContent.indexOf(valueOrSelector) > -1);
  if (potentialTargets.length === 0) {
    const selector =`${POWER_SEELCT_OPTIONS_SELECTOR} ${valueOrSelector}`;
    try {
      potentialTargets = trigger.querySelectorAll(selector);
    } catch (e) {
      if (e.message.includes("Failed to execute 'querySelectorAll'")) {
        throw new Error(`Option "${valueOrSelector}" not found in PowerSelect`);
      } else {
        throw e;
      }
    }
  }

  if (potentialTargets.length > 1) {
    const filteredTargets = potentialTargets.filter((t) => t.textContent.trim() === valueOrSelector);
    target = filteredTargets[optionIndex] || potentialTargets[optionIndex];
  } else {
    target = potentialTargets[0];
  }

  if (!target) {
    throw new Error(`Option ${valueOrSelector} not found in Power Select`);
  }

  return target;
}


export function powerSelectFindTriggerByLabel(label) {
  const element = findSingleByLabel(label);
  return powerSelectFindTrigger(element);
}


export function powerSelectFindDropdownByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectFindDropdown(trigger);
}


export async function powerSelectFindOptionsByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  const isExpanded = powerSelectIsDropdownExpanded(trigger);

  if (!isExpanded) {
    await powerSelectExpand(trigger);
  }

  return powerSelectFindOptions(trigger);
}


export async function powerSelectSelectOptionByLabelAndIndex(label, index) {
  const options = await powerSelectFindOptionsByLabel(label);

  assert(`Expected number of options to be greater than index ${index}, was ${options.length}, label: ${label}`, options.length > index);

  return click(options[index]);
}


export function powerSelectFindSelectedOptionsByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectFindSelectedOptions(trigger);
}


export function powerSelectFilterSelectedOptionsByLabelAndText(label, text) {
  const selectedOptions = powerSelectFindSelectedOptionsByLabel(label);
  return powerSelectFilterSelectedOptionsByText(selectedOptions, text);
}


export async function powerSelectIsSelectedOptionDisabledByLabelAndIndex(label, index) {
  const selectedOptions = powerSelectFindSelectedOptionsByLabel(label);

  assert(`Expected number of selected options to be greater than index ${index}, was ${selectedOptions.length}, label: ${label}`, selectedOptions.length > index);

  const selectedOption = selectedOptions[index];

  return powerSelectIsSelectedOptionDisabled(selectedOption);
}


export function powerSelectIsSelectedOptionDisabledByLabelAndText(label, text) {
  const selectedOptions = powerSelectFilterSelectedOptionsByText(label, text);
  assert(`Expected exactly 1 selected option to match text "${text}, was ${selectedOptions.length}, label: ${label}`, selectedOptions.length === 1);
  const selectedOption = selectedOptions[0];
  return powerSelectIsSelectedOptionDisabled(selectedOption);
}


export function powerSelectIsTriggerDisabledByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectIsTriggerDisabled(trigger);
}


export function powerSelectRemoveSelectedOptionByLabelAndIndex(label, index) {
  const selectedOptions = powerSelectFindSelectedOptionsByLabel(label);

  assert(`Expected number of selected options to be greater than index ${index}, was ${selectedOptions.length}, label: ${label}`, selectedOptions.length > index);

  const selectedOption = selectedOptions[index];

  return powerSelectRemoveSelectedOption(selectedOption);
}


export function powerSelectRemoveSelectedOptionByLabelAndText(label, text) {
  const selectedOptions = powerSelectFilterSelectedOptionsByText(label);
  assert(`Expected exactly 1 selected option to match text "${text}, was ${selectedOptions.length}, label: ${label}`, selectedOptions.length === 1);
  const selectedOption = selectedOptions[0];
  return powerSelectRemoveSelectedOption(selectedOption);
}


export function powerSelectIsDropdownExpandedByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectIsDropdownExpanded(trigger);
}


export function powerSelectExpandByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectExpand(trigger);
}


export function powerSelectCollapseByLabel(label) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectCollapse(trigger);
}


export function powerSelectFindOptionByLabelAndValue(label, valueOrSelector, optionIndex) {
  const trigger = powerSelectFindTriggerByLabel(label);
  return powerSelectFindOptionByValueOrSelector(trigger, valueOrSelector, optionIndex);
}




const POWER_DATE_PICKER_TRIGGER_CLASS = 'ember-power-datepicker-trigger';
export const POWER_DATE_PICKER_DROPDOWN_SELECTOR = '.ember-power-datepicker-content';

export function powerDatePickerFindTrigger (triggerOrSelector) {
  let result = findSelfOrChild(triggerOrSelector, POWER_DATE_PICKER_TRIGGER_CLASS);

  assert(`Element with class ${POWER_DATE_PICKER_TRIGGER_CLASS} not found in ${triggerOrSelector}`, result);

  return result;
}



export function powerDatePickerFindDropdown() {
  return find(POWER_DATE_PICKER_DROPDOWN_SELECTOR);
}


export function powerDatePickerFindTriggerByLabel(label) {
  const element = findSingleByLabel(label);
  return powerDatePickerFindTrigger(element);
}
