# ember-power-select steps

Import:

```js
import powerSelectSteps from 'ember-cli-yadda-opinionated/test-support/steps/power-select';
```

## Item count

Checks if a `ember-power-select` contains the specified number of items.

Will crash if no elements or more than one element matched the power select.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `Then there should be (NO|no )?(?:(\\d+) )items? in the dropdown $opinionatedElement`.

**Example**:

```feature
Then there should be NO items in the dropdown Pet
Then there should be 1 item in the dropdown Pet
Then there should be 2 items in the dropdown Pet
```



## Selected Item count

Checks if a `ember-power-select` contains the specified number of selected items (in multiple mode).

Will crash if no elements or more than one element matched the power select.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `Then there should be (NO|no )?(?:(\\d+) )items? in the dropdown $opinionatedElement`.

**Example**:

```feature
Then there should be NO selected items in the dropdown Pet
Then there should be 1 selected item in the dropdown Pet
Then there should be 2 selected items in the dropdown Pet
```



## Text of trigger

Checks if an `ember-power-select` trigger contains the specified trimmed text.

Will crash if no elements or more than one element matched the power select.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `Then the dropdown $opinionatedElement should have \"(.*)\" selected`.

**Example**:

```feature
Then the dropdown Pet should have "Rex" selected
```



## Text of item by index

Checks if Nth item in an `ember-power-select` contains the specified trimmed text.

Will crash if no elements or more than one element matched the power select.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item in the dropdown $opinionatedElement should (not |NOT )?(?:have text|say|be) \"(.*)\"`.

**Example**:

```feature
Then the first item in the dropdown Pet should say "Tom"
Then the first item in the dropdown Pet should be "Tom"

# Checks against the first item. Does not assert the amount of items.
Then the item in the dropdown Pet should have text "Rex"
```



## Select item by index

Clicks Nth item in an `ember-power-select`.

Will crash if no elements or more than one element matched the power select.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `When I select (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item in the dropdown $opinionatedElement`.

**Example**:

```feature
When I select the second item in the dropdown Pet

# Checks against the first item. Does not assert the amount of items.
When I select the item in the dropdown Pet
```



## Select item by text

Clicks an item in an `ember-power-select` selected by text content or selector provided.

Will crash if no elements or more than one element matched the power select.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `When I select (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?item \"(.+)\" in the dropdown $opinionatedElement`.

**Example**:

```feature
When I select item "Rex" in the dropdown Pet

# In case multiple elements with the same name exist
When I select first item "Rex" in the dropdown Pet
```



## Deselect selected item by index

Clicks Nth selected item in an `ember-power-select`.

Will crash if no elements or more than one element matched the power select.

Will crash if the number provided is larger than the number of selected items.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `When I deselect (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item in the dropdown $opinionatedElement`.

**Example**:

```feature
When I select the second item in the dropdown Pet

# Checks against the first item. Does not assert the amount of items.
When I select the item in the dropdown Pet
```



## Deselect selected item by text

Clicks a selected item's remove button in an `ember-power-select`. The selected item is found by text content.

Will crash if no elements or more than one element matched the power select.

Will crash if the number provided is larger than the number of selected items having given text.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `When I deselect (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item \"(.+)\" in the dropdown $opinionatedElement`.

**Example**:

```feature
When I deselect selected item "Rex" in the dropdown Pet

# In case multiple elements with the same name exist
When I deselect first selected item "Rex" in the dropdown Pet
```


## Disabled status of selected item by index

Checks that Nth selected item in an `ember-power-select` is locked.

Will crash if no elements or more than one element matched the power select.

Will crash if the number provided is larger than the number of selected items.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item in the dropdown $opinionatedElement should (not |NOT )?be disabled`.

**Example**:

```feature
Then the second selected item in the dropdown Pet should be disabled

# Checks against the first item. Does not assert the amount of items.
Then the selected item in the dropdown Pet should be disabled
```



## Disabled status of selected item by text

Checks that a certain selected item in an `ember-power-select` is locked. The selected item is found by text content.

Will crash if no elements or more than one element matched the power select.

Will crash if the number provided is larger than the number of selected items having given text.

If the referenced element is not a power select, a power select will be looked up inside the referenced element.

**Signature**: `Then (?:(?:a|an|the) )?(?:(\\d+)(?:st|nd|rd|th) |(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) )?selected item \"(.+)\" in the dropdown $opinionatedElement should (not |NOT )?be disabled`.

**Example**:

```feature
Then selected item "Rex" in the dropdown Pet should be disabled

# In case multiple elements with the same name exist
Then the first selected item "Rex" in the dropdown Pet should be disabled
```

