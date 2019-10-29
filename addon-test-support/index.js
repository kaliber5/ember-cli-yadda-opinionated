import composeSteps from 'ember-cli-yadda-opinionated/test-support/-private/compose-steps';
import { element } from 'ember-cli-yadda-opinionated/test-support/-private/converters';

import {
  REGEX_LABEL
} from 'ember-cli-yadda-opinionated/test-support/-private/regex';

import { labelMap, transformsMap } from 'ember-cli-yadda-opinionated/test-support/-private/maps';
import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';
import setupYaddaOpinionated from 'ember-cli-yadda-opinionated/test-support/-private/setup';
import setupDictionary from 'ember-cli-yadda-opinionated/test-support/-private/setup-dictionary';
import givenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/given';
import thenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/then';
import whenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/when';

const opinionatedSteps = {...givenSteps, ...whenSteps, ...thenSteps};

export {
  composeSteps,
  element,
  givenSteps,
  labelMap,
  opinionatedSteps,
  REGEX_LABEL,
  selectorFromLabel,
  setupDictionary,
  setupYaddaOpinionated,
  thenSteps,
  transformsMap,
  whenSteps
};
