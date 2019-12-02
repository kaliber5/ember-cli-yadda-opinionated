import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { click } from '@ember/test-helpers';
import { getIndexZero } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';

import {
  powerSelectFindTrigger,
  powerSelectFindOptions,
  powerSelectFindSelectedOptions,
  powerSelectFilterSelectedOptionsByText,
  powerSelectRemoveSelectedOption,
  powerSelectIsSelectedOptionDisabled,
  powerSelectIsDropdownExpanded,
  powerSelectExpand,
  powerSelectCollapse,
  powerSelectFindOptionByValueOrSelector
} from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

const steps = {

  async "Then the dropdown $opinionatedElement should (not|NOT)? ?be disabled"([collection/* , label, selector */], not) {
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);
    const [element] = collection;
    const trigger = powerSelectFindTrigger(element);
    assert('Trigger not found', trigger);

    not
      ? expect(trigger).not.to.have.attr('aria-disabled')
      : expect(trigger).to.have.attr('aria-disabled');
  },

  async "Then there should be (NO|no )?(?:(\\d+) )items? in the dropdown $opinionatedElement"(no, countStr, [collection/* , label, selector */]) {
    assert("Don't use NO and number at the same time", !(no && countStr));
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const count =
      no       ? 0                      :
      countStr ? parseInt(countStr, 10) : 0;

    assert(`Must use either "NO" or number`, count !== undefined);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const options = powerSelectFindOptions(trigger);
    expect(options).to.have.length(count);

    // Restore the original state
    if (!isExpanded) {
      await powerSelectCollapse(trigger);
    }
  },

  async "Then there should be (NO|no )?(?:(\\d+) )selected items? in the dropdown $opinionatedElement"(no, countStr, [collection/* , label, selector */]) {
    assert("Don't use NO and number at the same time", !(no && countStr));
    assert(`Expected a single element, but ${collection.length} found`, collection.length === 1);

    const count =
      no       ? 0                      :
      countStr ? parseInt(countStr, 10) : 0;

    assert(`Must use either "NO" or number`, count !== undefined);

    const trigger = powerSelectFindTrigger(collection[0]);
    const selectedOptions = powerSelectFindSelectedOptions(trigger);

    expect(selectedOptions).to.have.length(count);
  },

  async "Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item in the dropdown $opinionatedElement should (not|NOT)? ?(?:have text|say|be) \"(.*)\""(indexOneStr, ordinal, [collection], not, text) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const options = powerSelectFindOptions(trigger);

    assert(`Expected the dropdown to have at least ${indexZero + 1} elements.`, options.length >= indexZero + 1);

    not
      ? expect(options[indexZero].textContent.trim()).not.equal(text)
      : expect(options[indexZero].textContent.trim()).equal(text);

    // Restore the original state
    if (!isExpanded) {
      await powerSelectCollapse(trigger);
    }
  },

  async "Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item in the dropdown $opinionatedElement should be disabled"(indexOneStr, ordinal, [collection]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const options = powerSelectFindOptions(trigger);

    assert(`Expected the dropdown to have at least ${indexZero + 1} elements.`, options.length >= indexZero + 1);

    expect(options[indexZero]).to.have.attr('aria-disabled');

    if (!isExpanded) {
      await powerSelectCollapse(trigger);
    }
  },

  async "Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item $opinionatedString in the dropdown $opinionatedElement should be disabeld"(indexOneStr, ordinal, text, [collection]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const option = powerSelectFindOptionByValueOrSelector(trigger, text, indexZero);
    expect(option).to.have.attr('aria-disabled');

    if (!isExpanded) {
      await powerSelectCollapse(trigger);
    }
  },

  async "When I select (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item in the dropdown $opinionatedElement"(indexOneStr, ordinal, [collection]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const options = powerSelectFindOptions(trigger);

    assert(`Expected the dropdown to have at least ${indexZero + 1} elements.`, options.length >= indexZero + 1);

    return click(options[indexZero]);
  },

  async "When I select (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item $opinionatedString in the dropdown $opinionatedElement"(indexOneStr, ordinal, text, [collection]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const option = powerSelectFindOptionByValueOrSelector(trigger, text, indexZero);
    return click(option);
  },

  async "When I deselect (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item in the dropdown $opinionatedElement"(indexOneStr, ordinal, [collection]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);
    const selectedOptions = powerSelectFindSelectedOptions(trigger);

    assert(`Expected at least ${indexZero + 1} selected option, but ${selectedOptions.length} found`, selectedOptions.length >= indexZero + 1);

    return powerSelectRemoveSelectedOption(selectedOptions[indexZero]);
  },

  async "When I deselect (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item $opinionatedString in the dropdown $opinionatedElement"(indexOneStr, ordinal, text, [collection]) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    const selectedOptions = powerSelectFindSelectedOptions(trigger);
    const filteredSelectedOptions = powerSelectFilterSelectedOptionsByText(selectedOptions, text);

    assert(`Expected at least ${indexZero + 1} selected option to have text "${text}", but ${filteredSelectedOptions.length} found`, filteredSelectedOptions.length >= indexZero + 1);

    return powerSelectRemoveSelectedOption(filteredSelectedOptions[indexZero]);
  },

  async "Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item in the dropdown $opinionatedElement should (not|NOT)? ?be disabled"(indexOneStr, ordinal, [collection], not) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);
    const selectedOptions = powerSelectFindSelectedOptions(trigger);

    assert(`Expected at least ${indexZero + 1} selected option, but ${selectedOptions.length} found`, selectedOptions.length >= indexZero + 1);

    const result = powerSelectIsSelectedOptionDisabled(selectedOptions[indexZero]);

    return not ? !result : result;
  },

  async "Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item $opinionatedString in the dropdown $opinionatedElement should (not|NOT)? ?be disabled"(indexOneStr, ordinal, text, [collection], not) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);
    const indexZero = getIndexZero(ordinal, indexOneStr, 0);

    const selectedOptions = powerSelectFindSelectedOptions(trigger);
    const filteredSelectedOptions = powerSelectFilterSelectedOptionsByText(selectedOptions, text);

    assert(`Expected at least ${indexZero + 1} selected option to have text "${text}", but ${filteredSelectedOptions.length} found`, filteredSelectedOptions.length >= indexZero + 1);

    const result = powerSelectIsSelectedOptionDisabled(filteredSelectedOptions[indexZero]);

    return not ? !result : result;
  },

  "Then the dropdown $opinionatedElement should have \"(.*)\" selected"([collection], text) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);
    const [element] = collection;
    const trigger = powerSelectFindTrigger(element);
    assert('Power Select Trigger not found', trigger);

    expect(trigger).to.have.trimmed.text(text);
  },

};

export default steps;
