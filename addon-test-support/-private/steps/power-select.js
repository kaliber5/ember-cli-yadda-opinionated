import { expect } from 'chai';
import { assert }  from '@ember/debug';
import { currentURL, pauseTest, settled } from '@ember/test-helpers';
import { isVisible, pause } from 'ember-cli-yadda-opinionated/test-support/-private/helpers';

import {
  powerSelectFindTrigger,
  powerSelectFindOptions,
  powerSelectIsDropdownExpanded,
  powerSelectExpand,
  powerSelectCollapse
} from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

const steps = {

  async "Then there should be (NO|no )?(?:(\\d+) )items? in the dropdown $opinionatedElement"(no, countRaw, [collection, label, selector]) {
    assert(`Don't use NO and number at the same time, step: \`${this.step}\``, !(no && countRaw));
    assert(`Expected a single element, but ${collection.length} found.\nLabel: ${label}\nSelector: ${selector}\nStep: ${this.step}`, collection.length === 1);

    const count =
      no       ? 0                      :
      countRaw ? parseInt(countRaw, 10) : 0;

    assert(`Must use either "NO" or number, step: \`${this.step}\``, count !== undefined);

    const trigger = powerSelectFindTrigger(collection[0]);
    const isExpanded = powerSelectIsDropdownExpanded(trigger);

    if (!isExpanded) {
      await powerSelectExpand(trigger);
    }

    const options = powerSelectFindOptions(trigger);
    expect(options, this.step).to.have.length(count);

    // Restore the original state
    if (!isExpanded) {
      await powerSelectCollapse(trigger);
    }
  },

};

export default steps;
