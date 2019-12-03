# Mixed steps setup

Use this approach when you need to use opinionated steps alongside conventional steps as suggested by `ember-cli-yadda`.

Note: this approach is only intended for legacy apps. For a greenfield test suite, we recommend using <LinkTo @route="docs.setup-steps-clean">the clean setup</LinkTo>.




## 1. Extend your dictionary

Keep the existing `tests/acceptance/steps/steps.js`, created by the `ember-cli-yadda` addon.

In that file, find this line:

```js
yadda.localisation.default.library()
```

Initialize a dictionary like this and pass it into the `library()` method:

```js
import { setupDictionary } from 'ember-cli-yadda-opinionated/test-support';

setupDictionary(dictionary);

yadda.localisation.default.library(dictionary)
```


## 2. Define custom macros (converters)

If needed, you can also add custom macros (aka [converters](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html#converters)) in the same file:

```js
import { setupDictionary } from 'ember-cli-yadda-opinionated/test-support';

const dictionary = new yadda.Dictionary()
  .define('number', /(\d+)/, yadda.converters.integer)
  .define('table', /([^\u0000]*)/, yadda.converters.table);

setupDictionary(dictionary)
```


## 3. Define custom labels

If needed, you can also add custom labels in the same file:

```js
import { composeSteps, setLabel, opinionatedSteps, setupDictionary } from 'ember-cli-yadda-opinionated/test-support';

setLabel('Bootstrap-Field-Error', '.help-block');
setLabel('Bootstrap-Primary-Button', '.btn-primary');
```


## 4. Compose steps in *-steps.js files

According to `ember-cli-yadda`, your `*-steps.js` files should look like this in their simplest form:

```js
import steps from './steps';

export default function(assert) {
  return steps(assert);
}
```

In order to include opinonated steps, you must use the `commposeSteps` util like this:

```js
// The main steps file
import steps from './steps';

import {
  composeSteps,   // The helper
  opinonatedSteps // The collection of opinonated steps
} from 'ember-cli-yadda-opinionated/test-support';

// Custom opioniated steps created by you
import authenticationSteps from './_authentication';
import localStorageSteps from './_local-storage';

export default composeSteps(steps, opinonatedSteps, localStorageSteps);
```

If your per-feature steps file contains conventional steps (non recommended), you can keep them like this:


```js
// The main steps file
import steps from './steps';

import {
  composeSteps,   // The helper
  opinonatedSteps // The collection of opinonated steps
} from 'ember-cli-yadda-opinionated/test-support';

// Custom opioniated steps created by you
import authenticationSteps from './_authentication';
import localStorageSteps from './_local-storage';

// Legacy per-feature steps
function featureSteps(assert) {
  return steps(assert)
    .given('I am logged in as a $role', function(role) {
      /* ... */
    })
    .then('I should be logged in', function() {
      assert.ok(/* ... */);
    })
}

export default composeSteps(featureSteps, opinonatedSteps, localStorageSteps);
```
