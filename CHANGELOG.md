# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [1.0.0-beta.1] - 2020-01-14

### Fixed
- Made `chai-as-promised` a prod dependency.



## [1.0.0-beta.0] - 2019-12-03

### Changed
- ⚠ Min supported version of Ember CLI raised to 3.8.
- ⚠ The signature of many steps has changed, it now requires quotes for dynamic parts.
- ⚠ Label map is now accessible only through helper functions. Please update import paths.



## [0.12.2] - 2019-11-21

### Added
- A suite of steps for local storage.



## [0.12.1] - 2019-11-15

### Changed
- Improved error message that terminates scenario execution after another error.



## [0.12.0] - 2019-11-15

### Added
- QUnit support, fixes #3. 🎉

### Dependencies
- Upgraded Ember CLI to 3.13.1, upgraded dependencies.



## [0.11.0] - 2019-10-29

### Added
- config/environment step.

### Changed
- :warning: New installation step.



## [0.10.2] - 2019-10-23

### Added
- Mirage failure step.



## [0.10.1] - 2019-10-21

### Added
- Multilne element text step.



## [0.10.0] - 2019-09-17

### Added
- Support for polymorphic relationships in the Mirage seeding steps.



## [0.9.3] - 2019-08-21

### Added
- Focus in/out steps.
- The usage of NOT in steps is more flexible, allowing to use placeholders like this: `Then the Price should [Not] be "[Value]"`.
- Allow NOT steps to pass when no element is found.



## [0.9.2] - 2019-08-09

### Added
- The item text step can now use "be" in its phrasing.



## [0.9.1] - 2019-08-06

### Added
- Step for checking a value of an input/textarea/select inside given element.
- The `findEditable` DOM helper now accepts an option to exclude `contenteditable`.



## [0.9.0] - 2019-07-25

### Changed
- :warning: Fixed typo in helper name: `powerselectIsTriggerDisabled` → `powerSelectIsTriggerDisabled`.
- :warning: DOM helpers must now be imported from `ember-cli-yadda-opinionated/test-support/dom-helpers`.

## Fixed
- Support spaces in `data-test-` attribute values.
- Correctly work with nested components.

### Documentation
- Mention which DOM helpers are async.



## [0.8.0] - 2019-07-02

