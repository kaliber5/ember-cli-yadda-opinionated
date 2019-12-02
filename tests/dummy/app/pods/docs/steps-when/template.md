# When steps

Import:

```js
import { whenSteps } from 'ember-cli-yadda-opinionated/test-support';
```



## Visit

Implements [`visit()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#visit) from `@ember/test-helpers`.

**Signature**: `When I (?:visit|am at|proceed to) URL $opinionatedString`.

**Examples**:

```feature
When I visit URL "/login"
When I am at URL "/products/1"
When I proceed to URL "/"
```



## Settled

Implements [`await settled()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#settled) from `@ember/test-helpers`.

**Signature**: `When the app settles`.

**Example**: `When the app settles`



## Click

Implements [`click()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#click) from `@ember/test-helpers`.

Will crash if no elements or more than one element matched.

**Signature**: `When I click (?:on )?$opinionated$opinionatedElement`.

**Examples**:

```feature
When I click the Submit-Button
When I click on the 2nd Menu-Item in the Navigation-Menu
```



## Double click

Implements [`doubleClick()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#click) from `@ember/test-helpers`.

Will crash if no elements or more than one element matched.

**Signature**: `When I double click (?:on )?$opinionatedElement`.

**Examples**:

```feature
When I double click the Submit-Button
When I double click on the 2nd Menu-Item in the Navigation-Menu
```



## Fill in

Implements [`fillIn()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) from `@ember/test-helpers`.

Will crash if no elements or more than one element matched.

If the referenced element is not fillable, a fillable element will be looked up inside the referenced element.

**Signature**: `When I fill \"(.*)\" into $opinionatedElement`.

**Example**: `When I fill "cheese" into the Username-Field`



## Mouse enter

Triggers the `mouseenter` event on the element.

Will crash if no elements or more than one element matched.

**Signature**: `When I move the mouse pointer into $opinionatedElement`.

**Example**: `When I move the mouse pointer into the Edit-Button`



## Mouse leave

Triggers the `mouseleave` event on the element.

Will crash if no elements or more than one element matched.

**Signature**: `When I move the mouse pointer out of $opinionatedElement`.

**Example**: `When I move the mouse pointer out of the Edit-Button`.



## Select/deselect checkbox or radio button

Selects or deselects given checkbox/radio.

The referenced element can be either an input or contain exactly one input.

Will crash if the input is already in the desired state.

A radio button cannot be deselected.

**Signature**: `When I (de)?select (?:the )?(?:radio button|checkbox) in $opinionatedElement`

Expamples:

```feature
When I select checkbox I-Am-Not-A-Robot-Field
When I the select checkbox I-Am-Not-A-Robot-Field
When I deselect checkbox I-Am-Not-A-Robot-Field
When I deselect the checkbox I-Am-Not-A-Robot-Field
When I select radio-button Prefer-Not-To-Tell
When I select the radio-button Prefer-Not-To-Tell
```



## Select/deselect checkbox or radio button corresponding to the label with given text

First, a `<label>` containing given text is looked up inside the given element.

Then a checkbox/radio is found that is associated with the label.

The checkbox/radio must either be inside the label or be refernced via the `for` attribute.

Will crash if more than one input exists inside the label.

Will crash if the input is already in the desired state.

A radio button cannot be deselected.

**Signature**: `When I (de)?select (?:the )?(?:radio button|checkbox) $opinionatedString in $opinionatedElement`

Expamples:

```feature
When I select checkbox "I am not a robot" in the Sign-Up-Form
When I the select checkbox "I am not a robot" in the Sign-Up-Form
When I deselect checkbox "I am not a robot" in the Sign-Up-Form
When I deselect the checkbox "I am not a robot" in the Sign-Up-Form
When I select radio button "Prefer not to tell" in the Gender-Field
When I select the radio button "Prefer not to tell" in the Gender-Field
```

