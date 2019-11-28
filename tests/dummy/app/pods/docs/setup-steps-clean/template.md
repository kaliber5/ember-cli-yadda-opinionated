# Clean steps setup

Use this approach if you're not going to compine the opinionated approach with the conventional one.



## Set up steps.js

Put this into `tests/acceptance/steps/steps.js`:

```js
import yadda from 'yadda';
import { composeSteps/* , labelMap */, opinionatedSteps, setupDictionary } from 'ember-cli-yadda-opinionated/test-support';

/* Import optional steps */
// import powerSelectSteps from 'ember-cli-yadda-opinionated/test-support/steps/power-select';
// import powerDatePickerSteps from 'ember-cli-yadda-opinionated/test-support/steps/power-date-picker';

/* Import own steps like this */
// import meainingfulStepsCollectionName from './_meaningful-steps-collection-name';

/* Declare custom labels like this */
// labelMap.set('Bootstrap-Field-Error', '.help-block');
// labelMap.set('Bootstrap-Primary-Button', '.btn-primary');

/*
  Set up custom converters (aka macros)
  Docs: https://github.com/acuminous/yadda-user-guide/blob/master/en/usage/dictionaries.md#converters
  Example: https://github.com/acuminous/yadda/blob/v2.1.0/examples/dictionary/dictionary-library.js#L13-L18
*/
export const dictionary =
  new yadda.Dictionary()
    .define('number', /(\d+)/, yadda.converters.integer);

/* Set up opinionated converters (macros) */
setupDictionary(dictionary);

/* Uncomment to enable logging, helpful with Mocha */y 
// if (config.settings.debug) {
//   yadda.EventBus.instance().on(yadda.EventBus.ON_EXECUTE, function(event: any) {
//     console.debug(`Step: ${event.data.step}`, event.data);
//   });
// }

export default composeSteps(
  () => yadda.localisation.default.library(dictionary),
  opinionatedSteps,
  
  /* Optional steps */
  // powerSelectSteps,
  // powerDatePickerSteps,

  /* Own steps */
  // meainingfulStepsCollectionName,
);
```

In this file you can:

* Import custom step implementations, if you have them.
* Declare custom macros (converters).
* Declare custom labels.



## Set up individual step files

In the `tests/acceptance/steps/` directory, replace the content of every `*-steps.js` file with the following:

```js
export { default } from './steps';
```
