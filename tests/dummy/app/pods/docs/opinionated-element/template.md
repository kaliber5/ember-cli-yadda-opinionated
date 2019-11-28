# Using labels in step implementations

The `$opinionatedElement` macro aka [converter](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html) accepts an <LinkTo @route="docs.labels">opinionated label</LinkTo> and returns an array of matching elements.

A step pattern `When I click $opinionatedElement` will match the following steps:

```feature
When I click Button
When I click a Button
When I click the 2nd Button in the Post-Edit-Form of the Active+Post
```

In each case, `$opinionatedElement` will resolve with a collection of matched buttons.

⚠ Note that it will always return an array, even for `a Button`. When only a single element is matched, the array will contain one element. If none are matched, the array will be empty.

The exact return value of `$opinionatedElement` is `[collection, label, selector]`. It is a tuple (an array with fixed number of elements) that contains:

* 0: `collection`: an array with matched elements.
* 1: `label`: the label used in the step name, useful for debugging.
* 2: `selector`: the selector that the label was converted to, useful for debugging.

In its simplest form, a clicking step could be implemented like this: 

```js
import {click} from `@ember/test-helpers`;

export {
  "When I click $opinionatedElement"([collection]) {
    const element = collection[0];
    return click(element);
  }
}
```

But this step will crash with a cryptic error in case the label didn't match an element. And if the element matched multiple elements, the outcome of the step may be unpredictable and hard to debug.

To resolve this issue, you should guard against it like this:

```js
import {click} from `@ember/test-helpers`;

export {
  "When I click $opinionatedElement"([collection, label, selector]) {
    if (collection.length !== 1) {
      throw new Error(`Expected label "${label}" (matched selector "${selector}") to target exactly one element, but ${collection.length} matched.`);
    }

    const element = collection[0];
    return click(element);
  }
}
```

Note: to throw assertion errors, you can use `assert` from `@ember/debug` or [chai](https://www.chaijs.com/).
