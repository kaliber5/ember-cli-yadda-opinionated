# Mapping labels to selectors

Sometimes you want your tests to operate on page elements produced by a third-party addon or library. You don't have control over its HTML output and thus can't sprinkle it with test selectors.

To resolve the issue, you can provide a mapping of labels to selectors. Do this in `tests/acceptanse/steps/steps.js` or `tests/test-helper.js`:

```js
import { setLabel } from 'ember-cli-yadda-opinionated';

setLabel('Bootstrap-Text-Input', 'input.form-control[type="text"]');
setLabel('Bootstrap-Textarea',   'textarea.form-control');
```

These labels will be automatically converted to selectors.

You should consider scoping those selectors with a library's unique HTML class, if available.
