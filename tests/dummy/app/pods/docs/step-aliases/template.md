# Using step aliases

Sometimes it's useful to provide two different phrasings for the same step. Very often the prhasing are too different to cover them with a single regular expression.

You can resolve this by referencing one step from another like this:

```js
import {click} from `@ember/test-helpers`;

export {
  "When I click $opinionatedElement"([collection, label, selector]) {
    if (collection.length !== 1) {
      throw new Error(`Expected label "${label}" (matched selector "${selector}") to target exactly one element, but ${collection.length} matched.`);
    }

    const element = collection[0];
    return click(element);
  },

  "When $opinionatedElement is clicked": "When I click $opinionatedElement",
}
```
