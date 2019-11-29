# Then steps

Import:

```js
import { thenSteps } from 'ember-cli-yadda-opinionated/test-support';
```

## Pause

When used without an argument, implements [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pauseTest) from `@ember/test-helpers`.

When used with a number, waits for given number of milliseconds, then waits for [settled state](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#settled).

Useful for debugging and waiting for processess that are not respected by `settled()`. Please note that doing so makes your tests slow and brittle. Instead, you should try making `settled()` aware of pending processes.

**Signature**: `Then pause(?: for ?(\\d+) ms)?`

**Examples**:

```feature
Then pause
Then pause for 50 ms
```



## Debugger

Implements `debugger()`. Useful for, you guessed it, debugging. :)

**Signature**: `Then debug(?:ger)?`

**Examples**:

```feature
Then debug
Then debugger
```



## Current URL

Checks the [`currentURL()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) to be an exact match of given URL.

**Signature**: `Then I should (?:still )?be (?:at|on) URL (.*)`.

**Example**:

```feature
Then I should be at URL /about
Then I should be on URL /products?expand=true
Then I still should be at URL /products/1
Then I still should be on URL /
```



## Current URL pathname

Checks the [`currentURL()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) pathname (without query params and hash) to be an exact match of given URL.

**Signature**: `Then current URL's pathname should be (.+)`.

**Example**:

```feature
Then current URL's pathname should be /about
Then current URL's pathname should be /
```

Incorret usage:

```feature
Then current URL's pathname should be /products?expand=true
```



## Query param presence

