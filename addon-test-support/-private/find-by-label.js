import { assert } from '@ember/debug';
import { findAll } from "@ember/test-helpers";
import { REGEX_SELECTOR_WITH_EQ } from 'ember-cli-yadda-opinionated/test-support/-private/regex';
import selectorFromLabel from 'ember-cli-yadda-opinionated/test-support/-private/selector-from-label';



export default function findByLabel(label, selector) {
  const selectorCompound = selectorFromLabel(label);
  const selectorsMaybeWithEq = selectorCompound.split(/\s+/);

  const collection = selectorsMaybeWithEq.reduce((parentCollection, selectorMaybeWithEq) => {
    return findElement(parentCollection, selectorMaybeWithEq);
  }, null);

  return [collection, label, selector];
}

export function findElement(parentCollection, selectorMaybeWithEq) {
  const [selector, index] = _parseSelectorMaybeWithEq(selectorMaybeWithEq);

  let resulingCollection =
    parentCollection
      ? parentCollection
          .map(parent => _findElement(parent, selector))
          .reduce((a, b) => a.concat(b), []) // flatten
          .filter((a) => a) // compact
      : _findElement(null, selector, index);

  return index == null
    ? resulingCollection
    : [resulingCollection[index]].filter((a) => a); // compact
}

export function _parseSelectorMaybeWithEq(selectorMaybeWithEq) {
  const matchResult = selectorMaybeWithEq.match(REGEX_SELECTOR_WITH_EQ);
  assert(`findByLabel failed to parse a selector: "${selectorMaybeWithEq}"`, matchResult);
  const [, selector, indexRaw] = matchResult;
  const index = indexRaw && parseInt(indexRaw, 10);
  return [selector, index];
}

export function _findElement(parent, selector) {
  const collection =
    parent
      ? parent.querySelectorAll(selector)
      : findAll(selector);

  return [...collection]; // cast NodeList to Array
}
