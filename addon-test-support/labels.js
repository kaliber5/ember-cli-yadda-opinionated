import { assert } from '@ember/debug';
import { dasherize }  from '@ember/string';
import { findAll } from "@ember/test-helpers";

import {
  REGEX_ITEM_MATCHING,
  REGEX_SEPARATOR,
  REGEX_SELECTOR_WITH_EQ
} from './regex';

import labelMap from './label-map';

export function selectorFromLabel(label) {
  return label
    .split(new RegExp(REGEX_SEPARATOR))
    .reverse()
    .map((label) => {
      const matchResult = label.match(REGEX_ITEM_MATCHING);

      assert(`selectorFromLabel failed to parse the label: "${label}"`, matchResult);

      const [, article, indexOneStr, subAttrRaw, valueRaw] = matchResult;
//
      let result;
      if (labelMap.has(subAttrRaw)) {
        result = labelMap.get(subAttrRaw);
      } else {
        const subAttr = dasherize(subAttrRaw);
        const value = valueRaw ? `="${valueRaw}"` : '';
        result = `[data-test-${subAttr}${value}]`;
      }

      const indexZero =
        indexOneStr ? (parseInt(indexOneStr, 10) - 1) :
        article     ? 0                               :
        null;

      if (indexZero != null) {
        result += `:eq(${indexZero})`;
      }

      return result;
    })
    .join(" ");
}

export function findByLabel(label) {
  const selectorCompound = selectorFromLabel(label);
  const selectorsMaybeWithEq = selectorCompound.split(/\s+/);

  return selectorsMaybeWithEq.reduce((parent, selectorMaybeWithEq) => {
    return findElement(parent, selectorMaybeWithEq);
  }, null);
}

export function findElement(parentOrParents, selectorMaybeWithEq) {
  const [selector, index] = _parseSelectorMaybeWithEq(selectorMaybeWithEq);

  if (Array.isArray(parentOrParents)) {
    const collection = parentOrParents
      .map(parent => _findElement(parent, selector))
      .reduce((a, b) => a.concat(b), []) // flatten
      .filter((a) => a); // compact

    return index == null
      ? collection
      : (collection[index] || null);
  } else {
    return _findElement(parentOrParents, selector, index);
  }
}

export function _parseSelectorMaybeWithEq(selectorMaybeWithEq) {
  const matchResult = selectorMaybeWithEq.match(REGEX_SELECTOR_WITH_EQ);
  assert(`findByLabel failed to parse a selector: "${selectorMaybeWithEq}"`, matchResult);
  const [, selector, indexRaw] = matchResult;
  const index = indexRaw && parseInt(indexRaw, 10);
  return [selector, index];
}

export function _findElement(parent, selector, index) {
  const collection =
    parent
      ? parent.querySelectorAll(selector)
      : findAll(selector);

  return index == null
    ? [...collection] // cast NodeList to Array
    : (collection[index] || null);
}