Checks the [`currentURL()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) contains or does not contain the specified query param.

**Signature**: `Then current URL should (not|NOT)? ?have query param \"(\\w+)\"`.

**Example**:

```feature
Then current URL should have query param "expand"
Then current URL should NOT have query param "utm_source"
```



## Query param presence value

Checks the [`currentURL()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillIn) contains a query param with or without given value.

Note: produces positive result when a query param is not present and the step is used with `NOT`.

**Signature**: `Then current URL should (not|NOT)? ?have query param \"(\\w+)\" with value \"(.*)\"`.

**Example**:

```feature
Then current URL should have query param "expand" with value "true"
Then current URL should NOT have query param "page" with value "1"
```



## Element existence

Checks for exactly the specified amount of given element(s) to exist in the DOM.

If number is not provided, it defaults to `1`.

If `NO` is provided, the number is set to `0`.

**Signature**: `Then there should be (NO |no )?(?:(\\d+) )?$opinionatedElement`.

**Example**:

```feature
Then there should be an Error-Message
Then there should be 2 Posts
Then there should be NO Comments
```

Invalid usage:

```feature
Then there should be NO 2 Comments
```



## Element visibility

Checks that exactly the specified amount of given element(s) exist in the DOM and all of them are visible.

If number is not provided, it defaults to `1`.

If `NOT` is provided, the number is set to `0`.

:warning: Uses jQuery [understanding](https://github.com/jquery/jquery/blob/3.3.1/src/css/hiddenVisibleSelectors.js#L12) of [visibility](https://api.jquery.com/visible-selector/).

Signatures:

* `Then (?:(\\d+) )?$opinionatedElement should (not|NOT)? ?be visible`
* `Then I should see (NO |no )?(?:(\\d+) )?$opinionatedElementke`

**Example**:

```feature
Then an Error-Message should be visible
Then 5 Error-Messages should be visible
Then NO Error-Messages should be visible
Then I should see a Post
Then I should see 2 Posts
Then I should see NO Posts
```

Invalid usage:

```feature
Then NO 2 Error-Messages should be visible
Then I should see NO 5 Posts
```



## Element text

Checks if given element's trimmed text is or is not equal to the given text.

Will crash if no elements or more than one element matched.

If an element is an input or a textarea, its `value` attribute will be checked instead. It will not be trimmed. 

**Signature**: `Then $opinionatedElement should (NOT | not )?(?:have text|say|be) \"(.*)\"`.

**Example**:

```feature
Then the Error-Message should have text "Something went wrong!"
Then the Error-Message should NOT have text "Something went wrong!"
Then the Title of 1st Post should say "Hello, World!"
Then the Title of 1st Post should NOT say "Hello, World!"
Then the Quantity of the Cart should be "2"
Then the Quantity of the Cart should NOT be "2"
```



## Element text (multiline)

Checks if given element's trimmed text is or is not equal to the given multiline text.

Will crash if no elements or more than one element matched.

If an element is an input or a textarea, its `value` attribute will be checked instead. It will not be trimmed. 

**Signature**: `Then $opinionatedElement should (not|NOT)? ?have the following text:\n$opinionatedText`.

**Example**:

```feature
Then the Error-Message should have the following text:
  ------------
  System Error
  Networ down
  ------------

Then the Error-Message should NOT have the following text:
  ------------
  System Error
  Networ down
  ------------
```



## Element value

Checks if given element's value is equal to the given text.

Will crash if no elements or more than one element matched, except when NOT is passed.

If the referenced element is not editable, then an editable element will be looked up inside the referenced element. Exactly one input/textarea/select is expected to be found inside the given element.

**Signature**: `Then $opinionatedElement should (not|NOT)? ?have value \"(.*)\"`.

**Example**:

```feature
Then the Description-Field should say "Hello, World!"
Then the Description-Field should NOT say "Hello, World!"
```



## State of checkbox or radio button

Checks the state of a given checkbox/radio.

The referenced element can be either an input or contain exactly one input.

Will crash if no elements or more than one element matched, except when NOT is passed.

**Signature**: `Then (?:the )?(?:radio button|checkbox) $opinionatedElement should (not|NOT)? ?be selected`

Expamples:

```feature
Then checkbox I-Am-Not-A-Robot-Field should be selected
Then the checkbox I-Am-Not-A-Robot-Field should be selected
Then checkbox I-Am-Not-A-Robot-Field should NOT be selected
Then the checkbox I-Am-Not-A-Robot-Field should NOT be selected
Then radio button Prefer-Not-To-Tell should be selected
Then the radio button Prefer-Not-To-Tell should be selected
Then radio button Prefer-Not-To-Tell should NOT be selected
Then the radio button Prefer-Not-To-Tell should NOT be selected
```



## State of checkbox or radio button corresponding to the label with given text

Checks the state of checkbox/radio that is associated with a label containing provided text.

First, a `<label>` containing given text is looked up inside the given element.

Then a checkbox/radio is found that is associated with the label.

The checkbox/radio must either be inside the label or be refernced via the `for` attribute.

Will crash if no elements or more than one element matched, except when NOT is passed.

Will crash if more than one input exists inside the label.

**Signature**: `Then (?:the )?(?:radio button|checkbox) \"(.+?)\" should (not|NOT)? ?be selected in $opinionatedElement`

Expamples:

```feature
Then checkbox "I am not a robot" in the Sign-Up-Form should be selected
Then the checkbox "I am not a robot" in the Sign-Up-Form should be selected
Then checkbox "I am not a robot" in the Sign-Up-Form should NOT be selected
Then the checkbox "I am not a robot" in the Sign-Up-Form should NOT be selected
Then radio-button "Prefer not to tell" in the Gender-Field should be selected
Then the radio-button "Prefer not to tell" in the Gender-Field should be selected
Then radio-button "Prefer not to tell" in the Gender-Field should NOT be selected
Then the radio-button "Prefer not to tell" in the Gender-Field should NOT be selected
```



## Element HTML class

Checks if given element has given HTML class.

Will crash if no elements or more than one element matched, except when NOT is passed.

**Signature**: `Then $opinionatedElement should have (not|NOT)? ?HTML class \"(.*)\"`.

**Example**:

```feature
Then the second Menu-Item should have HTML class "active"
Then the second Menu-Item should NOT have HTML class "active"
```



## Element HTML attr

Checks if given element has given HTML attr. Optionally checks the attr to match given value.

Will crash if no elements or more than one element matched, except when NOT is passed.

**Signature**: `Then $opinionatedElement should (not|NOT)? ?have HTML attr \"(.*)\"(?: with value \"(.+?)\")?`.

**Example**:

```feature
Then the second Menu-Item should have HTML attr "href"
Then the second Menu-Item should have HTML attr "href" with value "/products"
Then the second Menu-Item should NOT have HTML attr "href"
Then the second Menu-Item should NOT have HTML attr "href" with value "/products"
```


## Mirage attr value

Checks if given attr of a record of given type and id has given value.

Value is expected to be JSON (including string, number and `null`).

**Signature**: `Then record of type (\\w+) and id (\\w+) should have attribute (\\w+) with value (.+)`.

**Example**:

```feature
Then record of type Post and id 1 should have attribute authorId with value "alice1"
```



## Compare local storage value to a string (single line)

**Signature**: `Then local storage value for $opinionatedString should (not |NOT )be equal to $opinionatedString`

Value is a string which can contain JSON or anything else.

Allows escaping double quotes.

**Example**:

```
Given local storage key "my-app-config" is set to "foo"
Given local storage key "my-app-config" is set to "{\\"id\\": \\"foo\\"}"
```


## Compare local storage value to a string (multiline)

**Signature**: `Then local storage value for $opinionatedString should (not |NOT )be equal to the following value:\n$opinionatedText`

**Example**:

```
Then local storage value for "my-app-config" should NOT be equal to the following text:
  -----------
  Hello world
  -----------
```


## Assert local storage value is deeply equal to a JSON

**Signature**: `Then local storage value for $opinionatedString should (not |NOT )be deeply equal to the following JSON:\n$opinionatedJSON`

**Example**:

```
Then local storage value for "my-app-config" should be deeply equal to the following JSON:
  -----------------------------------------
  {
    "id": "foo",
    "createdAt": "2019-11-21T08:28:59.973Z"
  }
  -----------------------------------------
```


## Assert local storage value is a subset of a JSON

**Signature**: `Then local storage value for $opinionatedString should (not |NOT )be a subset of the following JSON:\n$opinionatedText`

**Example**:

```
Then local storage value for "my-app-config" should be a subset of the following JSON:
  -----------------------------------------
  {
    "id": "foo",
    "createdAt": "2019-11-21T08:28:59.973Z"
  }
  -----------------------------------------
```


## Assert local storage value is a superset of a JSON

**Signature**: `Then local storage value for $opinionatedString should (not |NOT )be a superset of the following JSON:\n$opinionatedText`

**Example**:

```
Then local storage value for "my-app-config" should be a superset of the following JSON:
  -----------------------------------------
  {
    "id": "foo",
    "createdAt": "2019-11-21T08:28:59.973Z"
  }
  -----------------------------------------
```


## Local storage key existence

**Signature**: `Then local storage key $opinionatedString should (not |NOT )?exist`

**Examples**:

```
Then local storage key "my-app-config" should exist
Then local storage key "my-app-config" should not exist
Then local storage key "my-app-config" should NOT exist
```


## Local storage emptiness

**Signature**: `Then local storage should (not |NOT )?be empty`

**Examples**:

```
Then local storage should be empty
Then local storage should not be empty
Then local storage should NOT be empty
```