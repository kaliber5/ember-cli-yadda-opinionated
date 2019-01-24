# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]



## [0.3.1] - 2018-01-22

### Added

- The double click step.



## [0.3.0] - 2018-01-21

### Added

- The visibility assertion step.
- Step aliases.



## [0.2.1] - 2018-01-16

### Added

- Added and documented the  `clickByLabel` and `fillInByLabel` helpers for integration testing.

### Fixed

- Fixed import path for `findByLabel`.



## [0.2.0] - 2018-01-15

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



## [0.1.0] - 2018-01-14

First release.
