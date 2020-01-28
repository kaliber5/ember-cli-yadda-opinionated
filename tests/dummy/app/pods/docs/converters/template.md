# Using converters (macros)

## Defining custom converters

You can define custom converters [as explained in the Yadda guide](https://acuminous.gitbooks.io/yadda-user-guide/en/usage/dictionaries.html).

A good place for doing so is the `tests/acceptance/steps/steps.js` file.

Note that Yadda repo has [a few examples](https://github.com/acuminous/yadda/blob/master/examples/dictionary/dictionary-library.js).

## Using converters provided by ember-cli-yadda-opinionated

This addon provides a number of converters out of the box.

To enable them, you have to use the `setupDictionary` helper <LinkTo @route="docs.setup-steps-clean">in the setup guide</LinkTo>:

```js
import { setupDictionary } from 'ember-cli-yadda-opinionated/test-support';

export const dictionary =
  new yadda.Dictionary()
    .define('number', /(\d+)/, yadda.converters.integer); // Optionally, define csutom steps

setupDictionary(dictionary);
```

After that, the following converters become available in your step implementations. They are all namespaced with `opinionated`, in order to avoid accidentally overwriting them, which would break opinionated steps.

* `$opinionatedElement`: the reason why this addon exists. <LinkTo @route="docs.opinionated-element">It is documented here</LinkTo>.
* `$opinionatedString`: captures a string wrapped with double quotes. Returns the string with quotes omitted. Allows escaping quotes.
    Note: when defining a step implementation with single quotes or backticks, you must use double backslash to escape a quote:
    
        Then the Label should have text "Welcome to \"The Prancing Pony\" inn!"

* `$opinionatedInteger`: captures a number with `(\d+)`, converts it to a number. Uses `yadda.converters.integer`.
* `$opinionatedText`: captures everything, useful for multilne steps. See [docs](https://acuminous.gitbooks.io/yadda-user-guide/en/feature-specs/steps.html), [example usage](https://github.com/acuminous/yadda/blob/master/examples/multiline-steps/features/multiline-steps.feature), [example implementation](https://github.com/acuminous/yadda/blob/master/examples/multiline-steps/poem-library.js). The text is not converted, passed as-is. Yadda would automatically trim the indentation.
* `$opinionatedTable`: captures everything, converts to an array of objects using `yadda.converters.table`. See docs and examples for `opinionatedText`. The only difference is that the table itself should be formatted the same way as the [examples table](https://acuminous.gitbooks.io/yadda-user-guide/en/feature-specs/example-tables.html).
* `$opinionatedJSON`: captures everything, converts it with `JSON.parse`.
* `$opinionatedJSONObject`: same as above, but only matches when the string starts with `{`.
* `$opinionatedModelName`: accepts a quoted model name, returns it in a singularized, dasherized, unquoted form. Checks if a corresponding Mirage collection  exists and throws if it doesn't.