### Changed
- Removed power select and power date picker steps from the index file. Those steps can be imported from distinct locations (resolves #20):
  - `ember-cli-yadda-opinionated/test-support/steps/power-select`
  - `ember-cli-yadda-opinionated/test-support/steps/power-date-picker`

### Documentation
- Mention import paths of steps modules.


## [0.7.2] - 2019-04-10

### Fixed
- Fixed error message in the step for (de) selecting a radio button.
- Relying on regex `(.*)` instead of an undefined macro `$text`: better compatibilty and allows for empty strings


# [0.7.1] - 2019-03-13

### Added
- A "server.logging" step for Mirage which enables server logging for the current test.
- The "Element text" looks into the `value` attribue when used on an input or textarea.
- The `findEditable` helper will return the given element if its editable or will look up an editable element inside the given element.
- The `fillInByLabel` DOM helper now looks up an editable element via `findEditable`.

### Documentation
- Fixed the examples of the "Select/deselect checkbox or radio button corresponding to the label with given text" step.



## [0.7.0] - 2019-02-07

### Added
- `powerSelectIsTriggerDisabled` helper.
- Power Select step for checking the disabled state of the trigger.
- Steps for manipulating and checking steps of checkboxes and radios.

### Changed
- `findRadioForLabelWithText` renamed to `findInputForLabelWithText`

### Fixed
- Added missing exports for integration test helpers.



## [0.6.1] - 2019-02-23

### Added
- New steps:
  - Current URL pathname (URL without query params)
  - Query param presence in URL
  - Query param value in URL

### Fixed
- Power Select selected item step now correctly detects lack of trigger.



## [0.6.0] - 2019-02-12

### Added
- A bunch of new integration test helpers:
  - `findSelfOrChild` accepts an element and an HTML class name, returns self or a child with that class name.
  - `findAllByLabel` and `findSingleByLabel`: equivalent of `findByLabel` but returns element(s) rather than a tuple.
  - `triggerByLabel`, `mouseEnterByLabel`, `mouseLeaveByLabel`.
  - `findRadioForLabelWithText`.
  - `powerSelectFindSelectedOptions`, `powerSelectFilterSelectedOptionsByText`, `powerSelectIsSelectedOptionDisabled`, `powerSelectRemoveSelectedOption`.
  - `powerDatePickerFindTrigger`, `powerDatePickerFindDropdown`.
- A bunch of new steps:
  - Power Date Picker step for selecting a certain date.
  - Power Select steps:
    - Assert count of selected items.
    - Assert disabled state of a dropdown item targeted by index.
    - Assert disabled state of a dropdown item targeted by text and optional index.
    - Deselect a selected item targeted by index.
    - Deselect a selected item targeted by text and optional index.
    - Assert disabled state of a selected item targeted by index.
    - Assert disabled state of a selected item targeted by text and optional index.
  - Radio Button steps:
    - Select a certain radio by clicking on a corresponding label targeted by text.
    - Assert a certain radio button is selected targeted by text of a corresponding label.



### Changed
- The fill-in step will look up for a fillable child inside the referenced element, if the referenced element is not fillable. Will crash if more than one fillable child found.



### Fixed
- No longer crash by trying to mutate `DOMException` error message.



## [0.5.4] - 2019-02-07

### Added
- Select item by text for `ember-power-select`.

### Fixed
- Adjusted the logic of the seeding step.



## [0.5.3] - 2019-02-06

### Changed
- :warning: Changed the signature of element visibility step.
- :warning: The seeding step now properly looks up related record type instead of using relationship name as record type.



## [0.5.2] - 2019-02-04

### Added

- Trigger text step for `ember-power-select`.
- Select Nth item step for `ember-power-select`.
- Mirage DB record key/value step.



## [0.5.1] - 2019-01-31

### Added

- Nth item text step for `ember-power-select`.
- Error messages now contain detailed information: step, chosen step, args (including label, selector and found elements count). No need to pass those details manually! :D



## [0.5.0] - 2019-01-31

### Added

- Items count step for `ember-power-select`.



## [0.4.1] - 2019-01-29

### Added

- Mouseenter/mouseleave steps



## [0.4.0] - 2019-01-28

### Added

- The NOT modificator for then steps.
- The has HTML class step.
- The has HTML attr step.
- Non-existing step alias now triggers a meaningful error.

### Documentation

- Mentioned in the readme that steps defined with the chained syntax are harder to test than composable steps.
- Mentioned installation of `ember-cli-chai` and `chai-dom` as one of installation stpes.
- Made the description of the visibility step more correct.



## [0.3.1] - 2019-01-22

### Added

- The double click step.



## [0.3.0] - 2019-01-21

### Added

- The visibility assertion step.
- Step aliases.



## [0.2.1] - 2019-01-16

### Added

- Added and documented the  `clickByLabel` and `fillInByLabel` helpers for integration testing.

### Fixed

- Fixed import path for `findByLabel`.



## [0.2.0] - 2019-01-15

### Added
- Added a `setupDictionary` convenience helper to avoid populating a dictionary by hand, fixes #11.
- Added `opinionatedSteps` export that includes all available steps, fixes #10.
- Added support `first`, `second`, etc indices in addition to `1st`, `2nd`, etc.

### Changed

- Removed `ember-cli-release` since that addon develompment has stalled. Releases can be done with `npm` and `git`.
- Moved modules to the `-private/` subfolder, fixes #12
- Namespaced `table` and `element` converters as `opinionatedTable` and `opinionatedElement` to avoid conflicts.

### Documentation

- Added Table of Contents to the readme.
- Added readme badges.



## [0.1.0] - 2019-01-14

First release.
