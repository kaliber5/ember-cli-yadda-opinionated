import composeSteps from 'ember-cli-yadda-opinionated/test-support/-private/compose-steps';
import { element } from 'ember-cli-yadda-opinionated/test-support/-private/converters';

import {
  REGEX_LABEL
} from 'ember-cli-yadda-opinionated/test-support/-private/regex';

import {
  clickByLabel,
  doubleClickByLabel,
  fillInByLabel,
  findByLabel,
  findAllByLabel,
  findSingleByLabel,
  mouseEnterByLabel,
  mouseLeaveByLabel,
  triggerByLabel,
  triggerKeyByLabel
} from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';

import { labelMap, transformsMap } from 'ember-cli-yadda-opinionated/test-support/-private/maps';
import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';
import setupDictionary from 'ember-cli-yadda-opinionated/test-support/-private/setup-dictionary';
import givenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/given';
import powerDatePickerSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/power-date-picker';
import powerSelectSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/power-select';
import thenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/then';
import whenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/when';

const opinionatedSteps = {...givenSteps, ...whenSteps, ...thenSteps};

export {
  clickByLabel,
  doubleClickByLabel,
  composeSteps,
  element,
  fillInByLabel,
  findByLabel,
  findAllByLabel,
  findSingleByLabel,
  givenSteps,
  labelMap,
  mouseEnterByLabel,
  mouseLeaveByLabel,
  opinionatedSteps,
  powerDatePickerSteps,
  powerSelectSteps,
  REGEX_LABEL,
  selectorFromLabel,
  setupDictionary,
  thenSteps,
  transformsMap,
  triggerByLabel,
  triggerKeyByLabel,
  whenSteps
};
