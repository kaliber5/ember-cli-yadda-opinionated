import composeSteps from 'ember-cli-yadda-opinionated/test-support/-private/compose-steps';
import { element } from 'ember-cli-yadda-opinionated/test-support/-private/converters';

import {
  REGEX_LABEL
} from 'ember-cli-yadda-opinionated/test-support/-private/regex';

import { labelMap, transformsMap } from 'ember-cli-yadda-opinionated/test-support/-private/maps';
import { clickByLabel, fillInByLabel, findByLabel } from 'ember-cli-yadda-opinionated/test-support/-private/dom-helpers';
import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';
import setupDictionary from 'ember-cli-yadda-opinionated/test-support/-private/setup-dictionary';
import givenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/given';
import powerSelectSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/power-select';
import thenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/then';
import whenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/when';

const opinionatedSteps = {...givenSteps, ...whenSteps, ...thenSteps};

export {
  clickByLabel,
  composeSteps,
  element,
  fillInByLabel,
  findByLabel,
  givenSteps,
  labelMap,
  opinionatedSteps,
  powerSelectSteps,
  REGEX_LABEL,
  selectorFromLabel,
  setupDictionary,
  thenSteps,
  transformsMap,
  whenSteps
};
