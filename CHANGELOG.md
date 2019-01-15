# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Removed `ember-cli-release` since that addon develompment has stalled. Releases can be done with `npm` and `git`.
- Moved modules to the `-private/` subfolder, fixes #12
- Namespaced `table` and `element` converters as `opinionatedTable` and `opinionatedElement` to avoid conflicts.
- Offer a `setupDictionary` convenience helper instead of populating a dictionary by hand, fixes #11.

### Documentation

- Added Table of Contents to the readme.



## [0.1.0] - 2018-01-14

First release.
