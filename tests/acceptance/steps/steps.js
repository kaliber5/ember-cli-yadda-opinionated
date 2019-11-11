// @ts-ignore
import yadda from 'yadda';

// @ts-ignore
import { composeSteps, labelMap, opinionatedSteps, setupDictionary } from 'ember-cli-yadda-opinionated/test-support';
// import composeSteps from 'ember-cli-yadda-opinionated/test-support/-private/compose-steps';
// import { labelMap } from 'ember-cli-yadda-opinionated/test-support/-private/maps';
// import setupDictionary from 'ember-cli-yadda-opinionated/test-support/-private/setup-dictionary';
// import thenSteps from 'ember-cli-yadda-opinionated/test-support/-private/steps/then';
// @ts-ignore
import powerSelectSteps from 'ember-cli-yadda-opinionated/test-support/steps/power-select';
// import powerDatePickerSteps from 'ember-cli-yadda-opinionated/test-support/steps/power-date-picker';

labelMap.set('Bootstrap-Field-Error', '.help-block');

export const dictionary = new yadda.Dictionary().define('number', /(\d+)/, yadda.converters.integer);

setupDictionary(dictionary);

// if (config.settings.debug) {
yadda.EventBus.instance().on(yadda.EventBus.ON_EXECUTE, function(event) {
  console.debug(`Step: ${event.data.step}`, event.data); // eslint-disable-line no-console
});
// }

export const allSteps = [];

export default composeSteps(
  () => yadda.localisation.default.library(dictionary),
  opinionatedSteps,
  powerSelectSteps,
  // powerDatePickerSteps,
);
