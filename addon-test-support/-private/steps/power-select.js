import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { click, currentURL, pauseTest, settled } from '@ember/test-helpers';
import { getIndexZero, isVisible, pause } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';

import {
  powerSelectFindTrigger,
  powerSelectFindOptions,
  powerSelectIsDropdownExpanded,
  powerSelectExpand,
  powerSelectCollapse,
  powerSelectFindOptionByValueOrSelector
} from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

const steps = {

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

  async "Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item in the dropdown $opinionatedElement should (NOT |not )?(?:have text|say) \"(.*)\""(indexOneStr, ordinal, [collection], not, text) {
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

  async "When I select (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item \"(.+)\" in the dropdown $opinionatedElement"(indexOneStr, ordinal, text, [collection]) {
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

  "Then the dropdown $opinionatedElement should have \"(.*)\" selected"([collection], text) {
    assert(`Expected a single element, but ${collection.length} found.`, collection.length === 1);

    const trigger = powerSelectFindTrigger(collection[0]);

    expect(trigger).to.have.trimmed.text(text);
  },

};

export default steps;
