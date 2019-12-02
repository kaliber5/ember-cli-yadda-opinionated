# In integration tests

`ember-cli-yadda-opinionated` offers a number of helpers, some which are equivalents of helpers from `@ember/test-helpers`:

```js
import {
  findByLabel,
  clickByLabel
} from 'ember-cli-yadda-opinionated/test-support/dom-helpers;
```

## Universal

* `findByLabel(label)` — eqauivalent of `findAll`, but returns a tuple `[collection, label, selector]`, where `collection` is an array of found elements. Useful for making meaningful assertion error messages.
* `findAllByLabel(label)` — eqauivalent of `findAll`. Returns an array of found elements.
* `findSingleByLabel(label)` — eqauivalent of `find`. Returns an element. Will crash if found more than one element or no elements.
* `await clickByLabel(label)` — equivalent of `click`. Will crash if found more than one element or no elements. Is async.
* `await doubleClickByLabel(label)` — equivalent of `doubleClick`. Will crash if found more than one element or no elements. Is async.
* `fillInByLabel(label, text)` —  looks up a fillable element via `findEditable`, then applies `fillIn` to it. Will crash if found more than one element or no elements.
* `findEditable(element, shouldIncludeContentEditable)` — returns current element if it's editable (a non-hidden input, textarea, select or contenteditable). If not, will look up such an element inside the given element. Will crash if found more than one element or no elements. Set `shouldIncludeContentEditable` to `false` to exclude contenteditable.
* `await triggerByLabel(label, eventName, options)` — equivalent of `triggerEvent`. Will crash if found more than one element or no elements. Is async.
* `await triggerKeyByLabel(label, eventName, options)` — equivalent of `triggerEvent`. Will crash if found more than one element or no elements. Is async.
* `await mouseEnterByLabel(label)` — triggers the `mouseenter` event on the element. Will crash if found more than one element or no elements. Is async.
* `await mouseLeaveByLabel(label)` — triggers the `mouseleave` event on the element. Will crash if found more than one element or no elements. Is async.
* `findInputForLabelWithText(text, parent)` — finds an input on the page by searching for a label element with given text, then looking up an input that corresponds to the label. Parent is optional.
* `findSelfOrChild(element, htmlClass)`: accepts a DOM element and an HTML class. Returns either the element or the first matching child.


## Power Select

### By label

* `powerSelectFindTriggerByLabel(label)` - find a power select inside given element or selector (including self).
* `powerSelectFindDropdownByLabel(label)` - find a dropdown containing a list of options options corresponding to a given trigger.
* `await powerSelectFindOptionsByLabel(label)` - find a options inside a dropdown corresponding to a given trigger. Will expand the dropdown if not already. Is async.
* `await powerSelectSelectOptionByLabelAndIndex(label, index)` - clicks on Nth option in a power select. Is async.
* `powerSelectFindSelectedOptionsByLabel(label)` - find selected options inside a given trigger (for multi-select dropdown).
* `powerSelectFilterSelectedOptionsByLabelAndText(label, text)` - filter selected options by text.
* `powerSelectIsSelectedOptionDisabledByLabelAndIndex(label, index)` - checks if given selected option is disabled (locked).
* `powerSelectIsSelectedOptionDisabledByLabelAndText(label, text)` - checks if given selected option is disabled (locked), expects only one selected option to match text.
* `powerSelectIsTriggerDisabledByLabel(label)` - returns `true` when given trigger is disabled.
* `await powerSelectRemoveSelectedOptionByLabelAndIndex(label, index)` - clicks on the remove button of the given selected option. Is async.
* `await powerSelectRemoveSelectedOptionByLabelAndText(label, text)` - clicks on the remove button of the given selected option, expects only one selected option to match text. Is async.
* `powerSelectIsDropdownExpandedByLabel(label)` - checks if a dropdown corresponding to given trigger is expanded.
* `await powerSelectExpandByLabel(label)` - clicks on given trigger, unless its dropdown is already expanded. Is async.
* `await powerSelectCollapseByLabel(label)` - clicks on given trigger, unless its dropdown is already collapsed. Is async.
* `powerSelectFindOptionByLabelAndValue(label, valueOrSelector, optionIndex = 0)` - finds an option by text (and index, in case of multiple options with same text). Expects the dropdown to be expanded.

### Low level

These helpers operate on selectors/elements rather than labels.

* `powerSelectFindTrigger(triggerOrSelector)` - find a power select inside given element or selector (including self).
* `powerSelectFindDropdown(trigger)` - find a dropdown containing a list of options options corresponding to a given trigger.
* `powerSelectFindOptions(trigger)` - find a options inside a dropdown corresponding to a given trigger. Expects the dropdown to be expanded.
* `powerSelectFindSelectedOptions(trigger)` - find selected options inside a given trigger (for multi-select dropdown).
* `powerSelectFilterSelectedOptionsByText(selectedOptions, text)` - filter selected options by text.
* `powerSelectIsSelectedOptionDisabled(option)` - checks if given selected option is disabled (locked).
* `powerSelectIsTriggerDisabled(trigger)` - returns `true` when given trigger is disabled.
* `powerSelectRemoveSelectedOption(option)` - clicks on the remove button of the given selected option.
* `powerSelectIsDropdownExpanded(trigger)` - checks if a dropdown corresponding to given trigger is expanded.
* `await powerSelectExpand(trigger)` - clicks on given trigger, unless its dropdown is already expanded. Is async.
* `await powerSelectCollapse(trigger)` - clicks on given trigger, unless its dropdown is already collapsed. Is async.
* `powerSelectFindOptionByValueOrSelector(trigger, valueOrSelector, optionIndex = 0)` - finds an option by text (and index, in case of multiple options with same text). Expects the dropdown to be expanded.'


## Power Date Picker

* `powerDatePickerFindTrigger(triggerOrSelector)` - finds a power date picker inside given element (including self).
* `powerDatePickerFindTriggerByLabel(label)` - finds a power date picker inside given element (including self).
* `powerDatePickerFindDropdown()` - finds a power date picker dropdown (globally, does not require a selector/label).
