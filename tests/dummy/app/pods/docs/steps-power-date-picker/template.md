# ember-power-datepicker steps

Import:

```js
import powerDatePickerSteps from 'ember-cli-yadda-opinionated/test-support/steps/power-date-picker';
```

## Select a date

Selects a date in a date picker. Will automatically expand the datepicker and scoll to required date, then click on it.

Accepts a date in ISO format.

If the referenced element is not a date picker, a date picker will be looked up inside the referenced element.

**Signature**: `When I select date \"(.+)\" in the date picker $opinionatedElement`

**Expample**:

```feature
When I select "2018-01-01" in the date picker Release-Date-Field
```
